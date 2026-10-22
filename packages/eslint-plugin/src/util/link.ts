import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { isResolveCallee } from "./container"
import { trackFrameworkUtilsImports } from "./service-scope"

export const DEFINE_LINK = "defineLink"

/**
 * Receiver names that identify Medusa's Link service, normalized by
 * {@link normalizeReceiverName} so casing and separators don't matter
 * (`remoteLink`, `remote_link`, and `link_` all collapse into this set).
 */
export const LINK_RECEIVER_NAMES: ReadonlySet<string> = new Set([
  "link",
  "links",
  "remotelink",
  "remotelinks",
  "linkmodule",
  "linkmodules",
])

/** Type names that identify a binding as Medusa's Link service. */
export const LINK_TYPE_NAMES: ReadonlySet<string> = new Set([
  "Link",
  "ILink",
  "ILinkModule",
  "ILinkModuleService",
  "RemoteLink",
  "IRemoteLink",
])

/**
 * `ContainerRegistrationKeys` / `Modules` members that resolve the Link
 * service. `REMOTE_LINK` is the deprecated pre-v2.2.0 key.
 */
export const LINK_RESOLVE_KEYS: ReadonlySet<string> = new Set([
  "LINK",
  "LINK_MODULES",
  "REMOTE_LINK",
])

/** String registration keys that resolve the Link service. */
export const LINK_RESOLVE_STRINGS: ReadonlySet<string> = new Set([
  "link",
  "link_modules",
  "remoteLink",
])

/** Lowercases and strips separators so `remote_link` and `remoteLink` match. */
export function normalizeReceiverName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "")
}

/** True when a type annotation names one of {@link LINK_TYPE_NAMES}. */
export function isLinkTypeAnnotation(
  annotation: TSESTree.TSTypeAnnotation | undefined
): boolean {
  const typeNode = annotation?.typeAnnotation
  return (
    typeNode?.type === AST_NODE_TYPES.TSTypeReference &&
    typeNode.typeName.type === AST_NODE_TYPES.Identifier &&
    LINK_TYPE_NAMES.has(typeNode.typeName.name)
  )
}

/**
 * True when `node` is a container resolution that yields the Link service —
 * `container.resolve(ContainerRegistrationKeys.LINK)`, `resolve(Modules.LINK)`,
 * `resolve<Link>(...)`, or `resolve("link_modules")`. Unwraps `await`.
 */
export function isLinkResolveCall(
  node: TSESTree.Node | null | undefined
): boolean {
  let expression = node
  while (expression?.type === AST_NODE_TYPES.AwaitExpression) {
    expression = expression.argument
  }
  if (
    expression?.type !== AST_NODE_TYPES.CallExpression ||
    !isResolveCallee(expression.callee)
  ) {
    return false
  }

  const typeArgument = expression.typeArguments?.params[0]
  if (
    typeArgument?.type === AST_NODE_TYPES.TSTypeReference &&
    typeArgument.typeName.type === AST_NODE_TYPES.Identifier &&
    LINK_TYPE_NAMES.has(typeArgument.typeName.name)
  ) {
    return true
  }

  const key = expression.arguments[0]
  if (!key) {
    return false
  }
  if (key.type === AST_NODE_TYPES.Literal && typeof key.value === "string") {
    return LINK_RESOLVE_STRINGS.has(key.value)
  }
  return (
    key.type === AST_NODE_TYPES.MemberExpression &&
    !key.computed &&
    key.property.type === AST_NODE_TYPES.Identifier &&
    LINK_RESOLVE_KEYS.has(key.property.name)
  )
}

/**
 * Records the local name of a `VariableDeclarator` or `PropertyDefinition`
 * that holds the Link service, recognized either by its type annotation or by
 * a container resolution initializer.
 *
 * Call from the matching visitors; pair with {@link isLinkReceiver}.
 */
export function trackLinkBinding(
  node: TSESTree.VariableDeclarator | TSESTree.PropertyDefinition,
  localNames: Set<string>
): void {
  if (node.type === AST_NODE_TYPES.VariableDeclarator) {
    if (node.id.type !== AST_NODE_TYPES.Identifier) {
      return
    }
    if (
      isLinkTypeAnnotation(node.id.typeAnnotation) ||
      isLinkResolveCall(node.init)
    ) {
      localNames.add(node.id.name)
    }
    return
  }

  if (node.computed || node.key.type !== AST_NODE_TYPES.Identifier) {
    return
  }
  if (
    isLinkTypeAnnotation(node.typeAnnotation) ||
    isLinkResolveCall(node.value)
  ) {
    localNames.add(node.key.name)
  }
}

/** The name a call's receiver is known by, e.g. `link`, `this.link_`. */
export function getReceiverName(object: TSESTree.Node): string | null {
  if (object.type === AST_NODE_TYPES.Identifier) {
    return object.name
  }
  if (
    object.type === AST_NODE_TYPES.MemberExpression &&
    !object.computed &&
    object.property.type === AST_NODE_TYPES.Identifier
  ) {
    return object.property.name
  }
  return null
}

/**
 * True when `object` is recognizable as Medusa's Link service — either a name
 * tracked by {@link trackLinkBinding} or one of {@link LINK_RECEIVER_NAMES}.
 *
 * Without this gate a rule matching link method names would also match
 * identically-named methods on unrelated third-party SDKs.
 */
export function isLinkReceiver(
  object: TSESTree.Node,
  localNames: ReadonlySet<string>
): boolean {
  const receiver = getReceiverName(object)
  if (!receiver) {
    return false
  }
  return (
    localNames.has(receiver) ||
    LINK_RECEIVER_NAMES.has(normalizeReceiverName(receiver))
  )
}

/**
 * Records local names bound to `defineLink` from `@medusajs/framework/utils`
 * (honors `import { defineLink as dl }`).
 *
 * Call from an `ImportDeclaration` visitor.
 */
export function trackDefineLinkImports(
  node: TSESTree.ImportDeclaration,
  localNames: Set<string>
): void {
  trackFrameworkUtilsImports(node, { [DEFINE_LINK]: localNames })
}

/** True when `node` calls a tracked `defineLink` binding. */
export function isDefineLinkCall(
  node: TSESTree.CallExpression,
  localNames: ReadonlySet<string>
): boolean {
  return (
    localNames.size > 0 &&
    node.callee.type === AST_NODE_TYPES.Identifier &&
    localNames.has(node.callee.name)
  )
}

/**
 * Matches `<X>.linkable.<y>` at any depth on `<X>`, e.g.
 * `ProductModule.linkable.product` or `foo.bar.linkable.product`.
 */
export function isLinkableMemberChain(node: TSESTree.Node): boolean {
  if (node.type !== AST_NODE_TYPES.MemberExpression || node.computed) {
    return false
  }
  const object = node.object
  if (object.type !== AST_NODE_TYPES.MemberExpression || object.computed) {
    return false
  }
  return (
    object.property.type === AST_NODE_TYPES.Identifier &&
    object.property.name === "linkable"
  )
}

/**
 * Walks a member chain (e.g. `BlogModule.linkable.post.id`) and returns true
 * when any segment is a non-computed `.linkable` access.
 */
export function hasLinkableInChain(node: TSESTree.Node): boolean {
  let current: TSESTree.Node | undefined = node
  while (current && current.type === AST_NODE_TYPES.MemberExpression) {
    if (
      !current.computed &&
      current.property.type === AST_NODE_TYPES.Identifier &&
      current.property.name === "linkable"
    ) {
      return true
    }
    current = current.object
  }
  return false
}
