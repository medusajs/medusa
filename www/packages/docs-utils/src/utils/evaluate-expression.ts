/**
 * A minimal, side-effect-free evaluator for the ESTree expressions that MDX
 * attaches to `{...}` expression nodes and `export const` statements.
 *
 * It's intentionally limited to the constructs used in documentation pages
 * (identifiers, member access, literals, template literals, and simple
 * operators). Anything else resolves to {@link UNRESOLVED} so callers can decide
 * what to do with it instead of leaking a raw `{expression}` into the output.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const UNRESOLVED = Symbol("unresolved-expression")

export type EvaluationScope = Record<string, unknown>

type AstNode = {
  type?: string
  [key: string]: any
}

const isResolved = (value: unknown): boolean => value !== UNRESOLVED

/**
 * Evaluates an ESTree expression node against `scope`.
 *
 * @returns the resolved value, or {@link UNRESOLVED} if the expression uses a
 * construct or a variable that can't be resolved statically.
 */
export const evaluateExpression = (
  expression: AstNode | undefined | null,
  scope: EvaluationScope
): unknown => {
  if (!expression?.type) {
    return UNRESOLVED
  }

  switch (expression.type) {
    case "Literal":
      return expression.value
    case "Identifier":
      return expression.name in scope ? scope[expression.name] : UNRESOLVED
    case "MemberExpression": {
      const object = evaluateExpression(expression.object, scope)
      if (!isResolved(object) || object === null || object === undefined) {
        return UNRESOLVED
      }
      const key = expression.computed
        ? evaluateExpression(expression.property, scope)
        : expression.property?.name
      if (!isResolved(key) || key === undefined) {
        return UNRESOLVED
      }
      const value = (object as Record<string, unknown>)[key as string]
      return value === undefined ? UNRESOLVED : value
    }
    case "TemplateLiteral": {
      const quasis: AstNode[] = expression.quasis || []
      const expressions: AstNode[] = expression.expressions || []
      let result = ""
      for (let i = 0; i < quasis.length; i++) {
        result += quasis[i].value?.cooked ?? quasis[i].value?.raw ?? ""
        if (i < expressions.length) {
          const value = evaluateExpression(expressions[i], scope)
          const stringified = isResolved(value)
            ? stringifyValue(value)
            : undefined
          if (stringified === undefined) {
            return UNRESOLVED
          }
          result += stringified
        }
      }
      return result
    }
    case "BinaryExpression": {
      if (expression.operator !== "+") {
        return UNRESOLVED
      }
      const left = evaluateExpression(expression.left, scope)
      const right = evaluateExpression(expression.right, scope)
      if (!isResolved(left) || !isResolved(right)) {
        return UNRESOLVED
      }
      return (left as any) + (right as any)
    }
    case "LogicalExpression": {
      const left = evaluateExpression(expression.left, scope)
      if (!isResolved(left)) {
        return UNRESOLVED
      }
      switch (expression.operator) {
        case "||":
          if (left) {
            return left
          }
          break
        case "??":
          if (left !== null && left !== undefined) {
            return left
          }
          break
        case "&&":
          if (!left) {
            return left
          }
          break
        default:
          return UNRESOLVED
      }
      return evaluateExpression(expression.right, scope)
    }
    case "ConditionalExpression": {
      const test = evaluateExpression(expression.test, scope)
      if (!isResolved(test)) {
        return UNRESOLVED
      }
      return evaluateExpression(
        test ? expression.consequent : expression.alternate,
        scope
      )
    }
    case "ArrayExpression": {
      const elements: unknown[] = []
      for (const element of expression.elements || []) {
        const value = evaluateExpression(element, scope)
        if (!isResolved(value)) {
          return UNRESOLVED
        }
        elements.push(value)
      }
      return elements
    }
    case "ObjectExpression": {
      const object: Record<string, unknown> = {}
      for (const property of expression.properties || []) {
        if (property.type !== "Property" || property.computed) {
          return UNRESOLVED
        }
        const key = property.key?.name ?? property.key?.value
        if (key === undefined) {
          return UNRESOLVED
        }
        const value = evaluateExpression(property.value, scope)
        if (!isResolved(value)) {
          return UNRESOLVED
        }
        object[key] = value
      }
      return object
    }
    default:
      return UNRESOLVED
  }
}

/**
 * Evaluates the single expression of an MDX `{...}` node's estree program.
 */
export const evaluateEstreeExpression = (
  estree: AstNode | undefined,
  scope: EvaluationScope
): unknown => {
  const statement = estree?.body?.find(
    (node: AstNode) => node.type === "ExpressionStatement"
  )

  return statement
    ? evaluateExpression(statement.expression, scope)
    : UNRESOLVED
}

/**
 * Collects the `export const`/`const` declarations of an MDX ESM node into
 * `scope`, so that later expressions in the same page can reference them.
 *
 * Declarations are evaluated in order against the scope built so far, which
 * matches how MDX itself resolves them.
 */
export const collectDeclarations = (
  estree: AstNode | undefined,
  scope: EvaluationScope
): void => {
  for (const node of estree?.body || []) {
    const declaration =
      node.type === "ExportNamedDeclaration" ? node.declaration : node

    if (declaration?.type !== "VariableDeclaration") {
      continue
    }

    for (const declarator of declaration.declarations || []) {
      if (declarator.id?.type !== "Identifier") {
        continue
      }
      const value = evaluateExpression(declarator.init, scope)
      if (isResolved(value)) {
        scope[declarator.id.name] = value
      }
    }
  }
}

/**
 * Converts a resolved value into the string that should replace the expression
 * in the Markdown output. Objects and functions have no meaningful Markdown
 * representation, so they resolve to `undefined` and the expression is dropped.
 */
export const stringifyValue = (value: unknown): string | undefined => {
  switch (typeof value) {
    case "string":
      return value
    case "number":
    case "boolean":
    case "bigint":
      return String(value)
    default:
      return undefined
  }
}
