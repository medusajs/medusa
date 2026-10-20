import type {
  Context,
  WorkflowConfigOptions,
  WorkflowOrchestratorRunDTO,
} from "@medusajs/framework/types"
import { MedusaContextType } from "@medusajs/framework/utils"
import { toWorkflowOptions } from "@medusajs/framework/workflows-sdk"
import type { WorkflowOptions } from "@medusajs/workflow-engine"
import { ulid } from "ulid"

const AUTO_TRANSACTION_PREFIX = "auto-"

export type NormalizedRunOptions = {
  transactionId: string
  unique: boolean
  context: Record<string, any>
  workflowOptions?: Partial<WorkflowOptions>
}

/**
 * One set of rules for both entry points.
 *
 * A run joins the caller's event group, and does not release it, only when
 * the caller passes that group or asks not to release. Otherwise it releases
 * its own group, even when started from a step: it may outlive that run.
 *
 * Options passed to the run override the ones set with `.config()`.
 */
export function toRunOptions(
  options: WorkflowOrchestratorRunDTO,
  sharedContext: Context = {},
  configured?: WorkflowConfigOptions
): NormalizedRunOptions {
  // A parent step key only counts when passed explicitly; inherited from a
  // caller's context it would link the run to the wrong step.
  const {
    manager,
    transactionManager,
    parentStepIdempotencyKey,
    eventGroupId: callerGroup,
    preventReleaseEvents,
    ...callerContext
  } = sharedContext as Record<string, any>
  void manager
  void transactionManager
  void parentStepIdempotencyKey
  void preventReleaseEvents

  const context: Record<string, any> = {
    ...callerContext,
    ...(options.context ?? {}),
  }
  delete context.manager
  delete context.transactionManager

  const transactionId =
    options.transactionId ??
    options.context?.transactionId ??
    `${AUTO_TRANSACTION_PREFIX}${ulid()}`

  const requested = options.context ?? {}
  context.preventReleaseEvents =
    requested.preventReleaseEvents ??
    (!!callerGroup && requested.eventGroupId === callerGroup)
  context.eventGroupId =
    requested.eventGroupId ??
    (context.preventReleaseEvents ? callerGroup : undefined) ??
    ulid()

  context.transactionId = transactionId
  context.__type = MedusaContextType

  const workflowOptions =
    configured || options.workflowOptions
      ? { ...configured, ...options.workflowOptions }
      : undefined

  return {
    transactionId,
    unique: !transactionId.startsWith(AUTO_TRANSACTION_PREFIX),
    context,
    workflowOptions: workflowOptions
      ? stripUndefined(toWorkflowOptions(workflowOptions))
      : undefined,
  }
}

function stripUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>
}
