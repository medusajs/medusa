export const flattenCategoryTree = (rootCategories) => {
  return rootCategories.reduce((acc, category) => {
    if (category?.category_children.length) {
      acc = acc
        .concat(flattenCategoryTree(category.category_children))
        .concat(category)
    } else {
      acc.push(category)
    }

    return acc
  }, [])
}

export const getAncestors = (targetNode, nodes, acc = []) => {
  let parentCategory = null

  acc.push(targetNode)

  if (targetNode.parent_category_id) {
    parentCategory = nodes.find((n) => n.id === targetNode.parent_category_id)

    acc = getAncestors(parentCategory, nodes, acc)
  }

  if (!parentCategory) {
    return acc.reverse()
  }

  return acc
}
