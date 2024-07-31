/**
 *
 * @param {import("@/types").SidebarItem[]} sidebarItems - The items to add numbers to their titles
 * @param {number[]} numbering - The current numbering level
 * @returns {import("@/types").SidebarItem[]} The modified sidebar items
 */
export default function numberSidebarItems(sidebarItems, numbering = [1]) {
  // TODO generate chapter titles
  if (!numbering.length) {
    numbering.push(1)
  }
  sidebarItems.forEach((item) => {
    // append current number to the item's title
    item.number = `${numbering.join(".")}.`
    item.title = `${item.number} ${item.title.trim()}`

    if (item.children) {
      item.children = numberSidebarItems(item.children, [...numbering, 1])
    }

    numbering[numbering.length - 1]++
  })

  return sidebarItems
}
