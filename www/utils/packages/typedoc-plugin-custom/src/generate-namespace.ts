import { minimatch } from "minimatch"
import {
  Application,
  Comment,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReflectionKind,
} from "typedoc"
import { NamespaceGenerateDetails } from "types"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "enableNamespaceGenerator",
    type: ParameterType.Boolean,
    defaultValue: false,
    help: "Whether to enable the namespace generator plugin.",
  })
  app.options.addDeclaration({
    name: "generateNamespaces",
    type: ParameterType.Mixed,
    defaultValue: [],
    help: "The namespaces to generate.",
  })

  const generatedNamespaces: Map<string, DeclarationReflection> = new Map()

  app.converter.on(Converter.EVENT_BEGIN, (context) => {
    if (!app.options.getValue("enableNamespaceGenerator")) {
      return
    }

    const namespaces = app.options.getValue(
      "generateNamespaces"
    ) as unknown as NamespaceGenerateDetails[]

    namespaces.forEach((namespace) => {
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

      generatedNamespaces.set(namespace.pathPattern, genNamespace)
    })
  })

  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (context, reflection) => {
      if (!app.options.getValue("enableNamespaceGenerator")) {
        return
      }

      const symbol = context.project.getSymbolFromReflection(reflection)
      const filePath = symbol?.valueDeclaration?.getSourceFile().fileName

      if (!filePath) {
        return
      }

      generatedNamespaces.forEach((namespace, pathPattern) => {
        if (!minimatch(filePath, pathPattern)) {
          return
        }

        namespace.addChild(reflection)
      })
    }
  )
}
