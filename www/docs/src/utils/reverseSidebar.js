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
    result.reverse();
  }
  return result;
}

module.exports = reverseSidebarItems