import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReferenceType,
} from "typedoc"
import { RELATION_NAMES, getDmlProperties, isDmlEntity } from "utils"

export class DmlRelationsResolver {
  private app: Application
  private dmlReflectionsAndProperties: {
    reflection: DeclarationReflection
    properties: DeclarationReflection[]
  }[]
  private relationProperties: {
    property: DeclarationReflection
    target: DeclarationReflection
  }[]

  constructor(app: Application) {
    this.app = app
    this.dmlReflectionsAndProperties = []
    this.relationProperties = []

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
      this.resolveRelationReferences.bind(this),
      1
    )

    // this.app.converter.on(
    //   Converter.EVENT_RESOLVE_BEGIN,
    //   this.resolveRelationTargets.bind(this),
    //   -1
    // )
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

  resolveRelationReferences(context: Context) {
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
        this.relationProperties.push({
          property,
          target: relatedReflection,
        })
      })
    })
  }

  resolveRelationTargets(context: Context) {
    if (!this.app.options.getValue("resolveDmlRelations")) {
      return
    }
    this.relationProperties.forEach(({ property, target }) => {
      const targetSymbol = context.project.getSymbolFromReflection(target)
      if (property.type?.type !== "reference" || !targetSymbol) {
        return
      }
      // change reference to the target itself.
      property.type = ReferenceType.createResolvedReference(
        `DmlEntity`,
        target,
        context.project
      )
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
