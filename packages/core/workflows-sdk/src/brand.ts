import type { WorkflowConfigOptions } from "@medusajs/types"
import type { WorkflowDefinition } from "@medusajs/workflow-engine"

/**
 * Marks the objects `createWorkflow` returns, so loaders can find workflows
 * among a file's exports.
 */
export const WORKFLOW_BRAND = Symbol.for("medusa.workflow")

const DEFINITION = Symbol.for("medusa.workflow.definition")
const CHILDREN = Symbol.for("medusa.workflow.children")
const RUN_OPTIONS = Symbol.for("medusa.workflow.runOptions")

export function brandWorkflow(
  workflow: object,
  definition: WorkflowDefinition,
  children: Iterable<object> = [],
  runOptions: WorkflowConfigOptions = {}
): void {
  Object.defineProperty(workflow, WORKFLOW_BRAND, { value: true })
  Object.defineProperty(workflow, DEFINITION, { value: definition })
  Object.defineProperty(workflow, CHILDREN, { value: [...children] })
  Object.defineProperty(workflow, RUN_OPTIONS, { value: runOptions })
}

/**
 * Options set with the workflow's `.config()`. They apply to every run, below
 * the `workflowOptions` of the run itself.
 */
export function getWorkflowRunOptions(
  workflow: unknown
): WorkflowConfigOptions | undefined {
  const options = (workflow as any)?.[RUN_OPTIONS] as
    | WorkflowConfigOptions
    | undefined
  return options && Object.keys(options).length ? { ...options } : undefined
}

/**
 * The workflows this one runs with `runAsStep`.
 */
export function getWorkflowChildren(workflow: unknown): unknown[] {
  return (workflow as any)?.[CHILDREN] ?? []
}

export function isWorkflow(value: unknown): boolean {
  return (
    (typeof value === "function" || (!!value && typeof value === "object")) &&
    (value as any)[WORKFLOW_BRAND] === true
  )
}

export function getWorkflowDefinition(workflow: unknown): WorkflowDefinition {
  const definition = (workflow as any)?.[DEFINITION]
  if (!definition) {
    throw new Error("The value is not a workflow created with createWorkflow")
  }
  return definition
}
