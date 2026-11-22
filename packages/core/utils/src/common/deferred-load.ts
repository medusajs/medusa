export type DeferredLoadKind =
  | "route"
  | "middleware"
  | "subscriber"
  | "workflow"
  | "workflow-hook"
  | "module"

export type DeferredLoadTarget = {
  kind: DeferredLoadKind
  /**
   * What was being loaded: `GET <file>` for a route, the file path, the
   * workflow id, or the module key.
   */
  target: string
  file?: string
}

type DeferredLoadLogger = {
  error: (message: string, error?: Error) => void
}

const DEFERRED_LOAD_ERROR_MARKER = "__medusaDeferredLoadError"
const LOG_TOKEN = "deferred_load_failed"

let deferredLoadLogger: DeferredLoadLogger = console
const failureCounts = new Map<string, number>()

/**
 * Sets the logger deferred load failures are reported to (default: console).
 */
export function setDeferredLoadLogger(logger: DeferredLoadLogger) {
  deferredLoadLogger = logger
}

/**
 * Forgets which failures were already logged in full.
 */
export function resetDeferredLoadLog() {
  failureCounts.clear()
}

function getHint(kind: DeferredLoadKind, cause: unknown): string {
  const code = (cause as { code?: unknown } | undefined)?.code
  if (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND") {
    return (
      "A package or file it needs is not part of this bundle, because it was " +
      "not enabled or referenced when the app was built. Enable it at build " +
      "time and rebuild."
    )
  }
  if (kind === "module") {
    return (
      "The module failed to start on first use. An app built without " +
      "--bundle would have failed at startup instead. Check the module's " +
      "options and the services it connects to."
    )
  }
  return "It failed to load on first use."
}

/**
 * The failure of something a build manifest deferred until first use. The
 * original error is available as `cause`.
 */
export class DeferredLoadError extends Error {
  readonly [DEFERRED_LOAD_ERROR_MARKER] = true
  readonly kind: DeferredLoadKind
  readonly target: string
  readonly file?: string
  readonly hint: string
  readonly cause: unknown

  constructor(what: DeferredLoadTarget, cause: unknown) {
    const hint = getHint(what.kind, cause)
    const causeMessage = cause instanceof Error ? cause.message : String(cause)
    super(
      `Failed to load ${what.kind} "${what.target}" on first use: ${causeMessage}. ${hint}`
    )
    this.name = "DeferredLoadError"
    this.kind = what.kind
    this.target = what.target
    this.file = what.file
    this.hint = hint
    this.cause = cause
  }

  /**
   * Works across duplicated copies of the package, where `instanceof` fails.
   */
  static isDeferredLoadError(err: unknown): err is DeferredLoadError {
    return (
      err instanceof DeferredLoadError ||
      (typeof err === "object" &&
        err !== null &&
        (err as Record<string, unknown>)[DEFERRED_LOAD_ERROR_MARKER] === true)
    )
  }
}

function report(error: DeferredLoadError) {
  const key = `${error.kind}:${error.target}`
  const count = (failureCounts.get(key) ?? 0) + 1
  failureCounts.set(key, count)

  if (count > 1) {
    deferredLoadLogger.error(
      `${LOG_TOKEN} kind=${error.kind} target=${error.target} repeat=${count}`
    )
    return
  }

  const cause = error.cause as
    { name?: string; message?: string; code?: unknown } | undefined
  deferredLoadLogger.error(
    `${LOG_TOKEN} ${JSON.stringify({
      event: LOG_TOKEN,
      kind: error.kind,
      target: error.target,
      file: error.file,
      hint: error.hint,
      cause: {
        name: cause?.name,
        message: cause?.message ?? String(error.cause),
        code: cause?.code,
      },
    })}`,
    error.cause instanceof Error ? error.cause : undefined
  )
}

function wrap(what: DeferredLoadTarget, err: unknown): never {
  if (DeferredLoadError.isDeferredLoadError(err)) {
    throw err
  }
  const error = new DeferredLoadError(what, err)
  report(error)
  throw error
}

/**
 * Runs the load of something deferred by a build manifest. A failure is logged
 * and rethrown as a `DeferredLoadError`. Wrap only the load itself, never the
 * execution of what was loaded.
 */
export async function deferredLoad<T>(
  what: DeferredLoadTarget,
  load: () => Promise<T> | T
): Promise<T> {
  try {
    return await load()
  } catch (err) {
    return wrap(what, err)
  }
}

/**
 * Synchronous version of {@link deferredLoad}.
 */
export function deferredLoadSync<T>(
  what: DeferredLoadTarget,
  load: () => T
): T {
  try {
    return load()
  } catch (err) {
    return wrap(what, err)
  }
}
