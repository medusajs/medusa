import { pick } from "lodash"

// TODO: When we implement custom queries for tree paths in medusa, remove the transformer
// Adding this here since typeorm tree repo doesn't allow configs to be passed
// onto its children nodes. As an alternative, we are transforming the data post query.
export function transformTreeNodesWithConfig(object, config) {
  const selects = (config.select || []) as string[]
  const relations = (config.relations || []) as string[]
  const selectsAndRelations = selects.concat(relations)

  if (object.parent_category) {
    object.parent_category = transformTreeNodesWithConfig(
      object.parent_category,
      config
    )
  }

  if ((object.category_children || []).length > 0) {
    object.category_children = object.category_children.map((child) => {
      return transformTreeNodesWithConfig(child, config)
    })
  }

  return pick(object, selectsAndRelations)
}
