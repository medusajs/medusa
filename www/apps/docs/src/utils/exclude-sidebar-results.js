function excludeSidebarResults(sidebarItems, categoryItem) {
  const results = []
  sidebarItems.forEach((item) => {
    if (item.type === "category") {
      results.push({
        ...item,
        items: excludeSidebarResults(item.items, categoryItem),
      })
    } else if (!item.customProps?.exclude_from_auto_sidebar) {
      return results.push(item)
    }
  })

  return results
}

module.exports = excludeSidebarResults
