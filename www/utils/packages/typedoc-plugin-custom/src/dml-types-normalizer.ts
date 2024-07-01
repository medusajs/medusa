import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReflectionFlag,
} from "typedoc"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "normalizeDmlTypes",
    help: "Whether to normalize DML types.",
    type: ParameterType.Boolean,
    defaultValue: false,
  })

  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    (_context: Context, reflection: DeclarationReflection) => {
      normalizeNullable(reflection)
    },
    2
  )
}

function normalizeNullable(reflection: DeclarationReflection) {
  if (
    reflection.type?.type !== "reference" ||
    reflection.type.name !== "NullableModifier" ||
    !reflection.type.typeArguments ||
    reflection.type.typeArguments?.length < 2
  ) {
    return
  }

  const actualType = reflection.type.typeArguments[1]

  if (actualType.type !== "reference") {
    return
  }

  // change the property's type to reference the actual type
  reflection.type = actualType
  // set a flag on the property to consider it optional
  reflection.setFlag(ReflectionFlag.Optional)
}
