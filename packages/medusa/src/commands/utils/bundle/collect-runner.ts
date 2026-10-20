/**
 * Collects the build manifest for a bundled build. Runs in its own process
 * from the compiled application (`node collect-runner.js <output.json>` with
 * the build output as cwd), without a database: modules load schema-only, as
 * for type generation, and resource files are imported to read their exports.
 */
// Must load first: records lookups made while the framework itself loads
import "./record-disk-lookups"
import { LinkLoader, MedusaAppLoader } from "@medusajs/framework"
import {
  getLastMergedSchemaInput,
  hashLoadedSchema,
  MedusaModule,
  mergeLoadedSchema,
} from "@medusajs/framework/modules-sdk"
import { WorkflowManager } from "@medusajs/framework/orchestration"
import {
  BuildManifest,
  ContainerRegistrationKeys,
  dynamicImport,
  getDefinedFileConfig,
  getResolvedPlugins,
  GraphQLUtils,
  HOOK_REGISTRATIONS_KEY,
  mergePluginModules,
  Modules,
  readDirRecursive,
  resolveExports,
  setModuleLoader,
} from "@medusajs/framework/utils"
import { writeFileSync } from "fs"
import path, { join, parse } from "path"
import { initializeContainer } from "../../../loaders"

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
]

/**
 * Modules that always load at boot:
 * - the core bootstrap calls them (subscribers, the defaults workflow)
 * - they set up shared runtime state in their loaders or lifecycle hooks
 *   (e.g. the workflow engine provides the job scheduler's storage). Hooks
 *   aren't visible on schema-only modules, so this can't be detected here.
 */
const EAGER_MODULES: string[] = [
  Modules.EVENT_BUS,
  Modules.STORE,
  Modules.SALES_CHANNEL,
  Modules.API_KEY,
  Modules.WORKFLOW_ENGINE,
  Modules.SETTINGS,
  Modules.SEARCH,
  Modules.INDEX,
]

/**
 * Files workflows are defined in are attributed to the first stack frame
 * outside of the workflow framework itself.
 */
const FRAMEWORK_FRAME =
  /[\\/](orchestration|workflows-sdk|utils|framework)[\\/]dist[\\/]|node:internal|collect-runner/

const isPlainData = (value: unknown) => {
  try {
    const json = JSON.stringify(value)
    return json !== undefined && JSON.stringify(JSON.parse(json)) === json
  } catch {
    return false
  }
}

const isSourceFile = (name: string) =>
  /\.(js|ts)$/.test(name) && !name.endsWith(".d.ts")

async function listFiles(dir: string) {
  const entries = await readDirRecursive(dir, { ignoreMissing: true })
  return entries
    .filter((entry) => !entry.isDirectory() && isSourceFile(entry.name))
    .map((entry) => join(entry.path, entry.name))
    .filter((file) => !file.includes("__tests__"))
}

async function main() {
  const [outputFile] = process.argv.slice(2)
  const directory = process.cwd()
  const diskLookups = (global as any).__MEDUSA_DISK_LOOKUPS__ as {
    resolutions: Record<string, string>
    reads: Set<string>
  }

  // Record every file the framework imports, with its exports
  const imported = new Map<string, Record<string, any>>()
  setModuleLoader({
    canLoad: (file) => path.isAbsolute(file),
    import: async (file) => {
      const fileExports = resolveExports(require(file))
      imported.set(file, fileExports)
      return fileExports
    },
  })

  // Record which file defines each workflow, and which registers each hook
  const workflowFiles = new Map<string, string>()
  const originalRegister = WorkflowManager.register
  WorkflowManager.register = function (
    this: typeof WorkflowManager,
    workflowId: string
  ) {
    const previous = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const stack = new Error().stack as unknown as NodeJS.CallSite[]
    Error.prepareStackTrace = previous
    const file = stack
      .map((site) => site.getFileName())
      .find((name) => name && !FRAMEWORK_FRAME.test(name))
    if (file && !workflowFiles.has(workflowId)) {
      workflowFiles.set(workflowId, file)
    }
    return originalRegister.apply(this, arguments as any)
  } as typeof WorkflowManager.register
  ;(global as any)[HOOK_REGISTRATIONS_KEY] = []

  const container = await initializeContainer(directory, {
    skipDbConnection: true,
  })
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const configModule = container.resolve(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const plugins = await getResolvedPlugins(directory, configModule, true)
  mergePluginModules(configModule, plugins, directory)

  await new LinkLoader(
    plugins.map((plugin) => join(plugin.resolve, "links")),
    logger
  ).load()

  const { modules } = await new MedusaAppLoader().load({
    registerInContainer: false,
    schemaOnly: true,
  })

  // Import the resources the loaders would: core first, then plugins/app
  const medusaDist = path.resolve(__dirname, "../../..")
  const apiDirs = [
    join(medusaDist, "api"),
    ...plugins.map((p) => join(p.resolve, "api")),
  ]
  const subscriberDirs = [
    join(medusaDist, "subscribers"),
    ...plugins.map((p) => join(p.resolve, "subscribers")),
  ]
  const workflowDirs = plugins.map((p) => join(p.resolve, "workflows"))

  for (const dir of apiDirs) {
    for (const file of await listFiles(dir)) {
      const { name } = parse(file)
      const segments = file.slice(dir.length).split(path.sep)
      const isRoute =
        name === "route" && !segments.some((segment) => segment.startsWith("_"))
      const isMiddlewares = name === "middlewares" && path.dirname(file) === dir
      if (isRoute || isMiddlewares) {
        await dynamicImport(file)
      }
    }
  }
  for (const dir of [...subscriberDirs, ...workflowDirs]) {
    for (const file of await listFiles(dir)) {
      if (!dir.endsWith("workflows") && parse(file).name === "index") {
        continue
      }
      await dynamicImport(file)
    }
  }

  const manifest: BuildManifest = {
    routes: {},
    subscribers: {},
    middlewares: {},
    workflows: {},
    lazyWorkflowFiles: [],
    workflowHooks: {},
    lazyModules: {},
  }
  const kept: Record<string, string> = {}

  for (const [file, fileExports] of imported) {
    if (getDefinedFileConfig(file)) {
      continue
    }
    const { name } = parse(file)

    if (name === "middlewares" && file.includes(`${path.sep}api${path.sep}`)) {
      const config = fileExports.default
      if (!config || config.errorHandler) {
        kept[file] = "middlewares: has an error handler"
        continue
      }
      const routes: NonNullable<
        BuildManifest["middlewares"]
      >[string]["routes"] = []
      let lazy = true
      for (const route of config.routes ?? []) {
        if (
          route.additionalDataValidator !== undefined ||
          (route.policies !== undefined && !isPlainData(route.policies)) ||
          (route.bodyParser !== undefined && !isPlainData(route.bodyParser))
        ) {
          lazy = false
          break
        }
        routes.push({
          matcher:
            route.matcher instanceof RegExp
              ? { regexp: route.matcher.source, flags: route.matcher.flags }
              : String(route.matcher),
          ...(route.methods !== undefined && { methods: route.methods }),
          ...(route.policies !== undefined && { policies: route.policies }),
          ...(route.bodyParser !== undefined && {
            bodyParser: route.bodyParser,
          }),
          middlewareArity: (route.middlewares ?? []).map(
            (fn: Function) => fn.length
          ),
        })
      }
      if (lazy) {
        manifest.middlewares![file] = { routes }
      } else {
        kept[file] = "middlewares: route config isn't plain data"
      }
    } else if (name === "route") {
      manifest.routes![file] = {
        methods: Object.keys(fileExports).filter(
          (key) =>
            HTTP_METHODS.includes(key) && typeof fileExports[key] === "function"
        ),
        ...("AUTHENTICATE" in fileExports && {
          authenticate: !!fileExports.AUTHENTICATE,
        }),
        ...("CORS" in fileExports && { cors: !!fileExports.CORS }),
      }
    } else if (
      file.includes(`${path.sep}subscribers${path.sep}`) &&
      typeof fileExports.default === "function" &&
      fileExports.config
    ) {
      if (isPlainData(fileExports.config)) {
        manifest.subscribers![file] = {
          config: fileExports.config,
          handlerName: fileExports.default.name,
        }
      } else {
        kept[file] = "subscriber: config isn't plain data"
      }
    }
  }

  // Workflows load on first use; files that define them aren't imported at
  // boot. Files that only register hooks load before the workflow first runs.
  const definingFiles = new Set(workflowFiles.values())
  for (const [workflowId, file] of workflowFiles) {
    manifest.workflows![workflowId] = file
  }
  for (const file of definingFiles) {
    if (workflowDirs.some((dir) => file.startsWith(dir + path.sep))) {
      manifest.lazyWorkflowFiles!.push(file)
    }
  }
  const hookFiles = new Set<string>()
  for (const { workflowId, file } of (global as any)[HOOK_REGISTRATIONS_KEY]) {
    if (!file || definingFiles.has(file) || getDefinedFileConfig(file)) {
      continue
    }
    const files = (manifest.workflowHooks![workflowId] ??= [])
    if (!files.includes(file)) {
      files.push(file)
    }
    hookFiles.add(file)
  }
  manifest.lazyWorkflowFiles!.push(...hookFiles)

  // The query graph schema, as merged while the modules loaded
  const schemaInput = getLastMergedSchemaInput()
  if (schemaInput !== undefined) {
    const merged = mergeLoadedSchema(schemaInput)
    manifest.graphqlSchema = {
      inputHash: hashLoadedSchema(schemaInput),
      typeDefs: GraphQLUtils.print(merged.typeDefs),
      notFound: merged.notFound,
    }
  }

  // Modules with loaders run them at boot, and loaders can persist state that
  // other code reads directly (e.g. payment and fulfillment providers are
  // registered in the database): deferring them would change behaviour
  const hasLoaders = (resolution: any): boolean => {
    try {
      // Modules given by path export their definition from it
      const exported =
        resolution.moduleExports ??
        (resolution.resolutionPath
          ? require(resolution.resolutionPath)
          : undefined)
      return !!(exported?.default ?? exported)?.loaders?.length
    } catch {
      return false
    }
  }
  const modulesWithLoaders = new Set(
    MedusaModule.getAllModuleResolutions()
      .filter(hasLoaders)
      .map((resolution) => resolution.definition.key)
  )

  // Modules that boot doesn't need load on first use
  for (const [key, service] of Object.entries(modules ?? {})) {
    if (Array.isArray(service) || !service) {
      continue
    }
    const hooks = (service as any).__hooks
    if (EAGER_MODULES.includes(key)) {
      continue
    }
    if (hooks && Object.keys(hooks).length) {
      kept[`module:${key}`] = "has lifecycle hooks"
      continue
    }
    if (modulesWithLoaders.has(key)) {
      kept[`module:${key}`] = "has loaders"
      continue
    }
    const joinerConfig = MedusaModule.getJoinerConfig(key) ?? null
    if (joinerConfig && !isPlainData(joinerConfig)) {
      kept[`module:${key}`] = "joiner config isn't plain data"
      continue
    }
    manifest.lazyModules![key] = {
      joinerConfig: joinerConfig
        ? JSON.parse(JSON.stringify(joinerConfig))
        : null,
    }
  }

  // Where each module's code lives: its providers and loaders load by path
  // when it boots, so the bundle includes them all
  const moduleDirs = MedusaModule.getAllModuleResolutions()
    .map((resolution) => resolution.resolutionPath)
    .filter((resolutionPath): resolutionPath is string => !!resolutionPath)
    .map((resolutionPath) => {
      try {
        return path.dirname(require.resolve(resolutionPath))
      } catch {
        return undefined
      }
    })
    .filter(Boolean)

  writeFileSync(
    outputFile,
    JSON.stringify({
      manifest,
      kept,
      moduleDirs,
      pluginDirs: plugins.map((plugin) => plugin.resolve),
      resolutions: diskLookups.resolutions,
      reads: [...diskLookups.reads],
      loaded: Object.keys(require.cache),
    })
  )
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error)
    process.exit(1)
  }
)
