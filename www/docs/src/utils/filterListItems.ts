export default function filterListItems (items: any[], pathPattern: string | RegExp) {
  if (!items.length) {
    return items
  }

  let pattern = new RegExp(pathPattern)

  return items.filter((item) => pattern.test(item.href))
}