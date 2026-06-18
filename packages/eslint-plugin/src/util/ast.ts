import type { TSESLint, TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"

/**
 * True when `node` is something other than a pure literal — i.e. it references
 * a binding or computes a value at runtime. `Literal` (string/number/boolean/
 * regex/etc.) and bare `TemplateLiteral` (no interpolations are non-literal in
 * themselves) return false; everything else (Identifier, MemberExpression,
 * CallExpression, …) returns true.
 *
 * Useful for skipping noise like `1 + 1` or `` `hello ${"x"}` `` when a rule
 * cares whether an expression touches a real binding.
 */
export const isNonLiteralRef = (node: TSESTree.Node): boolean => {
  if (
    node.type === AST_NODE_TYPES.Literal ||
    node.type === AST_NODE_TYPES.TemplateLiteral
  ) {
    return false
  }
  return true
}

/**
 * True when `node` represents an explicit `undefined` value — either the
 * `undefined` identifier or `void <expr>` (which always evaluates to
 * `undefined`).
 */
export const isUndefinedExpression = (node: TSESTree.Node): boolean => {
  if (node.type === AST_NODE_TYPES.Identifier && node.name === "undefined") {
    return true
  }
  if (
    node.type === AST_NODE_TYPES.UnaryExpression &&
    node.operator === "void"
  ) {
    return true
  }
  return false
}

/**
 * Strips TypeScript-only expression wrappers (`x as T`, `x satisfies T`, `x!`,
 * `<T>x`) that don't change the runtime value, so the underlying expression can
 * be inspected — e.g. `StepResponse.skip() as any` unwraps to the call.
 */
export const unwrapTsExpression = (
  node: TSESTree.Expression
): TSESTree.Expression => {
  let current = node
  while (
    current.type === AST_NODE_TYPES.TSAsExpression ||
    current.type === AST_NODE_TYPES.TSSatisfiesExpression ||
    current.type === AST_NODE_TYPES.TSNonNullExpression ||
    current.type === AST_NODE_TYPES.TSTypeAssertion
  ) {
    current = current.expression
  }
  return current
}

/**
 * The three AST node types that represent a function value:
 * `ArrowFunctionExpression`, `FunctionExpression`, and `FunctionDeclaration`.
 */
export type FunctionNode =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionExpression
  | TSESTree.FunctionDeclaration

const FUNCTION_NODE_TYPES = new Set<string>([
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
])

/**
 * Recursively walks the AST rooted at `node`, calling `visit` for every
 * descendant (including `node` itself). When `visit` returns `false` the walk
 * does not descend into that subtree's children — useful for "skip nested
 * function bodies" patterns.
 *
 * Skips the `parent` back-reference. Generic over the standard TSESTree shape;
 * does not know about parser-specific extension keys.
 */
export const walkAst = (
  node: TSESTree.Node | null | undefined,
  visit: (node: TSESTree.Node) => boolean | void
): void => {
  if (!node) {
    return
  }
  if (visit(node) === false) {
    return
  }

  for (const key of Object.keys(node)) {
    if (key === "parent") {
      continue
    }
    const value = (node as unknown as Record<string, unknown>)[key]
    if (!value) {
      continue
    }
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child === "object" && "type" in child) {
          walkAst(child as TSESTree.Node, visit)
        }
      }
    } else if (typeof value === "object" && "type" in (value as object)) {
      walkAst(value as TSESTree.Node, visit)
    }
  }
}

/**
 * True for `ArrowFunctionExpression`, `FunctionExpression`, and
 * `FunctionDeclaration`. Narrows to `FunctionNode`; accepts nullable input so
 * it can guard optional fields like a declarator's `init`.
 */
export const isFunctionNode = (
  node: TSESTree.Node | null | undefined
): node is FunctionNode => !!node && FUNCTION_NODE_TYPES.has(node.type)

/**
 * Returns the static key name of an object-literal property when it can be
 * resolved without scope analysis — either an `Identifier` key or a string
 * `Literal` key. Returns `null` for computed keys, non-`Property` elements
 * (spread, methods written as `SpreadElement`), and numeric/template keys.
 */
export const getPropertyKeyName = (
  prop: TSESTree.ObjectLiteralElement
): string | null => {
  if (prop.type !== AST_NODE_TYPES.Property || prop.computed) {
    return null
  }
  const key = prop.key
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name
  }
  if (key.type === AST_NODE_TYPES.Literal && typeof key.value === "string") {
    return key.value
  }
  return null
}

/**
 * Returns the first non-computed `Property` on `obj` whose static key name
 * matches `name`, or `null` if none exists. Skips `SpreadElement`s and any
 * `Property` with a computed/non-string/non-identifier key.
 */
export const findProperty = (
  obj: TSESTree.ObjectExpression,
  name: string
): TSESTree.Property | null => {
  for (const prop of obj.properties) {
    if (prop.type !== AST_NODE_TYPES.Property) {
      continue
    }
    if (getPropertyKeyName(prop) === name) {
      return prop
    }
  }
  return null
}

/**
 * Resolves an expression to the object literal it denotes, when that can be
 * determined without type information:
 * - An `ObjectExpression` is returned as-is.
 * - An `Identifier` is resolved through scope to a `const x = { ... }` binding.
 *
 * Returns `null` when the value can't be statically resolved to an object
 * literal (call expressions, spreads of unknown bindings, re-exports, etc.).
 * Callers that need to assert something about the object's shape should treat a
 * `null` result as "can't tell" and skip the check to avoid false positives.
 */
export const resolveObjectExpression = (
  node: TSESTree.Node | null | undefined,
  scope: TSESLint.Scope.Scope | null
): TSESTree.ObjectExpression | null => {
  if (!node) {
    return null
  }
  if (node.type === AST_NODE_TYPES.ObjectExpression) {
    return node
  }
  if (node.type === AST_NODE_TYPES.Identifier) {
    const variable = findVariableInScope(scope, node.name)
    if (variable) {
      for (const def of variable.defs) {
        if (
          def.node.type === AST_NODE_TYPES.VariableDeclarator &&
          def.node.init?.type === AST_NODE_TYPES.ObjectExpression
        ) {
          return def.node.init
        }
      }
    }
  }
  return null
}

/**
 * Whether an object literal is known to carry a property named `name`.
 *
 * Returns `true`/`false` when it can be determined statically, and `"unknown"`
 * when the object contains a `SpreadElement` — the property could be supplied
 * by the spread, so a rule must not flag its absence.
 */
export const objectHasProperty = (
  obj: TSESTree.ObjectExpression,
  name: string
): boolean | "unknown" => {
  if (findProperty(obj, name)) {
    return true
  }
  if (obj.properties.some((p) => p.type === AST_NODE_TYPES.SpreadElement)) {
    return "unknown"
  }
  return false
}

/**
 * Returns the name of the `VariableDeclarator` that directly initializes
 * `call`, e.g. `export const myWorkflow = createWorkflow(...)` → `"myWorkflow"`.
 *
 * Only matches when the call is the direct initializer of an identifier-bound
 * declarator — not when nested inside an object/array/etc. on the right-hand
 * side. Returns `null` otherwise.
 */
export const getInitializedVariableName = (
  call: TSESTree.CallExpression
): string | null => {
  const parent = call.parent
  if (
    parent &&
    parent.type === AST_NODE_TYPES.VariableDeclarator &&
    parent.init === call &&
    parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return parent.id.name
  }
  return null
}

/**
 * Walks the scope chain starting at `scope`, returning the first variable that
 * matches `name`. Returns `null` if no enclosing scope binds the name.
 */
export const findVariableInScope = (
  scope: TSESLint.Scope.Scope | null,
  name: string
): TSESLint.Scope.Variable | null => {
  let current: TSESLint.Scope.Scope | null = scope
  while (current) {
    const found = current.variables.find((v) => v.name === name)
    if (found) {
      return found
    }
    current = current.upper
  }
  return null
}

/**
 * Resolves an identifier to the function it refers to — either a `function`
 * declaration or a `const x = () => …` / `const x = function () {}`
 * initializer. Walks the scope chain from `scope` to find the binding.
 *
 * Returns `null` when the binding isn't a project-local function (e.g. a
 * re-export from another module, or a non-function value). Useful for
 * resolving the function behind a default-export identifier
 * (`export default handler`, `export { handler as default }`).
 */
export const resolveFunctionFromIdentifier = (
  scope: TSESLint.Scope.Scope | null,
  identifier: TSESTree.Identifier
): FunctionNode | null => {
  const variable = findVariableInScope(scope, identifier.name)
  if (!variable) {
    return null
  }

  for (const def of variable.defs) {
    if (def.node.type === AST_NODE_TYPES.FunctionDeclaration) {
      return def.node
    }
    if (
      def.node.type === AST_NODE_TYPES.VariableDeclarator &&
      isFunctionNode(def.node.init)
    ) {
      return def.node.init
    }
  }

  return null
}

/**
 * If `variable` has exactly one definition and that definition is a `const`
 * declaration initialized with a string literal, returns the literal's value.
 * Returns `null` otherwise — including for `let`/`var`, non-literal initializers,
 * and variables with multiple definitions (which can't be trusted as constants).
 */
export const getConstStringInit = (
  variable: TSESLint.Scope.Variable
): string | null => {
  if (variable.defs.length !== 1) {
    return null
  }
  const def = variable.defs[0]
  if (def.type !== "Variable") {
    return null
  }
  if (
    def.parent?.type !== AST_NODE_TYPES.VariableDeclaration ||
    def.parent.kind !== "const"
  ) {
    return null
  }
  const init = def.node.init
  if (
    !init ||
    init.type !== AST_NODE_TYPES.Literal ||
    typeof init.value !== "string"
  ) {
    return null
  }
  return init.value
}

/**
 * Resolves `node` to a string value when possible:
 * - If `node` is a string `Literal`, returns its value.
 * - If `node` is an `Identifier` that resolves to a single `const` string
 *   initializer in an enclosing scope, returns that literal's value.
 *
 * `reportNode` is the node a rule should anchor its diagnostic on — the
 * literal itself when the value is inline, the identifier when resolved via
 * scope. Returns `null` when the value cannot be statically resolved.
 */
export const resolveStaticStringValue = (
  node: TSESTree.Node,
  scope: TSESLint.Scope.Scope
): { value: string; reportNode: TSESTree.Node } | null => {
  if (node.type === AST_NODE_TYPES.Literal && typeof node.value === "string") {
    return { value: node.value, reportNode: node }
  }
  if (node.type === AST_NODE_TYPES.Identifier) {
    const variable = findVariableInScope(scope, node.name)
    const literal = variable && getConstStringInit(variable)
    if (literal !== null) {
      return { value: literal, reportNode: node }
    }
  }
  return null
}

/**
 * Returns the expression a function returns, when it can be determined
 * statically:
 * - Arrow with expression body: that expression.
 * - Arrow or function with a single top-level `return <expr>`: that expression.
 * Returns `null` otherwise (multiple returns, bare `return`, void). Does not
 * descend into nested functions.
 */
export const getReturnedExpression = (
  fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression
): TSESTree.Expression | null => {
  if (
    fn.type === AST_NODE_TYPES.ArrowFunctionExpression &&
    fn.body.type !== AST_NODE_TYPES.BlockStatement
  ) {
    return fn.body
  }
  const body = fn.body
  if (body.type !== AST_NODE_TYPES.BlockStatement) {
    return null
  }
  let found: TSESTree.Expression | null = null
  for (const stmt of body.body) {
    if (stmt.type !== AST_NODE_TYPES.ReturnStatement) {
      continue
    }
    if (!stmt.argument) {
      return null
    }
    if (found) {
      return null
    }
    found = stmt.argument
  }
  return found
}

/*
 * True when `fn`'s return type annotation is a `Promise<...>` reference.
 *
 * Shallow check — looks only at the outermost type reference's name. Doesn't
 * unwrap unions/intersections (`Promise<X> | null` returns false) or aliases
 * (a `type MyPromise = Promise<X>` returns false). Good enough for rules that
 * want to give `async`-equivalent return types a pass without paying for full
 * type-aware analysis.
 */
export const returnTypeIsPromise = (
  fn:
    | TSESTree.FunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.ArrowFunctionExpression
    | TSESTree.TSEmptyBodyFunctionExpression
): boolean => {
  const annotation = fn.returnType?.typeAnnotation
  if (!annotation) {
    return false
  }
  if (annotation.type !== AST_NODE_TYPES.TSTypeReference) {
    return false
  }
  const name = annotation.typeName
  if (name.type !== AST_NODE_TYPES.Identifier) {
    return false
  }
  return name.name === "Promise"
}

/**
 * Returns the `constructor` `MethodDefinition` on a class body, or `null` if
 * the class has none.
 */
export const findConstructor = (
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression
): TSESTree.MethodDefinition | null => {
  for (const member of node.body.body) {
    if (member.type !== AST_NODE_TYPES.MethodDefinition) {
      continue
    }
    if (member.kind === "constructor") {
      return member
    }
  }
  return null
}
