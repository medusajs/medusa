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
 * True when `node` lives directly inside a workflow constructor body — not
 * inside a nested `createStep` / `transform` / `when().then()` callback.
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
