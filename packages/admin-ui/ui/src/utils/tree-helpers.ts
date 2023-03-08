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
