export const checkDisplay = element => {
  const mc = element.closest("#method-container")

  //if no closest method container exists then it is a section and we can scroll
  if (!mc) return true

  const style = getComputedStyle(mc)
  if (style.display === "none") {
    return false
  } else {
    return true
  }
}
