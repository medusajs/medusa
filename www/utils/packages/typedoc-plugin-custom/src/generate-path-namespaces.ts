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
        context.project.removeChild(reflection)
        namespace?.addChild(reflection)
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
