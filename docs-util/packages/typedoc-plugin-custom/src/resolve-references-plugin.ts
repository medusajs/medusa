import { ok } from "assert"
import {
  Application,
  Context,
  Converter,
  ReflectionKind,
  TypeScript as ts,
  ReferenceType,
  Reflection,
  DeclarationReflection,
  ProjectReflection,
  ParameterType,
} from "typedoc"

let hasMonkeyPatched = false

export function load(app: Application) {
  if (hasMonkeyPatched) {
    throw new Error("typedoc-plugin-custom cannot be loaded multiple times")
  }
  hasMonkeyPatched = true

  app.options.addDeclaration({
    name: "internalModule",
    help: "Define the name of the module that internal symbols which are not exported should be placed into.",
  })

  app.options.addDeclaration({
    name: "enableInternalResolve",
    help: "Whether to run this plugin or not.",
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  let activeReflection: Reflection | undefined
  const referencedSymbols = new Map<ts.Program, Set<ts.Symbol>>()
  const symbolToActiveRefl = new Map<ts.Symbol, Reflection>()
  const knownPrograms = new Map<Reflection, ts.Program>()

  function discoverMissingExports(
    context: Context,
    program: ts.Program
  ): Set<ts.Symbol> {
    // An export is missing if if was referenced
    // Is not contained in the documented
    // And is "owned" by the active reflection
    const referenced = referencedSymbols.get(program) || new Set()
    const ownedByOther = new Set<ts.Symbol>()
    referencedSymbols.set(program, ownedByOther)

    for (const s of [...referenced]) {
      if (context.project.getReflectionFromSymbol(s)) {
        referenced.delete(s)
      } else if (symbolToActiveRefl.get(s) !== activeReflection) {
        referenced.delete(s)
        ownedByOther.add(s)
      }
    }

    return referenced
  }

  // Monkey patch the constructor for references so that we can get every
  const origCreateSymbolReference = ReferenceType.createSymbolReference
  ReferenceType.createSymbolReference = function (symbol, context, name) {
    if (!app.options.getValue("enableInternalResolve")) {
      return origCreateSymbolReference.call(this, symbol, context, name)
    }
    ok(activeReflection, "active reflection has not been set")
    const set = referencedSymbols.get(context.program)
    symbolToActiveRefl.set(symbol, activeReflection)
    if (set) {
      set.add(symbol)
    } else {
      referencedSymbols.set(context.program, new Set([symbol]))
    }
    return origCreateSymbolReference.call(this, symbol, context, name)
  }

  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context: Context, refl: Reflection) => {
      if (!app.options.getValue("enableInternalResolve")) {
        return
      }
      if (refl.kindOf(ReflectionKind.Project | ReflectionKind.Module)) {
        knownPrograms.set(refl, context.program)
        activeReflection = refl
      }
    }
  )

  app.converter.on(
    Converter.EVENT_RESOLVE_BEGIN,
    function onResolveBegin(context: Context) {
      if (!app.options.getValue("enableInternalResolve")) {
        return
      }
      const modules: (DeclarationReflection | ProjectReflection)[] =
        context.project.getChildrenByKind(ReflectionKind.Module)
      if (modules.length === 0) {
        // Single entry point, just target the project.
        modules.push(context.project)
      }

      for (const mod of modules) {
        activeReflection = mod

        const program = knownPrograms.get(mod)
        if (!program) {
          continue
        }
        let missing = discoverMissingExports(context, program)
        if (!missing || !missing.size) {
          continue
        }

        // Nasty hack here that will almost certainly break in future TypeDoc versions.
        context.setActiveProgram(program)

        const internalModuleOption =
          context.converter.application.options.getValue("internalModule")

        let internalNs: DeclarationReflection | undefined = undefined
        if (internalModuleOption) {
          internalNs = context
            .withScope(mod)
            .createDeclarationReflection(
              ReflectionKind.Module,
              void 0,
              void 0,
              context.converter.application.options.getValue("internalModule")
            )
          context.finalizeDeclarationReflection(internalNs)
        }

        const internalContext = context.withScope(internalNs || mod)

        // Keep track of which symbols we've tried to convert. If they don't get converted
        // when calling convertSymbol, then the user has excluded them somehow, don't go into
        // an infinite loop when converting.
        const tried = new Set<ts.Symbol>()

        do {
          for (const s of missing) {
            if (shouldConvertSymbol(s, context.checker)) {
              internalContext.converter.convertSymbol(internalContext, s)
            }
            tried.add(s)
          }

          missing = discoverMissingExports(context, program)
          for (const s of tried) {
            missing.delete(s)
          }
        } while (missing.size > 0)

        // remove paths from reflection name
        internalNs?.children?.forEach((item) => {
          if (item.name.indexOf(`"`) === 0) {
            item.name =
              context.converter.application.options.getValue("internalModule")
          }
        })

        // All the missing symbols were excluded, so get rid of our namespace.
        if (internalNs && !internalNs.children?.length) {
          context.project.removeReflection(internalNs)
        }

        context.setActiveProgram(void 0)
      }

      knownPrograms.clear()
      referencedSymbols.clear()
      symbolToActiveRefl.clear()
    },
    void 0,
    1e9
  )
}
function shouldConvertSymbol(symbol: ts.Symbol, checker: ts.TypeChecker) {
  while (symbol.flags & ts.SymbolFlags.Alias) {
    symbol = checker.getAliasedSymbol(symbol)
  }

  // We're looking at an unknown symbol which is declared in some package without
  // type declarations. We know nothing about it, so don't convert it.
  if (symbol.flags & ts.SymbolFlags.Transient) {
    return false
  }

  // This is something inside the special Node `Globals` interface. Don't convert it
  // because TypeDoc will reasonably assert that "Property" means that a symbol should be
  // inside something that can have properties.
  if (symbol.flags & ts.SymbolFlags.Property && symbol.name !== "default") {
    return false
  }

  return true
}
