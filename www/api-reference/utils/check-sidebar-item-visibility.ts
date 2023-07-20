import checkElementVisibility from "./check-element-visibility"

export default function checkSidebarItemVisibility(
  item: Element,
  options?: {
    topMargin?: number
  }
) {
  const sidebar = document.getElementById("sidebar")
  if (!sidebar) {
    return false
  }

  return checkElementVisibility(item, sidebar, options)
}
