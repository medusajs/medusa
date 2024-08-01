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
  const isTopItems = numbering.length === 1
  /** @type {import("@/types").SidebarItem[]} */
  const numberedItems = []
  /** @type {import("@/types").SidebarItem | undefined} */
  let parentItem
  sidebarItems.forEach((item) => {
    if (isTopItems) {
      // Add chapter category
      numberedItems.push({
        type: "category",
        title: `Chapter ${padNumber(numbering[0])}`,
        children: [],
        loaded: true,
      })

      parentItem = numberedItems[numberedItems.length - 1]
    }
    // append current number to the item's title
    item.number = `${numbering.join(".")}.`
    item.title = `${item.number} ${item.title.trim()}`

    if (item.children) {
      item.children = numberSidebarItems(item.children, [...numbering, 1])
    }

    if (parentItem) {
      parentItem.children.push(item)
    } else {
      numberedItems.push(item)
    }

    numbering[numbering.length - 1]++
  })

  return numberedItems
}

function padNumber(number) {
  number = number.toString()
  if (number.length < 2) {
    number = `0` + number
  }

  return number
}
