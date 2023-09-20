export function checkSidebarItemVisibility(
  item: Element,
  options?: {
    topMargin?: number
  }
) {
  const sidebar = document.getElementById("sidebar")
  if (!sidebar) {
    return false
  }

  const { topMargin = 0 } = options || {}
  const sidebarBoundingRect = sidebar.getBoundingClientRect()
  const activeItemBoundingRect = item.getBoundingClientRect()

  return (
    activeItemBoundingRect.top >= topMargin &&
    activeItemBoundingRect.top - sidebarBoundingRect.height + topMargin < 0 &&
    activeItemBoundingRect.bottom > 0
  )
}
