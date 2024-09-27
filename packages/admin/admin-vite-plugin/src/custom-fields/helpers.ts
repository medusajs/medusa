import {
  CustomFieldModel,
  isValidCustomFieldModel,
} from "@medusajs/admin-shared"
import {
  ExportDefaultDeclaration,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  isTemplateLiteral,
  NodePath,
  ObjectExpression,
  ObjectProperty,
} from "../babel"
import { logger } from "../logger"

export function getModel(
  path: NodePath<ExportDefaultDeclaration>,
  file: string
): CustomFieldModel | null {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return null
  }

  const modelProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "model" })
  ) as ObjectProperty | undefined

  if (!modelProperty) {
    return null
  }

  if (isTemplateLiteral(modelProperty.value)) {
    logger.warn(
      `'model' property cannot be a template literal (e.g. \`product\`).`,
      { file }
    )
    return null
  }

  if (!isStringLiteral(modelProperty.value)) {
    logger.warn(
      `'model' is invalid. The 'model' property must be a string literal, e.g. 'product' or 'customer'.`,
      { file }
    )
    return null
  }

  const model = modelProperty.value.value.trim()

  if (!isValidCustomFieldModel(model)) {
    logger.warn(
      `'model' is invalid, received: ${model}. The 'model' property must be set to a valid model, e.g. 'product' or 'customer'.`,
      { file }
    )
    return null
  }

  return model
}

export function getConfigArgument(
  path: NodePath<ExportDefaultDeclaration>
): ObjectExpression | null {
  if (!isCallExpression(path.node.declaration)) {
    return null
  }

  if (
    !isIdentifier(path.node.declaration.callee, {
      name: "unstable_defineCustomFieldsConfig",
    })
  ) {
    return null
  }

  const configArgument = path.node.declaration.arguments[0]

  if (!isObjectExpression(configArgument)) {
    return null
  }

  return configArgument
}

/**
 * Validates that the 'link' property is present in the custom field config.
 * @param path - The NodePath to the export default declaration.
 * @param file - The file path.
 * @returns - True if the 'link' property is present, false otherwise.
 */
export function validateLink(
  path: NodePath<ExportDefaultDeclaration>,
  file: string
): boolean {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return false
  }

  const linkProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "link" })
  ) as ObjectProperty | undefined

  if (!linkProperty) {
    logger.warn(`'link' property is missing.`, { file })
    return false
  }

  return true
}
