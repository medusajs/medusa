import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
} from "typedoc"

export function getWorkflowReflectionFromNamespace(
  project: ProjectReflection,
  reflName: string
): DeclarationReflection | undefined {
  let found: DeclarationReflection | undefined
  project
    .getChildrenByKind(ReflectionKind.Module)
    .find((moduleRef) => moduleRef.name === "core-flows")
    ?.getChildrenByKind(ReflectionKind.Namespace)
    .some((namespace) => {
      found = namespace.getChildByName(reflName) as DeclarationReflection

      return found !== undefined
    })

  return found
}
