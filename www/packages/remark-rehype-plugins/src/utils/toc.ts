import { ToCItem } from "types"

export function getToc(
  items: Record<string, unknown>[],
  maxDepth: number
): ToCItem[] {
  const toc: ToCItem[] = []

  items.forEach((i) => {
    const depth = i.depth as number
    if (depth > maxDepth) {
      return
    }

    const tocItem: ToCItem = {
      title: i.value as string,
      level: depth,
      id: i.id as string,
      children: [],
    }

    if (i.children && Array.isArray(i.children) && i.children.length > 0) {
      tocItem.children = getToc(i.children, maxDepth)
    }

    toc.push(tocItem)
  })

  return toc
}

export function getTocJSX(toc: ToCItem[]): any[] {
  return toc.map((item) => {
    const itemData = {
      type: "ObjectExpression",
      properties: [
        {
          type: "Property",
          key: { type: "Identifier", name: "title" },
          value: { type: "Literal", value: item.title },
          kind: "init",
          computed: false,
          method: false,
          shorthand: false,
        },
        {
          type: "Property",
          key: { type: "Identifier", name: "level" },
          value: { type: "Literal", value: item.level },
          kind: "init",
          computed: false,
          method: false,
          shorthand: false,
        },
        {
          type: "Property",
          key: { type: "Identifier", name: "id" },
          value: { type: "Literal", value: item.id },
          kind: "init",
          computed: false,
          method: false,
          shorthand: false,
        },
      ],
    }

    if (item.children && item.children.length > 0) {
      itemData.properties.push({
        type: "Property",
        key: { type: "Identifier", name: "children" },
        value: {
          type: "ArrayExpression",
          elements: getTocJSX(item.children),
        },
        kind: "init",
        computed: false,
        method: false,
        shorthand: false,
      } as any)
    }

    return itemData
  })
}
