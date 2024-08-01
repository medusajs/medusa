export function checkSidebarItemVisibility(
  item: HTMLElement,
  withTransition = false,
  topMargin = 0
) {
  return withTransition
    ? checkSidebarItemVisibilityTransition(item, topMargin)
    : checkSidebarItemVisibilityRelative(item, topMargin)
}

function checkSidebarItemVisibilityRelative(
  item: HTMLElement,
  topMargin: number
) {
  const sidebar = document.getElementById("sidebar")
  if (!sidebar) {
    return false
  }
  const sidebarBoundingRect = sidebar.getBoundingClientRect()
  const sidebarTop = sidebarBoundingRect.top - topMargin
  const sidebarBottom = sidebarTop + sidebarBoundingRect.height
  const itemBoundingRect = item.getBoundingClientRect()
  const itemTop =
    item.offsetParent === sidebar ? item.offsetTop : itemBoundingRect.top
  const itemBottom = itemTop + itemBoundingRect.height

  return itemTop >= sidebarTop && itemBottom <= sidebarBottom
}

function checkSidebarItemVisibilityTransition(
  item: HTMLElement,
  topMargin: number
) {
  const sidebar = document.getElementById("sidebar")
  if (!sidebar) {
    return false
  }

  const sidebarBoundingRect = sidebar.getBoundingClientRect()
  const activeItemBoundingRect = item.getBoundingClientRect()

  return (
    activeItemBoundingRect.top >= topMargin &&
    activeItemBoundingRect.top - sidebarBoundingRect.height + topMargin < 0 &&
    activeItemBoundingRect.bottom > 0
  )
}
