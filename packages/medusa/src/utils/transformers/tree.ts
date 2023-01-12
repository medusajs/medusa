import { pick } from "lodash"
import { isDefined } from "medusa-core-utils"
import { filter, isNull } from "lodash"

// TODO: When we implement custom queries for tree paths in medusa, remove the transformer
// Adding this here since typeorm tree repo doesn't allow configs to be passed
// onto its children nodes. As an alternative, we are transforming the data post query.
export function transformTreeNodesWithConfig(
  object,
  config,
  scope = {},
  isParentNode = false
) {
  const selects = (config.select || []) as string[]
  const relations = (config.relations || []) as string[]
  const selectsAndRelations = selects.concat(relations)

  for (const [key, value] of Object.entries(scope)) {
    const modelValue = object[key]

    if (isDefined(modelValue) && modelValue !== value) {
      return null
    }
  }

  if (object.parent_category) {
    object.parent_category = transformTreeNodesWithConfig(
      object.parent_category,
      config,
      scope,
      true
    )
  }

  if (!isParentNode && (object.category_children || []).length > 0) {
    object.category_children = object.category_children.map((child) => {
      return transformTreeNodesWithConfig(child, config, scope)
    })

    object.category_children = filter(
      object.category_children,
      (el) => !isNull(el)
    )
  }

  return pick(object, selectsAndRelations)
}
