import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
} from "typedoc"

export function getProjectChild(
  project: ProjectReflection,
  childName: string
): DeclarationReflection | undefined {
  let reflection: DeclarationReflection | undefined = project.getChildByName(
    childName
  ) as DeclarationReflection
  const splitChildName = childName.split(".")

  if (!reflection && splitChildName.length > 1) {
    reflection = getProjectChild(
      project,
      splitChildName[splitChildName.length - 1]
    )
  }

  if (
    !reflection &&
    project.parent &&
    project.parent instanceof ProjectReflection
  ) {
    reflection = getProjectChild(project.parent, childName)
  }

  if (!reflection) {
    const modules = project.getChildrenByKind(ReflectionKind.Module)
    for (const module of modules) {
      reflection = module.getChildByName(childName) as DeclarationReflection

      if (reflection) {
        break
      }
    }
  }

  return reflection
}
