import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"
import { findProperty } from "../../util/ast"

type MessageIds = "missingField" | "missingPrimaryKey"

const DEFINE_LINK = "defineLink"

function isReadOnlyTrue(options: TSESTree.Node): boolean {
  if (options.type !== "ObjectExpression") {
    return false
  }
  const readOnly = findProperty(options, "readOnly")
  if (!readOnly) {
    return false
  }
  return readOnly.value.type === "Literal" && readOnly.value.value === true
}

function isLinkableIdSpread(node: TSESTree.Node): boolean {
  // Match `...<X>.linkable.<y>.id` — i.e. a MemberExpression ending in `.id`
  // whose object chain contains a non-computed `.linkable` segment.
  if (node.type !== "MemberExpression" || node.computed) {
    return false
  }
  if (node.property.type !== "Identifier" || node.property.name !== "id") {
    return false
  }
  let current: TSESTree.Node = node.object
  while (current.type === "MemberExpression") {
    if (
      !current.computed &&
      current.property.type === "Identifier" &&
      current.property.name === "linkable"
    ) {
      return true
    }
    current = current.object
  }
  return false
}

function hasInverseLinkableSpread(obj: TSESTree.ObjectExpression): boolean {
  for (const prop of obj.properties) {
    if (prop.type === "SpreadElement" && isLinkableIdSpread(prop.argument)) {
      return true
    }
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "read-only-link-requires-field",
  meta: {
    type: "problem",
    docs: {
      description:
        "Read-only `defineLink(...)` calls must specify a `field` on the first linkable (and a `primaryKey` on the inverse form).",
    },
    messages: {
      missingField:
        "Read-only `defineLink(...)` requires the first argument to be an object with a `field` property specifying where the linked record's ID is stored.",
      missingPrimaryKey:
        "Inverse read-only `defineLink(...)` requires the second argument to include a `primaryKey` property override.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const defineLinkLocalNames = new Set<string>()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
          return
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            specifier.imported.type === "Identifier" &&
            specifier.imported.name === DEFINE_LINK
          ) {
            defineLinkLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        if (defineLinkLocalNames.size === 0) {
          return
        }
        if (
          node.callee.type !== "Identifier" ||
          !defineLinkLocalNames.has(node.callee.name)
        ) {
          return
        }

        const [arg1, arg2, options] = node.arguments
        if (!options || !arg1 || !arg2) {
          return
        }
        if (!isReadOnlyTrue(options)) {
          return
        }

        // First arg must be an ObjectExpression with `field`.
        if (arg1.type !== "ObjectExpression" || !findProperty(arg1, "field")) {
          context.report({ node: arg1, messageId: "missingField" })
        }

        // Inverse form: second arg is an ObjectExpression spreading
        // `<X>.linkable.<y>.id`. It must include a `primaryKey` override, or
        // an `alias` (e.g. linking to draft orders via the `order` linkable,
        // where the foreign key lives on the first linkable's `field` and the
        // spread `.id` is simply re-aliased).
        if (
          arg2.type === "ObjectExpression" &&
          hasInverseLinkableSpread(arg2) &&
          !findProperty(arg2, "primaryKey") &&
          !findProperty(arg2, "alias")
        ) {
          context.report({ node: arg2, messageId: "missingPrimaryKey" })
        }
      },
    }
  },
})

export default rule
