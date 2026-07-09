import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "notLinkableProperty"

const DEFINE_LINK = "defineLink"

function isLinkableMemberChain(node: TSESTree.Node): boolean {
  // Match `<X>.linkable.<y>` (any depth on `<X>`, e.g. `ProductModule.linkable.product`
  // or `foo.bar.linkable.product`). The outer node is a MemberExpression whose
  // `object` is itself a non-computed MemberExpression with `property.name === "linkable"`.
  if (node.type !== "MemberExpression" || node.computed) {
    return false
  }
  const object = node.object
  if (object.type !== "MemberExpression" || object.computed) {
    return false
  }
  if (
    object.property.type !== "Identifier" ||
    object.property.name !== "linkable"
  ) {
    return false
  }
  return true
}

function isLinkableMemberChainOrId(node: TSESTree.Node): boolean {
  // Match `<X>.linkable.<y>` or `<X>.linkable.<y>.id`. The `.id` form is used
  // when linking to a data model by its id (e.g. linking to draft orders via
  // `OrderModule.linkable.order.id`).
  if (isLinkableMemberChain(node)) {
    return true
  }
  if (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.property.type === "Identifier" &&
    node.property.name === "id" &&
    isLinkableMemberChain(node.object)
  ) {
    return true
  }
  return false
}

function hasOwnPropertyNamed(
  node: TSESTree.ObjectExpression,
  name: string
): boolean {
  for (const prop of node.properties) {
    if (prop.type !== "Property" || prop.computed) {
      continue
    }
    const keyName =
      prop.key.type === "Identifier"
        ? prop.key.name
        : prop.key.type === "Literal" && typeof prop.key.value === "string"
        ? prop.key.value
        : null
    if (keyName === name) {
      return true
    }
  }
  return false
}

function hasLinkableInChain(node: TSESTree.Node): boolean {
  // Walks any MemberExpression chain (e.g. `BlogModule.linkable.post.id`) and
  // returns true if any segment is a non-computed `.linkable` access. Used to
  // recognize spread arguments of the inverse read-only link form
  // (`...BlogModule.linkable.post.id`).
  let current: TSESTree.Node | undefined = node
  while (current && current.type === "MemberExpression") {
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

function isValidLinkParticipant(node: TSESTree.Node): boolean {
  if (isLinkableMemberChain(node)) {
    return true
  }
  if (node.type === "ObjectExpression") {
    for (const prop of node.properties) {
      if (prop.type === "SpreadElement") {
        // Inverse read-only links spread `<X>.linkable.<y>.id` (or similar).
        if (hasLinkableInChain(prop.argument)) {
          return true
        }
        continue
      }
      if (prop.type !== "Property" || prop.computed) {
        continue
      }
      const keyName =
        prop.key.type === "Identifier"
          ? prop.key.name
          : prop.key.type === "Literal" && typeof prop.key.value === "string"
          ? prop.key.value
          : null
      if (keyName !== "linkable") {
        continue
      }
      if (isLinkableMemberChainOrId(prop.value)) {
        return true
      }
      // Read-only link form: `linkable` is an inline object describing the
      // foreign data model via `serviceName` + `alias` + (optional) `primaryKey`.
      if (
        prop.value.type === "ObjectExpression" &&
        hasOwnPropertyNamed(prop.value, "serviceName")
      ) {
        return true
      }
    }
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "link-uses-linkable-properties",
  meta: {
    type: "problem",
    docs: {
      description:
        "Arguments to `defineLink` must be of the form `Module.linkable.<dataModel>` or an object with `linkable: Module.linkable.<dataModel>`.",
    },
    messages: {
      notLinkableProperty:
        "Arguments to `defineLink` must reference a module's `linkable` property (e.g. `Module.linkable.dataModel` or `{ linkable: Module.linkable.dataModel }`).",
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
        // `defineLink(arg1, arg2, options?)` — only the first two args are
        // link participants. Anything beyond index 1 is configuration.
        const participants = node.arguments.slice(0, 2)
        for (const arg of participants) {
          if (arg.type === "SpreadElement") {
            continue
          }
          if (!isValidLinkParticipant(arg)) {
            context.report({
              node: arg,
              messageId: "notLinkableProperty",
            })
          }
        }
      },
    }
  },
})

export default rule
