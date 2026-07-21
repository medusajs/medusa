import { Parameter } from "../types.js"

type FormatParameterComponentProps = {
  parameterComponent: string | undefined
  componentItems: Parameter[]
  sectionTitle: string
  extraProps?: Record<string, unknown>
}

/**
 * Function passed to an a Parameter array's sort method. It sorts
 * parameter items by whether they're optional or not. So, required items
 * are placed first in the array.
 */
function componentItemsSorter(a: Parameter, b: Parameter): number {
  if (a.optional) {
    return 1
  }
  if (b.optional) {
    return -1
  }

  return 0
}

/**
 * Function that goes through items and their children to apply the
 * {@link componentItemsSorter} function on them and sort the items.
 */
function sortComponentItems(items: Parameter[]): Parameter[] {
  items.sort(componentItemsSorter)
  items = items.map((item) => {
    if (item.children) {
      item.children = sortComponentItems(item.children)
    }

    return item
  })

  return items
}

export function formatParameterComponent({
  parameterComponent,
  componentItems,
  extraProps,
  sectionTitle,
}: FormatParameterComponentProps): string {
  let extraPropsArr: string[] = []
  if (extraProps) {
    extraPropsArr = Object.entries(extraProps).map(([key, value]) => {
      const valueJSON = JSON.stringify(value)
      const valueStr = typeof value !== "string" ? `{${valueJSON}}` : valueJSON
      return `${key}=${valueStr}`
    })
  }
  // reorder component items to show required items first
  componentItems = sortComponentItems(componentItems)
  return `<${parameterComponent} types={${JSON.stringify(
    componentItems
  )}} ${extraPropsArr.join(" ")} sectionTitle="${sectionTitle}"/>`
}
