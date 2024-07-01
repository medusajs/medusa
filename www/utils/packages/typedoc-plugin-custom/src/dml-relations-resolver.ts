import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReferenceType,
} from "typedoc"
import { getDmlProperties, isDmlEntity } from "utils"
import { RELATION_NAMES } from "./constants"

export class DmlRelationsResolver {
  private app: Application
  private dmlReflectionsAndProperties: {
    reflection: DeclarationReflection
    properties: DeclarationReflection[]
  }[]

  constructor(app: Application) {
    this.app = app
    this.dmlReflectionsAndProperties = []

    this.app.options.addDeclaration({
      name: "resolveDmlRelations",
      help: "Whether to enable resolving DML relations.",
      type: ParameterType.Boolean,
      defaultValue: false,
    })

    this.app.converter.on(
      Converter.EVENT_CREATE_DECLARATION,
      this.addReflection.bind(this)
    )

    this.app.converter.on(
      Converter.EVENT_RESOLVE_BEGIN,
      this.resolveRelations.bind(this)
    )
  }

  addReflection(_context: Context, reflection: DeclarationReflection) {
    if (!this.app.options.getValue("resolveDmlRelations")) {
      return
    }
    if (isDmlEntity(reflection)) {
      this.dmlReflectionsAndProperties?.push({
        reflection,
        properties: getDmlProperties(reflection.type as ReferenceType),
      })
    }
  }

  resolveRelations(context: Context) {
    if (!this.app.options.getValue("resolveDmlRelations")) {
      return
    }
    this.dmlReflectionsAndProperties.forEach(({ properties }) => {
      properties.forEach((property) => {
        if (
          property.type?.type !== "reference" ||
          !RELATION_NAMES.includes(property.type.name)
        ) {
          return
        }

        // try to find the reflection that this relation points to
        const relatedReflectionType = property.type.typeArguments?.[0]
        if (
          relatedReflectionType?.type !== "reflection" ||
          !relatedReflectionType.declaration.signatures?.length ||
          relatedReflectionType.declaration.signatures[0].type?.type !==
            "reference"
        ) {
          return
        }

        const relatedReflection = this.findReflectionMatchingProperties(
          getDmlProperties(relatedReflectionType.declaration.signatures[0].type)
        )

        if (!relatedReflection) {
          return
        }

        // replace type argument with reference to related reflection
        property.type.typeArguments = [
          ReferenceType.createResolvedReference(
            relatedReflection.name,
            relatedReflection,
            context.project
          ),
        ]
      })
    })
  }

  findReflectionMatchingProperties(
    properties: DeclarationReflection[]
  ): DeclarationReflection | undefined {
    return this.dmlReflectionsAndProperties.find(({ properties: refProps }) => {
      return properties.every((property) => {
        return refProps.find(
          (refProp) =>
            refProp.name === property.name &&
            (refProp.type as ReferenceType).name ===
              (property.type as ReferenceType).name
        )
      })
    })?.reflection
  }
}
