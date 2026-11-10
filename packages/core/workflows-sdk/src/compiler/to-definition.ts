import type {
  SchedulerOptions,
  WorkflowConfigOptions,
  WorkflowStepConfig,
} from "@medusajs/types"
import type {
  ScheduleOptions,
  StepOptions,
  WorkflowDefinition,
  WorkflowOptions,
} from "@medusajs/workflow-engine"
import { resolveValue } from "../utils/composer/helpers/resolve-value"
import { buildCompensate, buildInvoke, HookLookup } from "./handlers"
import type { WorkflowRecorder } from "./recorder"
import { buildValueContext } from "./values"

const seconds = (value?: number) =>
  value === undefined || value === null ? undefined : value * 1000

/**
 * Deprecated step options the engine has no equivalent for. They are still
 * accepted so existing workflows compile.
 */
const IGNORED_STEP_OPTIONS = [
  "store",
  "noWait",
  "backgroundExecution",
  "compensateAsync",
  "retryIntervalAwaiting",
  "maxAwaitingRetries",
] as const

/**
 * Options that used to change behaviour, so setting one is worth a warning.
 */
const WARNED_STEP_OPTIONS = new Set<string>([
  "compensateAsync",
  "retryIntervalAwaiting",
  "maxAwaitingRetries",
])
const warnedOptions = new Set<string>()

/**
 * Resolves the deprecated options, so the rest of the compiler only reads
 * current ones. `storeExecution` is an alias of `store`; the ignored step
 * options are dropped.
 */
export function normalizeLegacyOptions(
  options: WorkflowConfigOptions
): WorkflowConfigOptions
export function normalizeLegacyOptions(
  config: WorkflowStepConfig,
  step: { workflowId: string; stepId: string }
): WorkflowStepConfig
export function normalizeLegacyOptions(
  config: WorkflowConfigOptions | WorkflowStepConfig,
  step?: { workflowId: string; stepId: string }
): WorkflowConfigOptions | WorkflowStepConfig {
  if (!step) {
    const { storeExecution, ...options } = config as WorkflowConfigOptions
    return { ...options, store: options.store || storeExecution || undefined }
  }

  const normalized = { ...(config as WorkflowStepConfig) }
  for (const option of IGNORED_STEP_OPTIONS) {
    const value = normalized[option]
    delete normalized[option]
    if (
      value === undefined ||
      value === false ||
      !WARNED_STEP_OPTIONS.has(option) ||
      warnedOptions.has(option)
    ) {
      continue
    }
    warnedOptions.add(option)
    console.warn(
      `${step.workflowId}: step "${step.stepId}" sets "${option}", which is deprecated and ignored by the workflow engine.`
    )
  }
  return normalized
}

export function toStepOptions(config: WorkflowStepConfig): StepOptions {
  return {
    async: config.async || undefined,
    nested: config.nested || undefined,
    maxRetries: config.maxRetries,
    retryIntervalMs: seconds(config.retryInterval),
    autoRetry: config.autoRetry,
    timeoutMs: seconds(config.timeout),
    continueOnPermanentFailure: config.continueOnPermanentFailure,
    skipOnPermanentFailure: config.skipOnPermanentFailure,
    saveResponse: config.saveResponse,
  }
}

export function toScheduleOptions(
  schedule: WorkflowConfigOptions["schedule"]
): ScheduleOptions | undefined {
  if (!schedule) {
    return undefined
  }
  if (typeof schedule === "string") {
    return { cron: schedule, concurrency: "forbid" }
  }
  const options = schedule as SchedulerOptions & {
    cron?: string
    interval?: number
  }
  return {
    cron: options.cron,
    intervalMs: options.interval,
    concurrency: options.concurrency ?? "forbid",
    numberOfExecutions: options.numberOfExecutions,
  }
}

export function toWorkflowOptions(
  config: WorkflowConfigOptions
): WorkflowOptions {
  const options = normalizeLegacyOptions(config)
  return {
    timeoutMs: seconds(options.timeout),
    retentionTimeMs: seconds(options.retentionTime),
    idempotent: options.idempotent,
    store: options.store,
    durability: options.durability,
    schedule: toScheduleOptions(options.schedule),
  }
}

export function toDefinition({
  recorder,
  options,
  returned,
  hooks,
}: {
  recorder: WorkflowRecorder
  options: WorkflowConfigOptions
  returned: unknown
  hooks: HookLookup
}): WorkflowDefinition {
  return {
    id: recorder.workflowId,
    steps: recorder.steps.map((step) => ({
      id: step.id,
      dependsOn: step.dependsOn.map((dependency) => dependency.id),
      invoke: buildInvoke(step, hooks),
      compensate: buildCompensate(step, hooks),
      options: toStepOptions(
        normalizeLegacyOptions(step.config, {
          workflowId: recorder.workflowId,
          stepId: step.id,
        })
      ),
    })),
    options: toWorkflowOptions(options),
    result:
      returned === undefined
        ? undefined
        : (ctx) => resolveValue(returned, buildValueContext(ctx)),
  }
}
