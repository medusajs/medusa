export default function checkElementInViewport(
  element: Element,
  percentage = 100,
  height?: number
) {
  const rect = element.getBoundingClientRect()
  const windowHeight =
    height || window.innerHeight || document.documentElement.clientHeight

  return !(
    Math.floor(100 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100) <
      percentage ||
    Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) <
      percentage
  )
}
