module.exports = function reverseSidebarItems(items) {
  // Reverse items in categories
  const result = items.map((item) => {
    if (item.type === 'category' && item.customProps?.sort === 'desc') {
      return {...item, items: reverseSidebarItems(item.items)};
    }
    return item;
  });
  return result;
}