import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { isFunctionNode, walkAst } from "./ast"

export const DEFINE_MIDDLEWARES = "defineMiddlewares"
export const ALLOW_FIELDS = "allowFields"

/** A route object passed in the `routes` array of `defineMiddlewares(...)`. */
export interface MiddlewareRoute {
  object: TSESTree.ObjectExpression
  middlewares: TSESTree.Node[]
  /** The `method` or `methods` property, when the route scopes itself to one. */
  methodProperty: TSESTree.Property | null
}

const METHOD_KEYS = new Set(["method", "methods"])

const getStaticKeyName = (key: TSESTree.Node): string | null => {
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name
  }
  if (key.type === AST_NODE_TYPES.Literal && typeof key.value === "string") {
    return key.value
  }
  return null
}

/**
 * Returns the object literal argument of a `defineMiddlewares(...)` call, or
 * `null` when the node isn't such a call or its argument isn't a literal.
 */
export const getDefineMiddlewaresArg = (
  node: TSESTree.CallExpression
): TSESTree.ObjectExpression | null => {
  if (
    node.callee.type !== AST_NODE_TYPES.Identifier ||
    node.callee.name !== DEFINE_MIDDLEWARES
  ) {
    return null
  }
  const arg = node.arguments[0]
  return arg?.type === AST_NODE_TYPES.ObjectExpression ? arg : null
}

/**
 * Collects every object literal under `root` that carries a `middlewares`
 * array. Route objects are matched by shape rather than by position under
 * `routes`, so routes built in a separate array or nested helper are still
 * found.
 */
export const collectMiddlewareRoutes = (
  root: TSESTree.Node
): MiddlewareRoute[] => {
  const routes: MiddlewareRoute[] = []

  walkAst(root, (node) => {
    if (node.type !== AST_NODE_TYPES.ObjectExpression) {
      return
    }

    let middlewares: TSESTree.Node[] | null = null
    let methodProperty: TSESTree.Property | null = null

    for (const prop of node.properties) {
      if (prop.type !== AST_NODE_TYPES.Property || prop.computed) {
        continue
      }
      const name = getStaticKeyName(prop.key)
      if (name === "middlewares") {
        if (prop.value.type === AST_NODE_TYPES.ArrayExpression) {
          middlewares = prop.value.elements.filter(
            (el): el is TSESTree.Expression | TSESTree.SpreadElement =>
              el !== null
          )
        }
      } else if (name && METHOD_KEYS.has(name)) {
        methodProperty = prop
      }
    }

    if (middlewares) {
      routes.push({ object: node, middlewares, methodProperty })
    }
  })

  return routes
}

/**
 * Finds the first expression under `node` that writes to a request's `allowed`
 * property, covering `req.allowed = [...]`, `req.allowed ??= []`, and
 * `req.allowed.push(...)`.
 *
 * When `node` is a function, only its own first parameter counts as the
 * request, so an unrelated object with an `allowed` property doesn't match.
 */
export const findAllowedMutation = (
  node: TSESTree.Node
): TSESTree.Node | null => {
  let requestName: string | null = null

  if (isFunctionNode(node)) {
    const first = node.params[0]
    if (first?.type !== AST_NODE_TYPES.Identifier) {
      return null
    }
    requestName = first.name
  }

  const isRequestRef = (candidate: TSESTree.Node): boolean =>
    candidate.type === AST_NODE_TYPES.Identifier &&
    (requestName === null || candidate.name === requestName)

  const isAllowedMember = (candidate: TSESTree.Node): boolean =>
    candidate.type === AST_NODE_TYPES.MemberExpression &&
    !candidate.computed &&
    candidate.property.type === AST_NODE_TYPES.Identifier &&
    candidate.property.name === "allowed" &&
    isRequestRef(candidate.object)

  let found: TSESTree.Node | null = null

  walkAst(node, (current) => {
    if (found) {
      return false
    }

    if (
      current.type === AST_NODE_TYPES.AssignmentExpression &&
      isAllowedMember(current.left)
    ) {
      found = current
      return false
    }

    if (
      current.type === AST_NODE_TYPES.CallExpression &&
      current.callee.type === AST_NODE_TYPES.MemberExpression &&
      isAllowedMember(current.callee.object)
    ) {
      found = current
      return false
    }

    return true
  })

  return found
}

/** Finds the first `allowFields(...)` call under `node`. */
export const findAllowFieldsCall = (
  node: TSESTree.Node
): TSESTree.CallExpression | null => {
  let found: TSESTree.CallExpression | null = null

  walkAst(node, (current) => {
    if (found) {
      return false
    }
    if (
      current.type === AST_NODE_TYPES.CallExpression &&
      current.callee.type === AST_NODE_TYPES.Identifier &&
      current.callee.name === ALLOW_FIELDS
    ) {
      found = current
      return false
    }

    return true
  })

  return found
}
