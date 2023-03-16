function reverseSidebarItems(sidebarItems, categoryItem) {
  let result = sidebarItems
  if (categoryItem.customProps?.reverse) {
    // Reverse items in categories
    result = result.map((item) => {
      if (item.type === 'category') {
        return {...item, items: reverseSidebarItems(item.items, categoryItem)};
      }
      return item;
    });
    // Reverse items at current level
    // use localeCompare since the reverse array method doesn't account for
    // numeric strings
    result.sort((a, b) => {
      const aToCompare = a.id || a.href || a.value || ""
      const bToCompare = b.id || b.href || b.value || ""
      const comparison = aToCompare.localeCompare(bToCompare, undefined, { numeric: true })

      return comparison < 0 ? 1 : (comparison > 0 ? -1 : 0)
    })
  }
  return result;
}

module.exports = reverseSidebarItems