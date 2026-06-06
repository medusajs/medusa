import { isObject } from "@zjedene-medusa/framework/utils"

export function applyEnvVarsToProcess(env?: Record<any, any>) {
  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }
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
