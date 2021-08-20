const scrollParent = (parent, child) => {
  const parentRect = parent.getBoundingClientRect()

  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  }

  const childRect = child.getBoundingClientRect()
  const isViewable =
    childRect.top >= parentRect.top &&
    childRect.top <= parentRect.top + parentViewableArea.height

  if (!isViewable) {
    const pos = childRect.top + parent.scrollTop - parentRect.top
    parent.scrollTop = pos > 0 ? pos : 0
  }
}

export default scrollParent
