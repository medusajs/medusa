import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionKind,
} from "typedoc"

const MAX_LEVEL = 3

export function getProjectChild(
  project: ProjectReflection,
  childName: string,
  level = 1
): DeclarationReflection | undefined {
  let reflection: DeclarationReflection | undefined = project.getChildByName(
    childName
  ) as DeclarationReflection
  const splitChildName = childName.split(".")
  const canExpandFurther = level <= MAX_LEVEL

  if (!reflection && splitChildName.length > 1 && canExpandFurther) {
    reflection = getProjectChild(
      project,
      splitChildName[splitChildName.length - 1],
      level + 1
    )
  }

  if (
    !reflection &&
    project.parent &&
    project.parent instanceof ProjectReflection &&
    canExpandFurther
  ) {
    reflection = getProjectChild(project.parent, childName, level + 1)
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
