import { ReferenceType, SignatureReflection, SomeType } from "typedoc"

export function isWorkflow(reflection: SignatureReflection): boolean {
  return (
    reflection.parent?.children?.some((child) => child.name === "runAsStep") ||
    false
  )
}

export function getWorkflowInputType(
  reflection: SignatureReflection
): SomeType | undefined {
  const exportedWorkflowType = getExportedWorkflowType(reflection)

  const inputType = exportedWorkflowType?.typeArguments![0]

  return isAllowedType(inputType) ? inputType : undefined
}

export function getWorkflowOutputType(
  reflection: SignatureReflection
): SomeType | undefined {
  const exportedWorkflowType = getExportedWorkflowType(reflection)

  const outputType = exportedWorkflowType?.typeArguments![1]

  return isAllowedType(outputType) ? outputType : undefined
}

function getExportedWorkflowType(
  reflection: SignatureReflection
): ReferenceType | undefined {
  if (
    !isWorkflow(reflection) ||
    reflection.type?.type !== "intersection" ||
    reflection.type.types.length < 2
  ) {
    return
  }

  const exportedWorkflowType = reflection.type.types[1]

  if (
    exportedWorkflowType.type !== "reference" ||
    exportedWorkflowType.name !== "ExportedWorkflow" ||
    (exportedWorkflowType.typeArguments?.length || 0) < 1
  ) {
    return
  }

  return exportedWorkflowType
}

const disallowedIntrinsicTypeNames = ["unknown", "void", "any", "never"]

function isAllowedType(type: SomeType | undefined): boolean {
  return (
    type !== undefined &&
    (type.type !== "intrinsic" ||
      !disallowedIntrinsicTypeNames.includes(type.name))
  )
}
