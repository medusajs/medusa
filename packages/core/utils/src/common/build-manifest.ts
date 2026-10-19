/**
 * Facts about the application collected at build time, so they don't have to
 * be computed (or files imported) while the server boots. Every field is
 * optional: anything missing is discovered at runtime as before.
 */
export interface BuildManifest {
  /**
   * Route files, keyed by absolute path, with what the router needs to
   * register them without importing the file.
   */
  routes?: Record<
    string,
    { methods: string[]; authenticate?: boolean; cors?: boolean }
  >
  /**
   * Subscriber files, keyed by absolute path.
   */
  subscribers?: Record<
    string,
    { config: Record<string, unknown>; handlerName?: string }
  >
  /**
   * Middleware files (`defineMiddlewares`), keyed by absolute path, with each
   * route's registration data. Middleware functions load on first request.
   */
  middlewares?: Record<
    string,
    {
      routes: {
        matcher: string | { regexp: string; flags: string }
        methods?: string[]
        policies?: unknown
        bodyParser?: unknown
        middlewareArity: number[]
      }[]
    }
  >
  /**
   * The query graph's GraphQL type definitions, cleaned and merged at build
   * time. Used when the loaded modules' schemas hash to `inputHash`.
   */
  graphqlSchema?: {
    inputHash: string
    typeDefs: string
    notFound: Record<string, Record<string, string>>
  }
  /**
   * Workflow id -> absolute path of the file that defines it.
   */
  workflows?: Record<string, string>
  /**
   * Files that only define workflows and can be loaded on first use.
   */
  lazyWorkflowFiles?: string[]
  /**
   * Workflow id -> files that register hook handlers on it. Those files load
   * before the workflow first runs instead of at boot.
   */
  workflowHooks?: Record<string, string[]>
  /**
   * Modules nothing uses during boot, keyed by module key, with what the app
   * needs from them at boot (their joiner config). They load on first use.
   */
  lazyModules?: Record<string, { joinerConfig: Record<string, any> | null }>
}

const BUILD_MANIFEST_KEY = "__MEDUSA_BUILD_MANIFEST__"

export function setBuildManifest(manifest: BuildManifest | undefined) {
  ;(globalThis as any)[BUILD_MANIFEST_KEY] = manifest
}

export function getBuildManifest(): BuildManifest | undefined {
  return (globalThis as any)[BUILD_MANIFEST_KEY]
}

const loadingWorkflows = new Set<string>()

/**
 * Loads the file defining a workflow that hasn't been registered yet. Returns
 * whether a file was loaded. Synchronous, so registry lookups can use it.
 */
export function loadWorkflowFromManifest(workflowId: string): boolean {
  const file = getBuildManifest()?.workflows?.[workflowId]
  // While the file evaluates it registers the workflow itself, which looks
  // the id up again: don't recurse.
  if (!file || loadingWorkflows.has(workflowId)) {
    return false
  }

  loadingWorkflows.add(workflowId)
  try {
    require(file)
  } finally {
    loadingWorkflows.delete(workflowId)
  }
  return true
}

const loadedHookFiles = new Set<string>()
const workflowsBeingDefined = new Set<string>()

/**
 * Marks a workflow as being defined. Hook files import the workflow they
 * attach to, so they can't load until its definition (and module) completes.
 */
export function setWorkflowBeingDefined(workflowId: string, defining: boolean) {
  if (defining) {
    workflowsBeingDefined.add(workflowId)
  } else {
    workflowsBeingDefined.delete(workflowId)
  }
}

/**
 * Loads the files registering hook handlers on a workflow, if the build
 * manifest deferred them. Must run before the workflow executes.
 */
export function loadWorkflowHooksFromManifest(workflowId: string) {
  if (workflowsBeingDefined.has(workflowId)) {
    return
  }
  for (const file of getBuildManifest()?.workflowHooks?.[workflowId] ?? []) {
    if (!loadedHookFiles.has(file)) {
      require(file)
      // Only once loaded: a failed load must surface again, not be skipped
      loadedHookFiles.add(file)
    }
  }
}

/**
 * Lets a build step record which file registers a hook on which workflow:
 * set to an array to collect `{ workflowId, hook, file }` entries.
 */
export const HOOK_REGISTRATIONS_KEY = "__MEDUSA_HOOK_REGISTRATIONS__"
