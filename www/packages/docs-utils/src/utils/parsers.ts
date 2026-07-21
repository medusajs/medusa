import {
  ExpressionJsVar,
  Sidebar,
  UnistNode,
  UnistNodeWithData,
  UnistTree,
} from "types"
import { SKIP, VisitorResult } from "unist-util-visit"
import { estreeToJs } from "../estree-to-js.js"
import {
  isExpressionJsVarLiteral,
  isExpressionJsVarObj,
} from "../expression-is-utils.js"
import path from "path"
import { readFileSync } from "fs"
import type { Documentation } from "react-docgen"
import { workerCompatibleFetch } from "../worker-compatible-fetch.js"

export type ComponentParser<TOptions = any> = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options?: TOptions
) => VisitorResult | Promise<VisitorResult>

export const parseCard: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  let title: string | undefined,
    text: string | undefined,
    href: string | undefined
  node.attributes?.some((attr) => {
    if (title && text && href) {
      return true
    }
    if (attr.name === "title") {
      title = attr.value as string
    } else if (attr.name === "text") {
      text = attr.value as string
    } else if (attr.name === "href") {
      href = attr.value as string
    }
    return false
  })
  if (!title || !href) {
    return
  }
  parent?.children.splice(index, 1, {
    type: "paragraph",
    children: [
      {
        type: "link",
        url: href,
        children: [
          {
            type: "text",
            value: title,
          },
        ],
      },
      {
        type: "text",
        value: `: ${text}`,
      },
    ],
  })
  return [SKIP, index]
}

export const parseCardList: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const items = node.attributes?.find((attr) => attr.name === "items")
  if (!items || typeof items.value === "string" || !items.value.data?.estree) {
    return
  }

  const itemsJsVar = estreeToJs(items.value.data.estree)

  if (!itemsJsVar || !Array.isArray(itemsJsVar)) {
    return
  }

  const listItems = itemsJsVar
    .map((item) => {
      if (
        !isExpressionJsVarObj(item) ||
        !("title" in item) ||
        !("href" in item) ||
        !isExpressionJsVarLiteral(item.title) ||
        !isExpressionJsVarLiteral(item.href)
      ) {
        return null
      }
      const description = isExpressionJsVarLiteral(item.text)
        ? (item.text.data as string)
        : ""
      const children: UnistNode[] = [
        {
          type: "link",
          url: `${item.href.data}`,
          children: [
            {
              type: "text",
              value: item.title.data as string,
            },
          ],
        },
      ]
      if (description.length) {
        children.push({
          type: "text",
          value: `: ${description}`,
        })
      }
      return {
        type: "listItem",
        children: [
          {
            type: "paragraph",
            children,
          },
        ],
      }
    })
    .filter(Boolean) as UnistNode[]

  parent?.children.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  })
  return [SKIP, index]
}

export const parseCodeTabs: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const tabs = node.children?.filter((child) => child.name === "CodeTab")
  if (!tabs) {
    return
  }

  const children: UnistNode[] = []

  tabs.forEach((tab) => {
    const label = tab.attributes?.find((attr) => attr.name === "label")
    const code = tab.children?.find((child) => child.type === "code")

    if (!label || !code) {
      return
    }

    children.push(
      {
        type: "heading",
        depth: 3,
        children: [
          {
            type: "text",
            value: label.value as string,
          },
        ],
      },
      code
    )
  })

  parent?.children.splice(index, 1, ...children)
  return [SKIP, index]
}

export const parseDetails: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const summary = node.attributes?.find(
    (attr) => attr.name === "summaryContent"
  )

  const children: UnistNode[] = []

  if (summary?.value) {
    children.push({
      type: "heading",
      depth: 3,
      children: [
        {
          type: "text",
          value: (summary?.value as string) || "Details",
        },
      ],
    })
  }

  children.push(...(node.children || []))

  parent?.children.splice(index, 1, ...children)
  return [SKIP, index]
}

export const parseNote: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  parent.children?.splice(index, 1, ...(node.children || []))
  return [SKIP, index]
}

export const parsePrerequisites: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const items = node.attributes?.find((attr) => attr.name === "items")
  if (!items || typeof items.value === "string" || !items.value.data?.estree) {
    return
  }

  const itemsJsVar = estreeToJs(items.value.data.estree)

  if (!itemsJsVar || !Array.isArray(itemsJsVar)) {
    return
  }

  const listItems = itemsJsVar
    .map((item) => {
      if (
        !isExpressionJsVarObj(item) ||
        !("text" in item) ||
        !("link" in item) ||
        !isExpressionJsVarLiteral(item.text) ||
        !isExpressionJsVarLiteral(item.link)
      ) {
        return null
      }
      return {
        type: "listItem",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: `${item.link.data}`,
                children: [
                  {
                    type: "text",
                    value: item.text.data,
                  },
                ],
              },
            ],
          },
        ],
      }
    })
    .filter(Boolean) as UnistNode[]

  parent?.children.splice(
    index,
    1,
    {
      type: "heading",
      depth: 3,
      children: [
        {
          type: "text",
          value: "Prerequisites",
        },
      ],
    },
    {
      type: "list",
      ordered: false,
      spread: false,
      children: listItems,
    }
  )
  return [SKIP, index]
}

export const parseSourceCodeLink: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const link = node.attributes?.find((attr) => attr.name === "link")
  if (!link) {
    return
  }

  parent?.children.splice(index, 1, {
    type: "paragraph",
    children: [
      {
        type: "link",
        url: link?.value as string,
        children: [
          {
            type: "text",
            value: "Source code",
          },
        ],
      },
    ],
  })
  return [SKIP, index]
}

export const parseTable: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const headerNode = node.children?.find(
    (child) => child.name === "Table.Header"
  )
  const bodyNode = node.children?.find((child) => child.name === "Table.Body")

  let nodeText = ``
  let headerCellsCount = 0

  headerNode?.children?.forEach((headerRow, rowIndex) => {
    if (rowIndex > 0) {
      nodeText += `\n`
    }
    const childCells =
      headerRow.children?.length === 1 &&
      headerRow.children[0].type === "paragraph"
        ? headerRow.children[0].children
        : headerRow.children
    headerCellsCount = childCells?.length || 0
    childCells?.forEach((headerCell) => {
      if (headerCell.name !== "Table.HeaderCell") {
        return
      }
      nodeText += `|`
      nodeText += formatNodeText(getTextNode(headerCell))
    })
    nodeText += `|`
  })

  nodeText += `\n|${new Array(headerCellsCount).fill(`---`).join(`|`)}|`

  bodyNode?.children?.forEach((bodyRow) => {
    nodeText += `\n`
    bodyRow.children?.forEach((bodyCell) => {
      nodeText += `|`
      nodeText += formatNodeText(getTextNode(bodyCell))
    })
    nodeText += `|`
  })

  parent.children?.splice(index, 1, {
    type: "paragraph",
    children: [
      {
        type: "text",
        value: nodeText,
      },
    ],
  })
}

export const parseTabs: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  if ((node.children?.length || 0) < 2) {
    return
  }

  const tabs: UnistNode[] = []

  node.children![0].children?.forEach((tabList) => {
    tabList.children?.forEach((tabTrigger, index) => {
      const tabContentNode = node.children?.[1].children?.[index]
      const tabLabel = formatNodeText(getTextNode(tabTrigger))
      const tabContent = tabContentNode?.children || []
      if (!tabLabel || !tabContent) {
        return
      }

      tabs.push(
        {
          type: "heading",
          depth: 3,
          children: [
            {
              type: "text",
              value: tabLabel,
            },
          ],
        },
        ...tabContent
      )
    })
  })

  parent.children?.splice(index, 1, ...tabs)
  return [SKIP, index]
}

export const parseTypeList: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const types = node.attributes?.find((attr) => attr.name === "types")
  if (!types || typeof types.value === "string" || !types.value.data?.estree) {
    return
  }

  const typesJsVar = estreeToJs(types.value.data.estree)

  if (!typesJsVar || !Array.isArray(typesJsVar)) {
    return
  }

  const generateTypeListItems = (
    typesJsVar: ExpressionJsVar[]
  ): UnistNode[] => {
    const listItems: UnistNode[] = []

    typesJsVar.forEach((item) => {
      if (!isExpressionJsVarObj(item)) {
        return
      }

      const typeName = isExpressionJsVarLiteral(item.name) ? item.name.data : ""
      const itemType = isExpressionJsVarLiteral(item.type) ? item.type.data : ""
      const itemDescription = isExpressionJsVarLiteral(item.description)
        ? item.description.data
        : ""

      if (!typeName || !itemType) {
        return
      }

      const itemListChildren = item.children || []
      const children: UnistNode[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: `${typeName}: (${itemType}) ${itemDescription}`.trim(),
            },
          ],
        },
      ]

      if (Array.isArray(itemListChildren) && itemListChildren.length) {
        children.push(...generateTypeListItems(itemListChildren))
      }

      listItems.push({
        type: "listItem",
        children,
      })
    })

    return listItems
  }

  const listItems = generateTypeListItems(typesJsVar)

  parent?.children.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  })
  return [SKIP, index]
}

export const parseWorkflowDiagram: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const worflowItems = node.attributes?.find((attr) => attr.name === "workflow")
  if (
    !worflowItems ||
    typeof worflowItems.value === "string" ||
    !worflowItems.value.data?.estree
  ) {
    return
  }

  const workflowJsVar = estreeToJs(worflowItems.value.data.estree)

  if (
    !isExpressionJsVarObj(workflowJsVar) ||
    !("steps" in workflowJsVar) ||
    !Array.isArray(workflowJsVar.steps)
  ) {
    return
  }

  const generateWorkflowItems = (
    jsVarItems: ExpressionJsVar[]
  ): UnistNode[] => {
    const listItems: UnistNode[] = []

    jsVarItems.forEach((item) => {
      if (!isExpressionJsVarObj(item)) {
        return
      }

      const stepName = isExpressionJsVarLiteral(item.name) ? item.name.data : ""
      const stepDescription = isExpressionJsVarLiteral(item.description)
        ? item.description.data
        : ""
      const stepLink = isExpressionJsVarLiteral(item.link)
        ? (item.link.data as string)
        : `#${stepName}`

      if (!stepName) {
        return
      }

      const stepChildren = item.steps || []
      const children: UnistNode[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: stepLink,
              children: [
                {
                  type: "text",
                  value: `${stepName}`,
                },
              ],
            },
            {
              type: "text",
              value: `: ${stepDescription}`,
            },
          ],
        },
      ]

      if (Array.isArray(stepChildren) && stepChildren.length) {
        children.push(...generateWorkflowItems(stepChildren))
      }

      listItems.push({
        type: "listItem",
        children,
      })
    })

    return listItems
  }

  const listItems = generateWorkflowItems(workflowJsVar.steps)

  parent?.children.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  })
  return [SKIP, index]
}

export const parseComponentExample: ComponentParser<{
  examplesBasePath: string
}> = async (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options
): Promise<VisitorResult> => {
  if (!options?.examplesBasePath) {
    return
  }

  const exampleName = node.attributes?.find((attr) => attr.name === "name")
  if (!exampleName) {
    return
  }

  const name = exampleName.value as string
  const fileContent = await workerCompatibleFetch<string | null>({
    url: `${options.examplesBasePath}/${name}.tsx`,
    responseTransformer: async (res) => {
      return res.ok ? res.text() : null
    },
    fallbackAction: async () => {
      try {
        return readFileSync(
          path.join(options.examplesBasePath, `${name}.tsx`),
          "utf-8"
        )
      } catch {
        return null
      }
    },
  })

  if (!fileContent) {
    return
  }

  parent.children?.splice(index, 1, {
    type: "code",
    lang: "tsx",
    value: fileContent,
  })
  return [SKIP, index]
}

export const parseComponentReference: ComponentParser<{
  specsPath: string
}> = async (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options
): Promise<VisitorResult> => {
  if (!options?.specsPath) {
    return
  }

  const mainComponent = node.attributes?.find(
    (attr) => attr.name === "mainComponent"
  )?.value as string
  if (!mainComponent) {
    return
  }

  const componentNames: string[] = []

  const componentsToShowAttr = node.attributes?.find(
    (attr) => attr.name === "componentsToShow"
  )

  if (
    componentsToShowAttr &&
    typeof componentsToShowAttr.value !== "string" &&
    componentsToShowAttr.value.data?.estree
  ) {
    const componentsToShowJsVar = estreeToJs(
      componentsToShowAttr.value.data.estree
    )

    if (componentsToShowAttr && Array.isArray(componentsToShowJsVar)) {
      componentNames.push(
        ...componentsToShowJsVar
          .map((item) => {
            return isExpressionJsVarLiteral(item) ? (item.data as string) : ""
          })
          .filter((name) => name.length > 0)
      )
    }
  }

  if (!componentNames.length) {
    componentNames.push(mainComponent)
  }

  const getComponentNodes = async (
    componentName: string
  ): Promise<UnistNode[]> => {
    const componentSpecs = await workerCompatibleFetch<Documentation | null>({
      url: `${options.specsPath}/${mainComponent}/${componentName}.json`,
      responseTransformer: async (res) => {
        return res.ok ? ((await res.json()) as Documentation) : null
      },
      fallbackAction: async () => {
        try {
          const componentSpecsFile = path.join(
            options.specsPath,
            mainComponent,
            `${componentName}.json`
          )
          return JSON.parse(
            readFileSync(componentSpecsFile, "utf-8")
          ) as Documentation
        } catch {
          return null
        }
      },
    })

    if (!componentSpecs) {
      return []
    }

    const componentNodes: UnistNode[] = [
      {
        type: "heading",
        depth: 3,
        children: [
          {
            type: "text",
            value: `${componentName} Props`,
          },
        ],
      },
    ]

    if (componentSpecs.description) {
      componentNodes.push({
        type: "paragraph",
        children: [
          {
            type: "text",
            value: componentSpecs.description,
          },
        ],
      })
    }

    if (componentSpecs.props) {
      const listNode: UnistNode = {
        type: "list",
        ordered: false,
        spread: false,
        children: [],
      }

      Object.entries(componentSpecs.props).forEach(([propName, propData]) => {
        listNode.children?.push({
          type: "listItem",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value:
                    `${propName}: (${propData.type?.name || propData.tsType?.name}) ${propData.description || ""}${propData.defaultValue ? ` Default: ${propData.defaultValue.value}` : ""}`.trim(),
                },
              ],
            },
          ],
        })
      })

      componentNodes.push(listNode)
    }

    return componentNodes
  }

  const nodeArrays = await Promise.all(componentNames.map(getComponentNodes))
  parent.children?.splice(index, 1, ...nodeArrays.flat())
}

export const parsePackageInstall: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const packageName = node.attributes?.find(
    (attr) => attr.name === "packageName"
  )
  if (!packageName) {
    return
  }

  parent.children?.splice(index, 1, {
    type: "code",
    lang: "bash",
    value: `npm install ${packageName.value}`,
  })
  return [SKIP, index]
}

export const parseIconSearch: ComponentParser<{ iconNames: string[] }> = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options
): VisitorResult => {
  if (!options?.iconNames) {
    return
  }

  parent.children?.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: options.iconNames.map((iconName) => ({
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: iconName,
            },
          ],
        },
      ],
    })),
  })
  return [SKIP, index]
}

export const parseHookValues: ComponentParser<{
  hooksData: {
    [k: string]: {
      value: string
      type?: {
        type: string
      }
      description?: string
    }[]
  }
}> = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options
): VisitorResult => {
  if (!options?.hooksData) {
    return
  }

  const hookName = node.attributes?.find((attr) => attr.name === "hook")

  if (
    !hookName ||
    !hookName.value ||
    typeof hookName.value !== "string" ||
    !options.hooksData[hookName.value]
  ) {
    return
  }

  const hookData = options.hooksData[hookName.value]

  const listItems = hookData.map((item) => {
    return {
      type: "listItem",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value:
                `${item.value}: (${item.type?.type}) ${item.description || ""}`.trim(),
            },
          ],
        },
      ],
    }
  })

  parent.children?.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  })
  return [SKIP, index]
}

export const parseColors: ComponentParser<{
  colors: {
    [k: string]: Record<string, string>
  }
}> = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options
): VisitorResult => {
  if (!options?.colors) {
    return
  }

  parent.children?.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: Object.entries(options.colors).flatMap(([section, colors]) => [
      {
        type: "heading",
        depth: 3,
        children: [
          {
            type: "text",
            value: section,
          },
        ],
      },
      ...Object.entries(colors).map(([name, value]) => ({
        type: "listItem",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                value: name,
              },
              {
                type: "text",
                value: `: ${value}`,
              },
            ],
          },
        ],
      })),
    ]),
  })
}

export const parseSplitList: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const items = node.attributes?.find((attr) => attr.name === "items")

  if (!items || typeof items.value === "string" || !items.value.data?.estree) {
    return
  }

  const itemsJsVar = estreeToJs(items.value.data.estree)

  if (!itemsJsVar || !Array.isArray(itemsJsVar)) {
    return
  }

  const listItems = itemsJsVar
    .map((item) => {
      if (
        !isExpressionJsVarObj(item) ||
        !("title" in item) ||
        !("link" in item) ||
        !isExpressionJsVarLiteral(item.title) ||
        !isExpressionJsVarLiteral(item.link)
      ) {
        return null
      }
      const description = isExpressionJsVarLiteral(item.description)
        ? (item.description.data as string)
        : ""
      return {
        type: "listItem",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "link",
                url: `${item.link.data}`,
                children: [
                  {
                    type: "text",
                    value: `${item.title.data}${description ? `: ${description}` : ""}`,
                  },
                ],
              },
            ],
          },
        ],
      }
    })
    .filter(Boolean) as UnistNode[]
  if (!listItems.length) {
    return
  }
  parent?.children.splice(index, 1, {
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  })
  return [SKIP, index]
}

export const parseEventHeader: ComponentParser = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree
): VisitorResult => {
  const headerContent = node.attributes?.find(
    (attr) => attr.name === "headerProps"
  )
  const headerLvl = node.attributes?.find((attr) => attr.name === "headerLvl")

  if (
    !headerContent ||
    typeof headerContent.value === "string" ||
    !headerContent.value.data?.estree ||
    !headerLvl ||
    typeof headerLvl.value !== "string" ||
    !headerLvl.value
  ) {
    return
  }

  const headerPropsJsVar = estreeToJs(headerContent.value.data.estree)

  if (
    !isExpressionJsVarObj(headerPropsJsVar) ||
    !("children" in headerPropsJsVar) ||
    !isExpressionJsVarLiteral(headerPropsJsVar.children)
  ) {
    return
  }

  const headerLevel = parseInt(headerLvl.value, 10)
  const headerChildren = headerPropsJsVar.children.data as string

  const headerChildrenNode = {
    type: "text",
    value: headerChildren,
  }
  const headerNode = {
    type: "heading",
    depth: headerLevel,
    children: [headerChildrenNode],
  }

  parent?.children.splice(index, 1, headerNode)
  return [SKIP, index]
}

/**
 * `ChildDocs` renders cards/links for the child items of a sidebar or a
 * sidebar item, so it has no `items` prop to read from the node. Instead, the
 * sidebar to render and the current page's path are passed as parser options
 * (resolved by the consuming app), and this parser mirrors the rendering logic
 * of the `useChildDocs` hook in `docs-ui`, producing headings + link lists.
 */
export type ChildDocsParserOptions = {
  sidebar?: Sidebar.Sidebar
  activePath?: string
}

const isChildDocsLink = (
  item: Sidebar.SidebarItem | undefined
): item is Sidebar.SidebarItemLink =>
  item !== undefined &&
  (item.type === "link" || item.type === "ref" || item.type === "external")

const getChildDocsAttr = (node: UnistNodeWithData, name: string) =>
  node.attributes?.find((attr) => attr.name === name)

const readChildDocsExpression = (attr: { value: unknown } | undefined) => {
  const value = attr?.value
  if (!value || typeof value === "string") {
    return undefined
  }
  const estree = (value as { data?: { estree?: unknown } }).data?.estree
  if (!estree) {
    return undefined
  }
  return estreeToJs(estree as Parameters<typeof estreeToJs>[0])
}

const readChildDocsStringProp = (
  node: UnistNodeWithData,
  name: string
): string | undefined => {
  const attr = getChildDocsAttr(node, name)
  if (!attr) {
    return undefined
  }
  if (typeof attr.value === "string") {
    return attr.value
  }
  const js = readChildDocsExpression(attr)
  return isExpressionJsVarLiteral(js) ? String(js.data) : undefined
}

const readChildDocsBooleanProp = (
  node: UnistNodeWithData,
  name: string
): boolean | undefined => {
  const attr = getChildDocsAttr(node, name)
  if (!attr) {
    return undefined
  }
  // a bare attribute (e.g. `hideTitle`) has no value and means `true`
  if (attr.value === null || attr.value === undefined) {
    return true
  }
  if (typeof attr.value === "string") {
    return attr.value !== "false"
  }
  const js = readChildDocsExpression(attr)
  return isExpressionJsVarLiteral(js) ? Boolean(js.data) : true
}

const readChildDocsNumberProp = (
  node: UnistNodeWithData,
  name: string
): number | undefined => {
  const js = readChildDocsExpression(getChildDocsAttr(node, name))
  if (!isExpressionJsVarLiteral(js)) {
    return undefined
  }
  const num = Number(js.data)
  return isNaN(num) ? undefined : num
}

const readChildDocsStringArrayProp = (
  node: UnistNodeWithData,
  name: string
): string[] | undefined => {
  const js = readChildDocsExpression(getChildDocsAttr(node, name))
  if (!Array.isArray(js)) {
    return undefined
  }
  return js.filter(isExpressionJsVarLiteral).map((item) => String(item.data))
}

const filterNonInteractiveChildDocsItems = (
  items: Sidebar.SidebarItem[] | undefined
): Sidebar.InteractiveSidebarItem[] =>
  (items?.filter(
    (item) => item.type !== "separator" && !item.hideFromChildItems
  ) as Sidebar.InteractiveSidebarItem[]) || []

// Depth-first search for the first descendant link, mirroring
// `getFirstLinkChild` in `docs-ui` (only `link`-type items are matched).
const getChildDocsFirstLink = (
  items: Sidebar.SidebarItem[] | undefined
): Sidebar.SidebarItemLink | undefined => {
  let found: Sidebar.SidebarItemLink | undefined
  items?.some((item) => {
    if (item.type === "link") {
      found = item
    } else if ("children" in item && item.children) {
      found = getChildDocsFirstLink(item.children)
    }
    return found !== undefined
  })
  return found
}

// `link` items hold an app-relative path (the base URL/path is added later by
// the consuming pipeline); `ref`/external items already hold a full URL.
const resolveChildDocsHref = (
  item: Sidebar.InteractiveSidebarItem
): string | undefined =>
  isChildDocsLink(item)
    ? item.path
    : getChildDocsFirstLink(item.children)?.path

type ChildDocsRenderContext = {
  hideTitle: boolean
  hideDescription: boolean
  titleLevel: number
  startChildLevel: number
  endChildLevel: number
}

const getChildDocsChildrenForLevel = (
  item: Sidebar.InteractiveSidebarItem,
  currentLevel: number,
  ctx: ChildDocsRenderContext
): Sidebar.InteractiveSidebarItem[] | undefined => {
  if (
    (ctx.endChildLevel > 0 && currentLevel > ctx.endChildLevel) ||
    !item.children ||
    item.hideFromChildItems
  ) {
    return undefined
  }
  if (currentLevel >= ctx.startChildLevel) {
    return filterNonInteractiveChildDocsItems(item.children)
  }
  const result: Sidebar.InteractiveSidebarItem[] = []
  filterNonInteractiveChildDocsItems(item.children).forEach((child) => {
    const childChildren = getChildDocsChildrenForLevel(
      child,
      currentLevel + 1,
      ctx
    )
    if (childChildren) {
      result.push(...childChildren)
    }
  })
  return result
}

const buildChildDocsLinkList = (
  items: Sidebar.InteractiveSidebarItem[],
  ctx: ChildDocsRenderContext
): UnistNode | undefined => {
  const listItems = items
    .map((item) => {
      const href = resolveChildDocsHref(item)
      if (!href) {
        return undefined
      }
      const children: UnistNode[] = [
        {
          type: "link",
          url: href,
          children: [{ type: "text", value: item.title }],
        },
      ]
      if (item.description) {
        children.push({ type: "text", value: `: ${item.description}` })
      }
      return {
        type: "listItem",
        children: [{ type: "paragraph", children }],
      }
    })
    .filter(Boolean) as UnistNode[]

  if (!listItems.length) {
    return undefined
  }
  return { type: "list", ordered: false, spread: false, children: listItems }
}

const buildChildDocsAllLevels = (
  items: Sidebar.InteractiveSidebarItem[],
  headerLevel: number,
  currentLevel: number,
  ctx: ChildDocsRenderContext
): UnistNode[] => {
  const nodes: UnistNode[] = []
  items.forEach((item, key) => {
    const itemChildren = getChildDocsChildrenForLevel(item, currentLevel, ctx)
    const hasHeading = !!itemChildren?.length
    const linkChildren = (itemChildren || []).filter(
      (child) => isChildDocsLink(child) || child.type === "sidebar"
    )
    const categoryChildren = (itemChildren || []).filter(
      (child) => child.type === "category" || child.type === "sub-category"
    )
    const showLinkAsCard = !hasHeading && isChildDocsLink(item)

    if (hasHeading) {
      if (!ctx.hideTitle) {
        nodes.push({
          type: "heading",
          depth: Math.min(Math.max(headerLevel, 1), 6),
          children: [{ type: "text", value: item.title }],
        })
        if (!ctx.hideDescription && item.description) {
          nodes.push({
            type: "paragraph",
            children: [{ type: "text", value: item.description }],
          })
        }
      }
      if (linkChildren.length) {
        const list = buildChildDocsLinkList(linkChildren, ctx)
        if (list) {
          nodes.push(list)
        }
      }
      if (categoryChildren.length) {
        nodes.push(
          ...buildChildDocsAllLevels(
            categoryChildren,
            headerLevel + 1,
            currentLevel + 1,
            ctx
          )
        )
      }
      if (key !== items.length - 1 && headerLevel === 2) {
        nodes.push({ type: "thematicBreak" })
      }
    }

    if (showLinkAsCard) {
      const href = resolveChildDocsHref(item)
      if (href) {
        const children: UnistNode[] = [
          {
            type: "link",
            url: href,
            children: [{ type: "text", value: item.title }],
          },
        ]
        if (item.description) {
          children.push({ type: "text", value: `: ${item.description}` })
        }
        nodes.push({ type: "paragraph", children })
      }
    }
  })
  return nodes
}

const findChildDocsActiveItem = (
  items: Sidebar.SidebarItem[] | undefined,
  activePath: string
): Sidebar.InteractiveSidebarItem | undefined => {
  const normalized = activePath.replace(/\/$/, "")
  for (const item of items || []) {
    if (item.type === "separator") {
      continue
    }
    if (isChildDocsLink(item) && item.path.replace(/\/$/, "") === normalized) {
      return item
    }
    const found = findChildDocsActiveItem(item.children, activePath)
    if (found) {
      return found
    }
  }
  return undefined
}

export const parseChildDocs: ComponentParser<ChildDocsParserOptions> = (
  node: UnistNodeWithData,
  index: number,
  parent: UnistTree,
  options
): VisitorResult => {
  const sidebar = options?.sidebar
  if (!sidebar) {
    // no sidebar available: drop the component so no broken output remains
    parent?.children.splice(index, 1)
    return [SKIP, index]
  }

  const type = readChildDocsStringProp(node, "type") ?? "sidebar"
  const showItems = readChildDocsStringArrayProp(node, "showItems")
  const hideItems = readChildDocsStringArrayProp(node, "hideItems") ?? []
  const onlyTopLevel = readChildDocsBooleanProp(node, "onlyTopLevel") ?? false
  const ctx: ChildDocsRenderContext = {
    hideTitle: readChildDocsBooleanProp(node, "hideTitle") ?? false,
    hideDescription: readChildDocsBooleanProp(node, "hideDescription") ?? false,
    titleLevel: readChildDocsNumberProp(node, "titleLevel") ?? 2,
    startChildLevel: readChildDocsNumberProp(node, "startChildLevel") ?? 1,
    endChildLevel: readChildDocsNumberProp(node, "endChildLevel") ?? -1,
  }

  const baseItems =
    type === "item"
      ? findChildDocsActiveItem(sidebar.items, options?.activePath ?? "")
          ?.children || []
      : sidebar.items

  const filterType =
    showItems !== undefined ? "show" : hideItems.length > 0 ? "hide" : "all"

  const filterCondition = (item: Sidebar.SidebarItem): boolean => {
    if (item.type === "separator") {
      return false
    }
    switch (filterType) {
      case "hide":
        return (
          (!isChildDocsLink(item) || !hideItems.includes(item.path)) &&
          !hideItems.includes(item.title)
        )
      case "show":
        return (
          (isChildDocsLink(item) && showItems!.includes(item.path)) ||
          showItems!.includes(item.title)
        )
      default:
        return true
    }
  }

  const filterItems = (
    items: Sidebar.SidebarItem[]
  ): Sidebar.InteractiveSidebarItem[] =>
    (items.filter(filterCondition) as Sidebar.InteractiveSidebarItem[])
      .map((item) => Object.assign({}, item))
      .map((item) => {
        if (item.children && filterType === "hide") {
          item.children = filterItems(item.children)
        }
        return item
      })

  const filteredItems = filterNonInteractiveChildDocsItems(
    filterType !== "all" ? filterItems(baseItems) : baseItems
  )

  const replacement: UnistNode[] = onlyTopLevel
    ? (() => {
        const list = buildChildDocsLinkList(filteredItems, ctx)
        return list ? [list] : []
      })()
    : buildChildDocsAllLevels(filteredItems, ctx.titleLevel, 1, ctx)

  parent?.children.splice(index, 1, ...replacement)
  return [SKIP, index]
}

/**
 * Helpers
 */
const getTextNode = (node: UnistNode): UnistNode | undefined => {
  let textNode: UnistNode | undefined
  node.children?.some((child) => {
    if (textNode) {
      return true
    }
    if (child.type === "text") {
      textNode = child
    } else if (child.type === "paragraph") {
      textNode = getTextNode(child)
    } else if (child.type === "link") {
      textNode = getTextNode(child)
    } else if (child.value) {
      textNode = child
    }

    return textNode !== undefined
  })

  return textNode
}

const formatNodeText = (node?: UnistNode): string => {
  if (!node) {
    return ""
  }
  if (node.type === "inlineCode") {
    return `\`${node.value}\``
  } else if (node.type === "code") {
    return `\`\`\`${"lang" in node ? node.lang : "ts"}\n${node.value}\n\`\`\``
  } else if (node.type === "link") {
    return `[${node.children?.[0].value}](${node.url})`
  }

  return node.value || ""
}
