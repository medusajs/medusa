import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  findProperty,
  getCallArgumentObject,
  getStringLiteralValue,
} from "../../util/ast"

type MessageIds = "wildcardWithSpecificFields"

/** Property on the query config object that holds the selected fields. */
const FIELDS_PROPERTY = "fields"

/** The top-level wildcard that selects all of an entity's own fields. */
const WILDCARD = "*"

/** The member method that runs a graph query: `query.graph({ ... })`. */
const GRAPH_METHOD = "graph"

/** The workflow step helper that runs a graph query. */
const USE_QUERY_GRAPH_STEP = "useQueryGraphStep"

/**
 * True when `call` is a graph query we care about: either `<x>.graph(...)` or
 * `useQueryGraphStep(...)`.
 */
function isGraphQueryCall(call: TSESTree.CallExpression): boolean {
  const callee = call.callee
  if (
    callee.type === AST_NODE_TYPES.Identifier &&
    callee.name === USE_QUERY_GRAPH_STEP
  ) {
    return true
  }
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === GRAPH_METHOD
  ) {
    return true
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "no-wildcard-with-specific-fields",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow combining the `*` wildcard with specific top-level fields in a `query.graph` or `useQueryGraphStep` selection, since `*` drops those field selections.",
    },
    messages: {
      wildcardWithSpecificFields:
        "The `*` wildcard drops the sibling field selection(s) {{fields}}. `*` selects all of the entity's own fields, so top-level fields not included by `*` (like computed fields such as `total`) are lost. Remove `*` if you need those specific fields.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (!isGraphQueryCall(node)) {
          return
        }

        const config = getCallArgumentObject(node)
        if (!config) {
          return
        }

        const fieldsProp = findProperty(config, FIELDS_PROPERTY)
        if (
          !fieldsProp ||
          fieldsProp.value.type !== AST_NODE_TYPES.ArrayExpression
        ) {
          return
        }

        const elements = fieldsProp.value.elements

        let wildcardNode: TSESTree.Node | null = null
        const specificFields: string[] = []

        for (const element of elements) {
          const value = getStringLiteralValue(element)
          if (value === null) {
            continue
          }
          if (value === WILDCARD) {
            // Anchor the report on the first `*` encountered.
            wildcardNode ??= element as TSESTree.Node
            continue
          }
          // Relation selections (e.g. `items.*`, `items.title`) are scoped to a
          // relation and are kept even when `*` is present, so they don't
          // conflict. Only plain top-level fields are dropped by `*`.
          if (!value.includes(".")) {
            specificFields.push(value)
          }
        }

        if (!wildcardNode || specificFields.length === 0) {
          return
        }

        context.report({
          node: wildcardNode,
          messageId: "wildcardWithSpecificFields",
          data: {
            fields: specificFields.map((f) => `\`"${f}"\``).join(", "),
          },
        })
      },
    }
  },
})

export default rule
