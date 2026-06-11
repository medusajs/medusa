import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"

export const WORKFLOWS_SDK_SOURCE = "@medusajs/framework/workflows-sdk"

export const CREATE_WORKFLOW = "createWorkflow"
export const CREATE_STEP = "createStep"
export const TRANSFORM = "transform"
export const WHEN = "when"

export type WorkflowSdkBindings = {
  createWorkflow: Set<string>
  createStep: Set<string>
  transform: Set<string>
  when: Set<string>
}

export function createWorkflowSdkBindings(): WorkflowSdkBindings {
  return {
    createWorkflow: new Set(),
    createStep: new Set(),
    transform: new Set(),
    when: new Set(),
  }
}

const TRACKED_IMPORTS = [
  CREATE_WORKFLOW,
  CREATE_STEP,
  TRANSFORM,
  WHEN,
] as const

type TrackedImport = (typeof TRACKED_IMPORTS)[number]

const BUCKET_BY_IMPORT: Record<TrackedImport, keyof WorkflowSdkBindings> = {
  [CREATE_WORKFLOW]: "createWorkflow",
  [CREATE_STEP]: "createStep",
  [TRANSFORM]: "transform",
  [WHEN]: "when",
}

export function trackWorkflowSdkImports(
  node: TSESTree.ImportDeclaration,
  bindings: WorkflowSdkBindings
): void {
  if (node.source.value !== WORKFLOWS_SDK_SOURCE) return
  for (const specifier of node.specifiers) {
    if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) continue
    if (specifier.imported.type !== AST_NODE_TYPES.Identifier) continue
    const imported = specifier.imported.name as TrackedImport
    if (!(imported in BUCKET_BY_IMPORT)) continue
    bindings[BUCKET_BY_IMPORT[imported]].add(specifier.local.name)
  }
}

export type FunctionLike =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionExpression
  | TSESTree.FunctionDeclaration

export function getEnclosingFunction(
  node: TSESTree.Node
): FunctionLike | null {
  let current: TSESTree.Node | undefined = node.parent
  while (current) {
    if (
      current.type === AST_NODE_TYPES.ArrowFunctionExpression ||
      current.type === AST_NODE_TYPES.FunctionExpression ||
      current.type === AST_NODE_TYPES.FunctionDeclaration
    ) {
      return current
    }
    current = current.parent
  }
  return null
}

/**
 * Returns true when `fn` is the second argument to a `createWorkflow(...)`
 * call whose callee resolves to a tracked import binding.
 */
export function isWorkflowConstructorFunction(
  fn: FunctionLike,
  bindings: WorkflowSdkBindings
): boolean {
  const parent = fn.parent
  if (!parent || parent.type !== AST_NODE_TYPES.CallExpression) return false
  if (parent.arguments[1] !== fn) return false
  if (parent.callee.type !== AST_NODE_TYPES.Identifier) return false
  return bindings.createWorkflow.has(parent.callee.name)
}

/**
 * Returns true when `fn` is the first argument to a `.then(...)` call whose
 * receiver is a `when(...)` call against a tracked `when` import binding.
 *
 * The `.then(...)` callback runs at workflow-definition time, same as the
 * workflow constructor itself — anything you can't do in the constructor,
 * you also can't do here.
 */
export function isWhenThenCallbackFunction(
  fn: FunctionLike,
  bindings: WorkflowSdkBindings
): boolean {
  const parent = fn.parent
  if (!parent || parent.type !== AST_NODE_TYPES.CallExpression) return false
  if (parent.arguments[0] !== fn) return false
  const callee = parent.callee
  if (callee.type !== AST_NODE_TYPES.MemberExpression) return false
  if (callee.property.type !== AST_NODE_TYPES.Identifier) return false
  if (callee.property.name !== "then") return false
  const receiver = callee.object
  if (receiver.type !== AST_NODE_TYPES.CallExpression) return false
  if (receiver.callee.type !== AST_NODE_TYPES.Identifier) return false
  return bindings.when.has(receiver.callee.name)
}

/**
 * True when `node` lives directly inside a workflow constructor body — not
 * inside a nested `createStep` / `transform` callback.
 *
 * Implementation: the immediately-enclosing function must itself be the
 * workflow constructor. Nested step/transform callbacks become the
 * immediately-enclosing function for code inside them, so this check
 * naturally excludes them.
 */
export function isInWorkflowConstructor(
  node: TSESTree.Node,
  bindings: WorkflowSdkBindings
): boolean {
  const fn = getEnclosingFunction(node)
  if (!fn) return false
  return isWorkflowConstructorFunction(fn, bindings)
}

/**
 * True when `node` lives inside the *body* of a function that runs at
 * workflow-*definition* time — either the workflow constructor itself, or
 * a `when(...).then(callback)` callback. Both are subject to the same
 * "no conditional control flow, no value manipulation" constraints.
 *
 * Excludes nodes inside `fn.params` (default-parameter expressions) — those
 * are arguably def-time too, but they're rarely the source of the bugs
 * these rules target and treating them as in-scope produces noisy
 * false-positives on legitimate defaults. Carve out if a rule emerges
 * that genuinely cares.
 *
 * Nested `createStep` / `transform` callbacks are *execution-time*; they
 * naturally fall out because they become the immediately-enclosing function.
 */
export function isInWorkflowDefinitionScope(
  node: TSESTree.Node,
  bindings: WorkflowSdkBindings
): boolean {
  const fn = getEnclosingFunction(node)
  if (!fn) return false
  if (
    !isWorkflowConstructorFunction(fn, bindings) &&
    !isWhenThenCallbackFunction(fn, bindings)
  ) {
    return false
  }

  let current: TSESTree.Node = node
  let parent: TSESTree.Node | undefined = current.parent
  while (parent && parent !== fn) {
    current = parent
    parent = current.parent
  }
  if (!parent) return false
  return !(fn.params as TSESTree.Node[]).includes(current)
}
