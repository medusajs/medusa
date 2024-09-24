import {
  CustomFieldModel,
  isValidCustomFieldModel,
} from "@medusajs/admin-shared"
import {
  ExportDefaultDeclaration,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  NodePath,
  ObjectProperty,
} from "../babel"

export function getCustomFieldGraphPath(
  path: string,
  type: "field" | "config" | "display" | "link"
) {
  return `${path}/${type}`
}

export function getFormArray(path: NodePath<ExportDefaultDeclaration>) {
  if (!isCallExpression(path.node.declaration)) {
    return null
  }

  if (
    !isIdentifier(path.node.declaration.callee, {
      name: "defineCustomFieldsConfig",
    })
  ) {
    return null
  }

  const configArgument = path.node.declaration.arguments[0]

  if (!isObjectExpression(configArgument)) {
    return null
  }

  const formProperty = configArgument.properties.find((p) => {
    return isObjectProperty(p) && isIdentifier(p.key, { name: "forms" })
  }) as ObjectProperty | undefined

  if (!formProperty || !isArrayExpression(formProperty.value)) {
    return null
  }

  return formProperty.value
}

export function getModel(
  path: NodePath<ExportDefaultDeclaration>,
  model?: CustomFieldModel
): { model: CustomFieldModel; valid: true } | { model: null; valid: false } {
  if (!isCallExpression(path.node.declaration)) {
    return { model: null, valid: false }
  }

  if (
    !isIdentifier(path.node.declaration.callee, {
      name: "defineCustomFieldsConfig",
    })
  ) {
    return { model: null, valid: false }
  }

  const configArgument = path.node.declaration.arguments[0]

  if (!isObjectExpression(configArgument)) {
    return { model: null, valid: false }
  }

  const modelProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "model" })
  ) as ObjectProperty | undefined

  if (!modelProperty || !isStringLiteral(modelProperty.value)) {
    return { model: null, valid: false }
  }

  const modelValue = modelProperty?.value.value.trim()

  if (!isValidCustomFieldModel(modelValue)) {
    return { model: null, valid: false }
  }

  /**
   * If no model is provided, we assume the config is valid
   * as long as the modelValue is a valid custom field model
   */
  if (!model) {
    return { model: modelValue, valid: true }
  }

  const isMatch = model === modelValue

  if (!isMatch) {
    return { model: null, valid: false }
  }

  console.log("model", model, modelValue)
  return { model: modelValue, valid: true }
}
