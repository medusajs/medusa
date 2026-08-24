import { isObject } from "@medusajs/framework/utils"

/**
 * Apply the given env vars to `process.env` and return a function that puts
 * `process.env` back the way it was. Keys that did not exist before are
 * removed on restore, keys that did are set back to their previous value.
 *
 * The runner shares a process with every other suite in the same worker, so
 * without the restore a suite's env leaks into whatever runs after it and the
 * result starts depending on file order.
 *
 * The returned function is safe to call more than once; the second call is a
 * no-op.
 */
export function applyEnvVarsToProcess(env?: Record<any, any>): () => void {
  if (!isObject(env)) {
    return () => {}
  }

  const previous = new Map<string, string | undefined>()

  Object.entries(env).forEach(([k, v]) => {
    if (!previous.has(k)) {
      previous.set(
        k,
        Object.prototype.hasOwnProperty.call(process.env, k)
          ? process.env[k]
          : undefined
      )
    }

    process.env[k] = v
  })

  return () => {
    previous.forEach((value, key) => {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    })

    previous.clear()
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    const pgError = error as Error & {
      code?: string
      detail?: string
      hint?: string
      where?: string
    }

    return [
      pgError.message || pgError.name,
      pgError.code && `code: ${pgError.code}`,
      pgError.detail && `detail: ${pgError.detail}`,
      pgError.hint && `hint: ${pgError.hint}`,
      pgError.where && `where: ${pgError.where}`,
    ]
      .filter(Boolean)
      .join("\n")
  }

  if (typeof error === "string") {
    return error
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === "string" && message.length > 0) {
      return message
    }
  }

  return String(error)
}

/**
 * Execute a function and return a promise that resolves when the function
 * resolves or rejects when the function rejects or the timeout is reached.
 * @param fn - The function to execute.
 * @param timeout - The timeout in milliseconds.
 * @returns A promise that resolves when the function resolves or rejects when the function rejects or the timeout is reached.
 */
export async function execOrTimeout(
  fn: Promise<any> | (() => Promise<void>),
  timeout: number = 5000
) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeout).unref()
  })

  const fnPromise = typeof fn === "function" ? fn() : fn

  return Promise.race([fnPromise, timeoutPromise])
}
