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

  return exportedWorkflowType?.typeArguments![0]
}

export function getWorkflowOutputType(
  reflection: SignatureReflection
): SomeType | undefined {
  const exportedWorkflowType = getExportedWorkflowType(reflection)

  return exportedWorkflowType?.typeArguments![1]
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
