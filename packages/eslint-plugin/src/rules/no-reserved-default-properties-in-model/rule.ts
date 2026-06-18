import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { getPropertyKeyName } from "../../util/ast"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "reservedDefaultProperty"

const MODEL_IMPORT = "model"
const DEFINE_METHOD = "define"

const RESERVED_PROPERTIES = new Set(["created_at", "updated_at", "deleted_at"])

export const rule = createRule<[], MessageIds>({
  name: "no-reserved-default-properties-in-model",
  meta: {
    type: "problem",
    docs: {
      description:
        "Don't redefine reserved default properties (`created_at`, `updated_at`, `deleted_at`) in `model.define`; they are auto-added.",
    },
    messages: {
      reservedDefaultProperty:
        "`{{name}}` is a reserved default property automatically added by Medusa. Remove it from the data model schema.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const modelLocalNames = new Set<string>()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
          return
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            specifier.imported.name === MODEL_IMPORT
          ) {
            modelLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        if (modelLocalNames.size === 0) {
          return
        }
        const callee = node.callee
        if (
          callee.type !== AST_NODE_TYPES.MemberExpression ||
          callee.computed ||
          callee.property.type !== AST_NODE_TYPES.Identifier ||
          callee.property.name !== DEFINE_METHOD ||
          callee.object.type !== AST_NODE_TYPES.Identifier ||
          !modelLocalNames.has(callee.object.name)
        ) {
          return
        }
        const schemaArg = node.arguments[1]
        if (!schemaArg || schemaArg.type !== AST_NODE_TYPES.ObjectExpression) {
          return
        }

        const properties = schemaArg.properties
        for (let i = 0; i < properties.length; i++) {
          const prop = properties[i]
          const keyName = getPropertyKeyName(prop)
          if (!keyName || !RESERVED_PROPERTIES.has(keyName)) {
            continue
          }

          context.report({
            node: prop,
            messageId: "reservedDefaultProperty",
            data: { name: keyName },
            fix: (fixer) => {
              const sourceCode = context.sourceCode
              const text = sourceCode.text
              const tokenAfter = sourceCode.getTokenAfter(prop)
              let endRange =
                tokenAfter && tokenAfter.value === ","
                  ? tokenAfter.range[1]
                  : prop.range[1]
              // Consume trailing whitespace + newline so the line is fully removed.
              while (endRange < text.length) {
                const ch = text[endRange]
                if (ch === " " || ch === "\t") {
                  endRange++
                } else if (ch === "\n") {
                  endRange++
                  break
                } else if (ch === "\r") {
                  endRange++
                  if (text[endRange] === "\n") {
                    endRange++
                  }
                  break
                } else {
                  break
                }
              }
              // Also consume leading whitespace on the prop's line.
              let startRange = prop.range[0]
              while (startRange > 0) {
                const ch = text[startRange - 1]
                if (ch === " " || ch === "\t") {
                  startRange--
                } else {
                  break
                }
              }
              return fixer.removeRange([startRange, endRange])
            },
          })
        }
      },
    }
  },
})

export default rule
