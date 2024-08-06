import {
  DeclarationReflection,
  IntrinsicType,
  ParameterReflection,
  Reflection,
} from "typedoc"

export function cleanUpHookInput(
  parameters: ParameterReflection[]
): ParameterReflection[] {
  return parameters.map((parameter) => {
    if (parameter.type?.type !== "reference" || !parameter.type.reflection) {
      return parameter
    }

    cleanUpReflectionType(parameter)

    if (
      parameter.type.reflection &&
      parameter.type.reflection instanceof DeclarationReflection &&
      parameter.type.reflection.children
    ) {
      parameter.type.reflection.children.forEach(cleanUpReflectionType)
    }

    return parameter
  })
}

function cleanUpReflectionType(reflection: Reflection): Reflection {
  if (
    !(reflection instanceof DeclarationReflection) &&
    !(reflection instanceof ParameterReflection)
  ) {
    return reflection
  }
  if (
    reflection.type?.type === "reference" &&
    reflection.type.name === "WorkflowData" &&
    reflection.type.typeArguments?.length
  ) {
    reflection.type = reflection.type.typeArguments[0]
  }

  if (reflection.defaultValue) {
    delete reflection.defaultValue
  }

  if (reflection.name === "additional_data") {
    reflection.type = new IntrinsicType("object")
  }

  if (reflection instanceof DeclarationReflection && reflection.children) {
    reflection.children.forEach(cleanUpReflectionType)
  }

  return reflection
}
