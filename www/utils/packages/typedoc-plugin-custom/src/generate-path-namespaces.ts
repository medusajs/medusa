import { minimatch } from "minimatch"
import {
  Application,
  Comment,
  Converter,
  DeclarationReflection,
  ParameterType,
  ProjectReflection,
  ReflectionKind,
} from "typedoc"
import { NamespaceGenerateDetails } from "types"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "enablePathNamespaceGenerator",
    type: ParameterType.Boolean,
    defaultValue: false,
    help: "Whether to enable the namespace generator plugin.",
  })
  app.options.addDeclaration({
    name: "generatePathNamespaces",
    type: ParameterType.Mixed,
    defaultValue: [],
    help: "The namespaces to generate.",
  })

  const generatedNamespaces: Map<string, DeclarationReflection> = new Map()

  app.converter.on(Converter.EVENT_BEGIN, (context) => {
    if (!app.options.getValue("enablePathNamespaceGenerator")) {
      return
    }

    const namespaces = app.options.getValue(
      "generatePathNamespaces"
    ) as unknown as NamespaceGenerateDetails[]

    const generatePathNamespaces = (
      ns: NamespaceGenerateDetails[],
      parent: ProjectReflection | DeclarationReflection = context.project
    ) => {
      const createdNamespaces: DeclarationReflection[] = []
      ns.forEach((namespace) => {
        const genNamespace = createNamespace(parent, namespace)

        generatedNamespaces.set(namespace.pathPattern, genNamespace)

        if (namespace.children) {
          generatePathNamespaces(namespace.children, genNamespace)
        }

        createdNamespaces.push(genNamespace)
      })

      return createdNamespaces
    }

    generatePathNamespaces(namespaces)
  })

  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context, reflection) => {
      if (!app.options.getValue("enablePathNamespaceGenerator")) {
        return
      }

      const isIgnored = reflection.comment?.modifierTags.has("@ignore")

      if (isIgnored) {
        return
      }

      const symbol = context.project.getSymbolFromReflection(reflection)
      const filePath = symbol?.valueDeclaration?.getSourceFile().fileName

      if (!filePath) {
        return
      }

      const namespaces = app.options.getValue(
        "generatePathNamespaces"
      ) as unknown as NamespaceGenerateDetails[]

      const findNamespace = (
        ns: NamespaceGenerateDetails[]
      ): DeclarationReflection | undefined => {
        let found: DeclarationReflection | undefined
        ns.some((namespace) => {
          if (namespace.children) {
            // give priorities to children
            found = findNamespace(namespace.children)
            if (found) {
              return true
            }
          }

          if (!minimatch(filePath, namespace.pathPattern)) {
            return false
          }

          found = generatedNamespaces.get(namespace.pathPattern)

          return found !== undefined
        })

        return found
      }

      const namespace = findNamespace(namespaces)

      if (namespace) {
        // Save original parent before addChild changes it
        const originalParent = reflection.parent

        // Single entry point: reflection is a direct project child
        context.project.removeChild(reflection)

        // Multiple entry points: reflection may be a child of a Module
        // (not project), so project.removeChild is a no-op — remove manually
        if (originalParent && !originalParent.isProject()) {
          const parentDecl = originalParent as DeclarationReflection
          if (parentDecl.children) {
            const idx = parentDecl.children.indexOf(reflection)
            if (idx !== -1) {
              parentDecl.children.splice(idx, 1)
            }
          }
        }

        namespace.addChild(reflection)
      }
    }
  )

  app.converter.on(Converter.EVENT_END, (context) => {
    generatedNamespaces.forEach((namespace) => {
      if (namespace.children?.length === 0) {
        return
      }

      const emptyChildren = namespace.children?.every(
        (child) =>
          !child.children?.some((c) => c.kind === ReflectionKind.Function)
      )

      if (emptyChildren) {
        context.project.removeChild(namespace)
      }
    })

    // Remove entry-point Module reflections that had all their children moved
    // to path namespaces (they would otherwise generate empty module pages)
    const emptyModules = (context.project.children || []).filter(
      (child) =>
        child.kind === ReflectionKind.Module &&
        (!child.children || child.children.length === 0)
    )
    emptyModules.forEach((mod) => context.project.removeChild(mod))
  })
}

function createNamespace(
  parent: DeclarationReflection | ProjectReflection,
  namespace: NamespaceGenerateDetails
): DeclarationReflection {
  const reflection = new DeclarationReflection(
    namespace.name,
    ReflectionKind.Namespace,
    parent
  )
  parent.addChild(reflection)

  if (namespace.description) {
    reflection.comment = new Comment([
      {
        kind: "text",
        text: namespace.description,
      },
    ])
  }

  return reflection
}
