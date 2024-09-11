import { ContainerId, FormId } from "@medusajs/admin-shared"
import {
  ExportDefaultDeclaration,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  NodePath,
  ObjectProperty,
} from "../babel"

function getCustomFieldPath(path: string, type: "form" | "container") {
  return `${path}/${type}`
}

export function getCustomFieldContainerPath(path: string) {
  return getCustomFieldPath(path, "container")
}

export function getCustomFieldFormPath(path: string) {
  return getCustomFieldPath(path, "form")
}

export function validateEntrypoint(
  path: NodePath<ExportDefaultDeclaration>,
  id?: ContainerId | FormId
): boolean {
  if (!id) {
    return true
  }

  if (!isCallExpression(path.node.declaration)) {
    return false
  }

  if (
    !isIdentifier(path.node.declaration.callee, {
      name: "defineCustomFieldsConfig",
    })
  ) {
    return false
  }

  const configArgument = path.node.declaration.arguments[0]

  if (!isObjectExpression(configArgument)) {
    return false
  }

  const entryPointProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "entryPoint" })
  ) as ObjectProperty | undefined

  // make sure the entrypoint is a string literal
  if (!entryPointProperty || !isStringLiteral(entryPointProperty.value)) {
    return false
  }

  const entryPoint = entryPointProperty?.value.value

  if (!entryPoint) {
    return false
  }

  const idPrefix = id.split(".")[0]

  return entryPoint === idPrefix
}
