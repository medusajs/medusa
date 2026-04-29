import {
  CloudAnnouncement,
  FrontMatter,
  ObjectExpression,
  ToCItem,
  UnistFunctionDeclarationNode,
  UnistNode,
  UnistProgram,
  UnistReturnStatementNode,
} from "types"
import type { Transformer } from "unified"
import { getToc, getTocJSX } from "./utils/toc.js"

type DataToc = Record<string, unknown>[]

type Options = {
  isRemoteMdx?: boolean
  announcements?: CloudAnnouncement[]
  mode?: "development" | "production"
}

export function recmaInjectMdxDataPlugin(options?: Options): Transformer {
  const isRemoteMdx = options?.isRemoteMdx || false
  const mode = options?.mode || "development"
  return async (tree, file) => {
    const frontmatter: FrontMatter = file.data.matter || {}
    const tocMaxDepth = frontmatter.toc_max_depth || 4
    let dataToc = (file.data.toc || []) as DataToc
    if (dataToc.length > 0 && dataToc[0].depth === 1) {
      dataToc = (dataToc[0].children || []) as DataToc
    }
    const toc: ToCItem[] = frontmatter.generate_toc
      ? []
      : getToc(dataToc, tocMaxDepth)

    const program = tree as UnistProgram
    for (const node of program.body) {
      if (node.type === "FunctionDeclaration") {
        const fnNode = node as UnistFunctionDeclarationNode
        const returnStatement = fnNode.body.body.find(
          (n) => n.type === "ReturnStatement"
        )

        if (!returnStatement) {
          continue
        }

        const returnChildren = getReturnChildren(
          returnStatement as UnistReturnStatementNode
        )

        if (isRemoteMdx) {
          handleRemoteMdx({
            returnChildren,
            frontmatter,
            toc,
            mode,
          })
        } else {
          handleDefaultMdx({
            program,
            returnChildren,
            frontmatter,
            toc,
          })
        }

        return
      }
    }
  }
}

function handleDefaultMdx({
  program,
  returnChildren,
  frontmatter,
  toc,
}: {
  program: UnistProgram
  returnChildren: UnistNode[]
  frontmatter: FrontMatter
  toc: ToCItem[]
}) {
  program.body.unshift({
    type: "ImportDeclaration",
    source: { type: "Literal", value: "docs-ui" },
    specifiers: [
      {
        type: "ImportSpecifier",
        imported: { type: "Identifier", name: "InjectedMDXData" },
        local: { type: "Identifier", name: "InjectedMDXData" },
      },
    ],
  })

  returnChildren.push({
    type: "JSXElement",
    openingElement: {
      type: "JSXOpeningElement",
      name: {
        type: "JSXIdentifier",
        name: "InjectedMDXData",
      },
      attributes: [
        {
          type: "JSXAttribute",
          name: {
            type: "JSXIdentifier",
            name: "frontmatter",
          },
          value: {
            type: "JSXExpressionContainer",
            expression: {
              type: "ObjectExpression",
              properties: Object.entries(frontmatter).map(([key, value]) => ({
                type: "Property",
                key: {
                  type: "Identifier",
                  name: key,
                },
                value: {
                  type: "Literal",
                  value: value,
                  raw: JSON.stringify(value),
                },
                kind: "init",
                computed: false,
                method: false,
                shorthand: false,
              })),
            },
          },
        },
        {
          type: "JSXAttribute",
          name: {
            type: "JSXIdentifier",
            name: "toc",
          },
          value: {
            type: "JSXExpressionContainer",
            expression: {
              type: "ArrayExpression",
              elements: getTocJSX(toc),
            },
          },
        },
      ],
      selfClosing: true,
    },
  } as any)
}

function handleRemoteMdx({
  returnChildren,
  frontmatter,
  toc,
  mode,
}: {
  returnChildren: UnistNode[]
  frontmatter: FrontMatter
  toc: ToCItem[]
  mode: "development" | "production"
}) {
  const functionName = mode === "development" ? "_jsxDEV" : "_jsx"

  returnChildren.push({
    type: "Literal",
    value: "\n",
  })

  returnChildren.push({
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: functionName,
    },
    arguments: [
      {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "_components",
        },
        property: {
          type: "Identifier",
          name: "InjectedMDXData",
        },
        computed: false,
        optional: false,
        shorthand: false,
      },
      {
        type: "ObjectExpression",
        properties: [
          {
            type: "Property",
            key: { type: "Identifier", name: "frontmatter" },
            value: {
              type: "ObjectExpression",
              properties: Object.entries(frontmatter).map(([key, value]) => ({
                type: "Property",
                key: {
                  type: "Identifier",
                  name: key,
                },
                value: {
                  type: "Literal",
                  value: value,
                  raw: JSON.stringify(value),
                },
                kind: "init",
                computed: false,
                optional: false,
                shorthand: false,
              })),
            },
            kind: "init",
            computed: false,
            optional: false,
            shorthand: false,
          },
          {
            type: "Property",
            key: { type: "Identifier", name: "toc" },
            value: {
              type: "ArrayExpression",
              elements: getTocJSX(toc),
            },
            kind: "init",
            computed: false,
            optional: false,
            shorthand: false,
          },
        ],
      },
    ],
  } as any)
}

function getReturnChildren(node: UnistReturnStatementNode): UnistNode[] {
  const rootJSX = node.argument

  if (rootJSX.type === "JSXFragment") {
    return rootJSX.children
  } else if (rootJSX.type === "JSXElement") {
    return []
  }

  const props = rootJSX.arguments.find(
    (arg) => arg.type === "ObjectExpression"
  ) as ObjectExpression | undefined

  if (!props) {
    return []
  }

  const childrenProp = props.properties.find(
    (prop) => prop.key.name === "children"
  )

  if (!childrenProp || childrenProp.value.type !== "ArrayExpression") {
    return []
  }

  return childrenProp.value.elements as UnistNode[]
}
