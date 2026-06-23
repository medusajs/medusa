import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "missingPrimaryKey"

const MODEL_IMPORT = "model"
const DEFINE_METHOD = "define"
const PRIMARY_KEY_METHOD = "primaryKey"

/**
 * Walks a property-value method chain (e.g. `model.id().primaryKey().nullable()`)
 * looking for a `.primaryKey()` call anywhere in the chain. Descends through
 * call callees and member-expression objects only — returns `false` the moment
 * the chain bottoms out at anything else (identifier, literal, etc.).
 */
const chainHasPrimaryKey = (node: TSESTree.Node): boolean => {
  let current: TSESTree.Node = node
  while (current) {
    if (current.type === AST_NODE_TYPES.CallExpression) {
      const callee = current.callee
      if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        !callee.computed &&
        callee.property.type === AST_NODE_TYPES.Identifier &&
        callee.property.name === PRIMARY_KEY_METHOD
      ) {
        return true
      }
      current = callee
    } else if (current.type === AST_NODE_TYPES.MemberExpression) {
      current = current.object
    } else {
      return false
    }
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "primary-key-required",
  meta: {
    type: "problem",
    docs: {
      description:
        "A data model defined with `model.define` must declare a primary key via `.primaryKey()`.",
    },
    messages: {
      missingPrimaryKey:
        "Data model {{name}} has no primary key. Add `.primaryKey()` to one of its `id`, `text`, or `number` properties.",
    },
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

        // A spread could supply the primary-key property — can't tell, so bail
        // to avoid a false positive.
        const hasSpread = schemaArg.properties.some(
          (p) => p.type === AST_NODE_TYPES.SpreadElement
        )
        if (hasSpread) {
          return
        }

        const hasPrimaryKey = schemaArg.properties.some(
          (prop) =>
            prop.type === AST_NODE_TYPES.Property &&
            chainHasPrimaryKey(prop.value)
        )
        if (hasPrimaryKey) {
          return
        }

        const firstArg = node.arguments[0]
        const name =
          firstArg &&
          firstArg.type === AST_NODE_TYPES.Literal &&
          typeof firstArg.value === "string"
            ? JSON.stringify(firstArg.value)
            : "defined with `model.define`"

        context.report({
          node: callee.property,
          messageId: "missingPrimaryKey",
          data: { name },
        })
      },
    }
  },
})

export default rule
