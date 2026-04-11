import { FeatureFlag } from "../feature-flags"
import { JobHandler } from "./handlers/job-handler"
import { StepHandler } from "./handlers/step-handler"
import { SubscriberHandler } from "./handlers/subscriber-handler"
import { WorkflowHandler } from "./handlers/workflow-handler"
import {
  addToInverseRegistry,
  addToRegistry,
  getOrCreateRegistry,
} from "./registry-helpers"
import {
  BaseResourceData,
  ResourceMap,
  ResourcePath,
  ResourceRegistrationData,
  ResourceTypeHandler,
} from "./types"

export type {
  BaseResourceData,
  ResourceEntry,
  ResourceMap,
  ResourcePath,
  ResourceType,
  ResourceTypeHandler,
} from "./types"

/**
 * Maps source file paths to their registered resources
 * Structure: sourcePath -> Map<resourceType, ResourceEntry[]>
 */
export const globalDevServerRegistry = new Map<ResourcePath, ResourceMap>()

/**
 * Inverse registry for looking up source paths by resource
 * Structure: "type:id" -> sourcePath[]
 * Used to find which files contain a specific resource
 */
export const inverseDevServerRegistry = new Map<ResourcePath, ResourcePath[]>()

/**
 * Registry of resource type handlers
 * Each handler implements the logic for a specific resource type
 */
const resourceHandlers = new Map<string, ResourceTypeHandler>()

/**
 * Register a resource type handler
 *
 * @example
 * ```typescript
 * class RouteHandler implements ResourceTypeHandler<RouteData> {
 *   readonly type = "route"
 *   validate(data: RouteData): void { ... }
 *   resolveSourcePath(data: RouteData): string { ... }
 *   createEntry(data: RouteData): ResourceEntry { ... }
 *   getInverseKey(data: RouteData): string { ... }
 * }
 *
 * registerResourceTypeHandler(new RouteHandler())
 * ```
 */
export function registerResourceTypeHandler(
  handler: ResourceTypeHandler
): void {
  if (resourceHandlers.has(handler.type)) {
    console.warn(
      `Resource type handler for "${handler.type}" is being overridden`
    )
  }

  resourceHandlers.set(handler.type, handler)
}

registerResourceTypeHandler(new WorkflowHandler())
registerResourceTypeHandler(new StepHandler(inverseDevServerRegistry))
registerResourceTypeHandler(new SubscriberHandler())
registerResourceTypeHandler(new JobHandler())

/**
 * Register a resource in the dev server for hot module reloading
 *
 * This function uses a strategy pattern where each resource type has its own handler.
 * The handler is responsible for:
 * - Validating the registration data
 * - Resolving the source path
 * - Creating the registry entry
 * - Generating the inverse registry key
 *
 * @param data - Resource registration data
 * @throws Error if validation fails or handler is not found
 *
 * @example
 * ```typescript
 * // Register a workflow
 * registerDevServerResource({
 *   type: "workflow",
 *   id: "create-product",
 *   sourcePath: "/src/workflows/create-product.ts"
 * })
 *
 * // Register a step
 * registerDevServerResource({
 *   type: "step",
 *   id: "validate-product",
 *   workflowId: "create-product"
 * })
 * ```
 */
export function registerDevServerResource(data: ResourceRegistrationData): void
export function registerDevServerResource<T extends BaseResourceData>(
  data: T
): void
export function registerDevServerResource<T extends BaseResourceData>(
  data: T
): void {
  // Skip registration in production or if HMR is disabled
  const isProduction = ["production", "prod"].includes(
    process.env.NODE_ENV || ""
  )

  if (!FeatureFlag.isFeatureEnabled("backend_hmr") || isProduction) {
    return
  }

  const handler = resourceHandlers.get(data.type)

  if (!handler) {
    throw new Error(
      `No handler registered for resource type "${data.type}". ` +
        `Available types: ${Array.from(resourceHandlers.keys()).join(", ")}. ` +
        `Use registerResourceTypeHandler() to add support for custom types.`
    )
  }

  try {
    handler.validate(data)

    const sourcePath = handler.resolveSourcePath(data)

    const registry = getOrCreateRegistry(globalDevServerRegistry, sourcePath)

    const entry = handler.createEntry(data)
    addToRegistry(registry, data.type, entry)

    const inverseKey = handler.getInverseKey(data)
    addToInverseRegistry(inverseDevServerRegistry, inverseKey, sourcePath)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Failed to register ${data.type} resource "${data.id}": ${errorMessage}`
    )
  }
}
