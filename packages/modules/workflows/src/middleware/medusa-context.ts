import type { Context, MedusaContainer } from "@medusajs/framework/types"
import {
  createMedusaContainer,
  isDefined,
  MedusaContext,
  MedusaContextType,
  MedusaModuleType,
} from "@medusajs/framework/utils"
import { formatStepKey } from "@medusajs/framework/workflows-sdk"
import type { RunScope } from "@medusajs/workflow-engine"

/**
 * Wraps a container so that module services resolved from it receive the
 * workflow's context in their `@MedusaContext()` parameter: the run's context
 * plus the current step's idempotency key. Keys the caller passed win.
 */
export function contextualizeContainer(
  container: MedusaContainer,
  currentScope: () => RunScope | undefined
): MedusaContainer {
  const scoped = createMedusaContainer({}, container)
  const resolve = scoped.resolve.bind(scoped)
  const proxies = new WeakMap<object, unknown>()

  const contextFor = (): Context | undefined => {
    const scope = currentScope()
    if (!scope) {
      return undefined
    }
    const context: Record<string, unknown> = { ...scope.context }
    delete context.manager
    delete context.transactionManager
    if (scope.stepId && scope.action) {
      context.idempotencyKey = formatStepKey({
        workflowId: scope.workflowId,
        transactionId: scope.transactionId,
        stepId: scope.stepId,
        action: scope.action,
      })
    }
    context.__type = MedusaContextType
    return context as Context
  }

  scoped.resolve = function (key: string, options?: any) {
    const resolved = resolve(key, options)
    if (
      !resolved ||
      typeof resolved !== "object" ||
      (resolved as any).constructor?.__type !== MedusaModuleType
    ) {
      return resolved
    }

    let proxy = proxies.get(resolved)
    if (!proxy) {
      const wrapped = new Map<PropertyKey, { value: Function; fn: Function }>()
      proxy = new Proxy(resolved, {
        get(target, prop) {
          const value = target[prop]
          if (typeof value !== "function" || prop === "constructor") {
            return value
          }
          const cached = wrapped.get(prop)
          if (cached && cached.value === value) {
            return cached.fn
          }
          const fn = (...args: unknown[]) => {
            const index = MedusaContext.getIndex(target, prop as string)
            if (isDefined(index)) {
              args[index] = withScopeContext(args[index], contextFor)
            }
            return value.apply(target, args)
          }
          wrapped.set(prop, { value, fn })
          return fn
        },
      })
      proxies.set(resolved, proxy)
    }
    return proxy
  } as MedusaContainer["resolve"]

  return scoped
}

/**
 * The context a module method receives: the run's context when the caller
 * passed none, or the caller's plain object on top of it. A Medusa context the
 * caller built is left as it is.
 */
function withScopeContext(
  passed: unknown,
  contextFor: () => Context | undefined
): unknown {
  if ((passed as any)?.__type === MedusaContextType) {
    return passed
  }
  if (passed !== undefined && !isPlainObject(passed)) {
    return passed
  }
  const context = contextFor()
  if (!context) {
    return passed
  }
  return passed === undefined ? context : { ...context, ...(passed as object) }
}

function isPlainObject(value: unknown): value is object {
  if (!value || typeof value !== "object") {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}
