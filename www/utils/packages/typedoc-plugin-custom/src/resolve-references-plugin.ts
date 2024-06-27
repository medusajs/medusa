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
  ContainerReflection,
} from "typedoc"

declare module "typedoc" {
  export interface Reflection {
    [InternalModule]?: boolean
  }
}

const ModuleLike: ReflectionKind =
  ReflectionKind.Project | ReflectionKind.Module
const InternalModule = Symbol()

export function load(app: Application) {
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

  app.options.addDeclaration({
    name: "checkVariables",
    help: "Whether to check for and add variables.",
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  let referencedSymbols = new Map<ts.Program, Set<ts.Symbol>>()
  let symbolToOwningModule = new Map<ts.Symbol, Reflection>()
  let knownPrograms = new Map<Reflection, ts.Program>()
  let checkedVariableSymbols = false

  function discoverMissingExports(
    owningModule: Reflection,
    context: Context,
    program: ts.Program
  ): Set<ts.Symbol> {
    // An export is missing if if was referenced
    // Is not contained in the documented
    const referenced = referencedSymbols.get(program) || new Set()
    const ownedByOther = new Set<ts.Symbol>()
    referencedSymbols.set(program, ownedByOther)

    for (const s of [...referenced]) {
      if (context.project.getReflectionFromSymbol(s)) {
        referenced.delete(s)
      } else if (symbolToOwningModule.get(s) !== owningModule) {
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
    const owningModule = getOwningModule(context)
    const set = referencedSymbols.get(context.program)
    symbolToOwningModule.set(symbol, owningModule)
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
      // TypeDoc 0.26 doesn't fire EVENT_CREATE_DECLARATION for project
      // We need to ensure the project has a program attached to it, so
      // do that when the first declaration is created.
      if (knownPrograms.size === 0) {
        knownPrograms.set(refl.project, context.program)
      }
      if (refl.kindOf(ModuleLike)) {
        knownPrograms.set(refl, context.program)
      }
    }
  )

  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context: Context) => {
    if (!app.options.getValue("checkVariables") || checkedVariableSymbols) {
      return
    }
    checkedVariableSymbols = true

    context.program
      .getSourceFiles()
      .filter((file) =>
        app.entryPoints.some((entryPoint) => file.fileName.includes(entryPoint))
      )
      .forEach((file) => {
        if ("locals" in file) {
          const localVariables = file.locals as Map<string, ts.Symbol>
          if (!localVariables.size) {
            return
          }

          const internalNs = getOrCreateInternalNs({
            context,
            scope: context.project,
            nameSuffix: `${Math.random() * 100}`,
          })

          if (!internalNs) {
            return
          }

          const internalContext = context.withScope(internalNs)

          for (const [, value] of localVariables) {
            if (!value.valueDeclaration) {
              continue
            }
            if (shouldConvertSymbol(value, context.checker)) {
              internalContext.converter.convertSymbol(internalContext, value)
            }
          }
        }
      })
  })

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
        const program = knownPrograms.get(mod)
        if (!program) {
          continue
        }
        let missing = discoverMissingExports(mod, context, program)
        if (!missing || !missing.size) {
          continue
        }

        // Nasty hack here that will almost certainly break in future TypeDoc versions.
        context.setActiveProgram(program)

        const internalNs = getOrCreateInternalNs({ context, scope: mod })

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

          missing = discoverMissingExports(mod, context, program)
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

        if (
          internalContext.scope[InternalModule] &&
          !(internalContext.scope as ContainerReflection).children?.length
        ) {
          context.project.removeReflection(internalContext.scope)
        }

        context.setActiveProgram(void 0)
      }

      knownPrograms.clear()
      referencedSymbols.clear()
    },
    void 0
  )

  app.converter.on(Converter.EVENT_END, () => {
    ReferenceType.createSymbolReference = origCreateSymbolReference
    referencedSymbols = new Map()
    symbolToOwningModule = new Map()
    knownPrograms = new Map()
    checkedVariableSymbols = false
  })
}

function getOwningModule(context: Context): Reflection {
  let refl = context.scope
  // Go up the reflection hierarchy until we get to a module
  while (!refl.kindOf(ModuleLike)) {
    refl = refl.parent!
  }

  // The <internal> module cannot be an owning module.
  if (refl[InternalModule]) {
    return refl.parent!
  }

  return refl
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

function getOrCreateInternalNs({
  context,
  scope,
  nameSuffix = "",
}: {
  context: Context
  scope: Reflection
  nameSuffix?: string
}): DeclarationReflection | undefined {
  const internalNsName =
    context.converter.application.options.getValue("internalModule")
  if (!internalNsName) {
    return undefined
  }
  let internalNs = context.project.getChildByName(
    `${internalNsName}${nameSuffix}`
  ) as DeclarationReflection
  if (!internalNs) {
    internalNs = context
      .withScope(scope)
      .createDeclarationReflection(
        ReflectionKind.Module,
        void 0,
        void 0,
        `${internalNsName}${nameSuffix}`
      )
    context.finalizeDeclarationReflection(internalNs)
  }

  return internalNs
}
