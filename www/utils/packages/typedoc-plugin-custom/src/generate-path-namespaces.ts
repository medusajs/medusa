import { minimatch } from "minimatch"
import {
  Application,
  Comment,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
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

    const generatePathNamespaces = (ns: NamespaceGenerateDetails[]) => {
      const createdNamespaces: DeclarationReflection[] = []
      ns.forEach((namespace) => {
        const genNamespace = createNamespace(context, namespace)

        generatedNamespaces.set(namespace.pathPattern, genNamespace)

        if (namespace.children) {
          generatePathNamespaces(namespace.children).forEach((child) =>
            genNamespace.addChild(child)
          )
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

      namespace?.addChild(reflection)
    }
  )
}

function createNamespace(
  context: Context,
  namespace: NamespaceGenerateDetails
): DeclarationReflection {
  const genNamespace = context.createDeclarationReflection(
    ReflectionKind.Namespace,
    void 0,
    void 0,
    namespace.name
  )

  if (namespace.description) {
    genNamespace.comment = new Comment([
      {
        kind: "text",
        text: namespace.description,
      },
    ])
  }

  return genNamespace
}
