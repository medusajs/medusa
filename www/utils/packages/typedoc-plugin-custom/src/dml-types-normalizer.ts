import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReferenceType,
  ReflectionFlag,
  ReflectionKind,
} from "typedoc"
import { getDmlProperties, isDmlEntity } from "utils"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "normalizeDmlTypes",
    help: "Whether to normalize DML types.",
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    if (!app.options.getValue("normalizeDmlTypes")) {
      return
    }

    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.Variable
    )) {
      if (
        !(reflection instanceof DeclarationReflection) ||
        !isDmlEntity(reflection)
      ) {
        break
      }

      const properties = getDmlProperties(reflection.type as ReferenceType)

      properties.forEach((property) => {
        if (property.type?.type !== "reference") {
          return
        }

        normalizeNullable(property)
      })
    }
  })
}

function normalizeNullable(property: DeclarationReflection) {
  const propertyReference = property.type as ReferenceType
  if (
    propertyReference.name !== "NullableModifier" ||
    !propertyReference.typeArguments ||
    propertyReference.typeArguments?.length < 2
  ) {
    return
  }

  const actualType = propertyReference.typeArguments[1]

  if (actualType.type !== "reference") {
    return
  }

  // change the property's type to reference the actual type
  property.type = actualType
  // set a flag on the property to consider it optional
  property.setFlag(ReflectionFlag.Optional)
}
