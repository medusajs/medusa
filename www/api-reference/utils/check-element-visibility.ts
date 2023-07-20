export default function checkElementVisibility(
  item: Element,
  parent: Element,
  options?: {
    topMargin?: number
  }
) {
  const { topMargin = 0 } = options || {}
  const parentBoundingRect = parent.getBoundingClientRect()
  const activeItemBoundingRect = item.getBoundingClientRect()
  // if (!topMargin) {
  //   console.log(
  //     item,
  //     JSON.stringify(parentBoundingRect),
  //     JSON.stringify(activeItemBoundingRect)
  //   )
  // }
  return (
    activeItemBoundingRect.top >= topMargin &&
    activeItemBoundingRect.top - parentBoundingRect.height + topMargin < 0 &&
    activeItemBoundingRect.bottom > 0
  )
}
