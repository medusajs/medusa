import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
} from "typedoc"

export function tryToGetNamespace(
  project: ProjectReflection,
  type: "step" | "workflow"
): DeclarationReflection | undefined {
  const namespaceName = type === "step" ? "Steps" : "Workflows"

  return project
    .getChildrenByKind(ReflectionKind.Module)
    .find((moduleRef) => moduleRef.name === "core-flows")
    ?.getChildByName(namespaceName) as DeclarationReflection
}
