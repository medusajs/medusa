import { isObject } from "@medusajs/framework/utils"

export function applyEnvVarsToProcess(env?: Record<any, any>) {
  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
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
