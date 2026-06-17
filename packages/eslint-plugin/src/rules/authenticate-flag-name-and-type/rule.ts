import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUnderApiDir } from "../../util/api-route"

type MessageIds = "wrongCase" | "nonBooleanValue"

const EXPECTED_NAME = "AUTHENTICATE"
const WRONG_CASE_NAMES = new Set(["authenticate", "Authenticate"])
const ROUTE_FILE_BASENAMES = new Set(["route.ts", "route.js"])

function isBooleanLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && typeof node.value === "boolean"
}

export const rule = createRule<[], MessageIds>({
  name: "authenticate-flag-name-and-type",
  meta: {
    type: "problem",
    docs: {
      description:
        "API route opt-out flag must be exported as `AUTHENTICATE` with a boolean literal value. Other casings or non-boolean values are ignored by the framework.",
    },
    fixable: "code",
    messages: {
      wrongCase:
        "Route auth flag must be exported as `AUTHENTICATE`. Rename `{{name}}` — other casings are ignored by the framework.",
      nonBooleanValue:
        "`AUTHENTICATE` must be a boolean literal (`true` or `false`). Other types are ignored by the framework.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) {
      return {}
    }
    if (!isUnderApiDir(filename)) {
      return {}
    }
    if (!ROUTE_FILE_BASENAMES.has(path.basename(filename))) {
      return {}
    }

    function checkVariableDeclarator(d: TSESTree.VariableDeclarator) {
      if (d.id.type !== AST_NODE_TYPES.Identifier) {
        return
      }
      const name = d.id.name

      if (WRONG_CASE_NAMES.has(name)) {
        const idNode = d.id
        context.report({
          node: idNode,
          messageId: "wrongCase",
          data: { name },
          fix(fixer) {
            return fixer.replaceText(idNode, EXPECTED_NAME)
          },
        })
        return
      }

      if (name !== EXPECTED_NAME) {
        return
      }
      if (!d.init) {
        return
      }
      if (!isBooleanLiteral(d.init)) {
        context.report({
          node: d.init,
          messageId: "nonBooleanValue",
        })
      }
    }

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          const decl = node.declaration
          if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
            for (const d of decl.declarations) {
              checkVariableDeclarator(d)
            }
          }
        }

        for (const spec of node.specifiers) {
          if (spec.type !== AST_NODE_TYPES.ExportSpecifier) {
            continue
          }
          const exported = spec.exported
          let exportedName: string | null = null
          if (exported.type === AST_NODE_TYPES.Identifier) {
            exportedName = exported.name
          } else if (
            exported.type === AST_NODE_TYPES.Literal &&
            typeof exported.value === "string"
          ) {
            exportedName = exported.value
          }
          if (!exportedName) {
            continue
          }
          if (!WRONG_CASE_NAMES.has(exportedName)) {
            continue
          }

          const target = exported
          context.report({
            node: target,
            messageId: "wrongCase",
            data: { name: exportedName },
            fix(fixer) {
              if (target.type === AST_NODE_TYPES.Identifier) {
                return fixer.replaceText(target, EXPECTED_NAME)
              }
              return fixer.replaceText(target, JSON.stringify(EXPECTED_NAME))
            },
          })
        }
      },
    }
  },
})

export default rule
