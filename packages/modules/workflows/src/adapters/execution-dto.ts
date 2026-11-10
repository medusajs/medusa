import type {
  FilterableWorkflowExecutionProps,
  FindConfig,
  WorkflowExecutionDTO,
} from "@medusajs/framework/types"
import type {
  CompiledWorkflow,
  Engine,
  Page,
  RunFilter,
  RunRecord,
  RunStatus,
} from "@medusajs/workflow-engine"
import { MedusaError } from "@medusajs/framework/utils"
import { LegacyTransactionView } from "../legacy/transaction-view"
import { fromLegacyRunState, toLegacyRunState } from "./state"

/**
 * A run in the shape of the old `workflow_execution` row, which the admin
 * dashboard and the HTTP API read.
 */
export function toExecutionDTO(
  run: RunRecord,
  compiled?: CompiledWorkflow
): WorkflowExecutionDTO & {
  run_id: string
  retention_time: number | null
} {
  const transaction = new LegacyTransactionView(run, [], compiled)
  const context = transaction.getContext()

  return {
    id: run.id,
    workflow_id: run.workflowId,
    transaction_id: run.transactionId,
    run_id: run.id,
    state: toLegacyRunState(run.status) as WorkflowExecutionDTO["state"],
    execution: transaction.getFlow(),
    context: {
      data: context,
      errors: transaction.getErrors().map((error) => ({
        ...error,
        error: run.errors.find(
          (stored) =>
            stored.stepId === error.action &&
            stored.action === error.handlerType
        )?.error,
      })),
    },
    retention_time:
      run.retentionMs === null || run.retentionMs === undefined
        ? null
        : Math.round(run.retentionMs / 1000),
    created_at: new Date(run.createdAt),
    updated_at: new Date(run.updatedAt),
    deleted_at: null,
  } as any
}

const FILTER_KEYS = new Set([
  "id",
  "run_id",
  "workflow_id",
  "transaction_id",
  "state",
  "q",
  "created_at",
])

const ORDER_FIELDS = new Set(["created_at", "updated_at", "id", "run_id"])

function invalid(message: string): never {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [String(value)]
}

function intersect(a: string[] | undefined, b: string[]): string[] {
  return a ? a.filter((value) => b.includes(value)) : b
}

/**
 * The values a field may take, from a value, a list, or `$eq`/`$in`. Both
 * operators together match what is in both.
 */
function oneOf(field: string, value: unknown): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return list(value)
  }
  let values: string[] | undefined
  for (const [operator, operand] of Object.entries(value)) {
    if (operand === undefined) {
      continue
    }
    if (operator !== "$eq" && operator !== "$in") {
      invalid(`Unsupported operator ${operator} on ${field}`)
    }
    values = intersect(values, list(operand))
  }
  return values ?? invalid(`Missing value for ${field}`)
}

function statuses(states: string[]): RunStatus[] {
  return [...new Set(states.flatMap(fromLegacyRunState))]
}

function stateFilter(state: unknown, filter: RunFilter) {
  if (typeof state !== "object" || state === null || Array.isArray(state)) {
    filter.status = statuses(list(state))
    return
  }
  let included: string[] | undefined
  let excluded: string[] | undefined
  for (const [operator, operand] of Object.entries(state)) {
    if (operand === undefined) {
      continue
    }
    if (operator === "$eq" || operator === "$in") {
      included = intersect(included, list(operand))
    } else if (operator === "$ne" || operator === "$nin") {
      excluded = [...(excluded ?? []), ...list(operand)]
    } else {
      invalid(`Unsupported operator ${operator} on state`)
    }
  }
  if (included) {
    filter.status = statuses(included)
  }
  if (excluded) {
    filter.statusNot = statuses(excluded)
  }
}

/**
 * Run queries only bound `created_at` inclusively, so `$gt` and `$lt` match
 * like `$gte` and `$lte`.
 */
function createdAtFilter(createdAt: unknown, filter: RunFilter) {
  if (typeof createdAt !== "object" || createdAt === null) {
    const date = new Date(createdAt as string)
    filter.createdAfter = date
    filter.createdBefore = date
    return
  }
  for (const [operator, operand] of Object.entries(createdAt)) {
    if (operand === undefined) {
      continue
    }
    if (operator === "$gte" || operator === "$gt") {
      filter.createdAfter = new Date(operand as string)
    } else if (operator === "$lte" || operator === "$lt") {
      filter.createdBefore = new Date(operand as string)
    } else {
      invalid(`Unsupported operator ${operator} on created_at`)
    }
  }
}

/**
 * Turns the filters the execution list accepts into a run query. Legacy state
 * names map to run statuses. `id` and `run_id` both are the run's id.
 */
export function toRunFilter(
  filters: FilterableWorkflowExecutionProps & Record<string, any> = {}
): RunFilter {
  const filter: RunFilter = {}

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined) {
      continue
    }
    if (!FILTER_KEYS.has(key)) {
      invalid(`Workflow executions cannot be filtered by ${key}`)
    }
    if (value === null) {
      invalid(`Workflow executions cannot be filtered by ${key}: null`)
    }

    switch (key) {
      case "id":
      case "run_id":
        filter.ids = intersect(filter.ids, oneOf(key, value))
        break
      case "workflow_id":
        filter.workflowId = oneOf(key, value)
        break
      case "transaction_id":
        filter.transactionId = oneOf(key, value)
        break
      case "q":
        filter.q = String(value)
        break
      case "state":
        stateFilter(value, filter)
        break
      case "created_at":
        createdAtFilter(value, filter)
        break
    }
  }

  return filter
}

export type ExecutionOrder = {
  field: "created_at" | "updated_at"
  direction: "asc" | "desc"
}

/**
 * The order executions are listed in. `id` orders like `created_at`, since
 * run ids are time-ordered. Runs are ordered by one field only.
 */
export function toOrder(config: FindConfig<any> = {}): ExecutionOrder {
  const order = (config.order ?? {}) as Record<string, string>
  const entries = Object.entries(order).filter(([, value]) => value)
  for (const [field] of entries) {
    if (!ORDER_FIELDS.has(field)) {
      invalid(`Workflow executions cannot be ordered by ${field}`)
    }
  }
  if (entries.length > 1) {
    invalid(
      `Workflow executions can be ordered by one field only, received: ${entries
        .map(([field]) => field)
        .join(", ")}`
    )
  }
  const [field, direction] = entries[0] ?? ["created_at", "desc"]
  return {
    field: field === "updated_at" ? "updated_at" : "created_at",
    direction: String(direction).toLowerCase() === "asc" ? "asc" : "desc",
  }
}

/**
 * Steps are loaded only when a field built from them is selected.
 */
function needsSteps(config: FindConfig<any> = {}): boolean {
  const fields = [
    ...((config.select as string[] | undefined) ?? []),
    ...((config.relations as string[] | undefined) ?? []),
  ]
  if (!fields.length) {
    return true
  }
  return fields.some((field) => {
    const root = String(field).split(".")[0]
    return root === "*" || root === "execution" || root === "context"
  })
}

export function toPage(config: FindConfig<any> = {}): Page {
  return {
    limit: config.take ?? undefined,
    offset: config.skip ?? undefined,
    order: toOrder(config).direction,
    withSteps: needsSteps(config),
  }
}

/**
 * Workflow executions are read from the engine's runs.
 */
export async function listAndCountExecutions(
  engine: Engine,
  filters: FilterableWorkflowExecutionProps = {},
  config: FindConfig<WorkflowExecutionDTO> = {}
): Promise<[WorkflowExecutionDTO[], number]> {
  const [runs, count] = await engine.queryRuns(toRunFilter(filters), {
    ...toPage(config),
    orderBy: toOrder(config).field,
  })
  const { registry } = engine
  return [
    runs.map((run) =>
      toExecutionDTO(
        run,
        registry.has(run.workflowId) ? registry.get(run.workflowId) : undefined
      )
    ),
    count,
  ]
}

export async function retrieveExecution(
  engine: Engine,
  idOrObject: string | { workflow_id: string; transaction_id: string },
  config: FindConfig<WorkflowExecutionDTO> = {}
): Promise<WorkflowExecutionDTO> {
  const filters =
    typeof idOrObject === "string"
      ? { id: idOrObject }
      : {
          workflow_id: idOrObject.workflow_id,
          transaction_id: idOrObject.transaction_id,
        }
  const [executions] = await listAndCountExecutions(engine, filters, {
    ...config,
    take: 1,
  })
  if (!executions.length) {
    const id =
      typeof idOrObject === "string"
        ? idOrObject
        : `${idOrObject.workflow_id}:${idOrObject.transaction_id}`
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `WorkflowExecution with id: ${id} was not found`
    )
  }
  return executions[0]
}
