import {
  ContainerId,
  FormId,
  InjectionZone,
  RESOLVED_CONTAINER_MODULES,
  RESOLVED_FORM_MODULES,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_WIDGET_MODULES,
  VIRTUAL_MODULES,
  getContainerId,
  getContainerImport,
  getFormId,
  getFormImport,
  getVirtualId,
  getWidgetImport,
  getWidgetZone,
  resolveVirtualId,
} from "@medusajs/admin-shared"
import type * as Vite from "vite"
import {
  generateCustomFieldContainerEntrypoint,
  generateCustomFieldFormEntrypoint,
  getCustomFieldContainerPath,
  getCustomFieldFormPath,
  validateCustomFieldContainer,
  validateCustomFieldForm,
} from "./custom-fields"
import { generateRouteEntrypoint, validateRoute } from "./routes"
import { ExtensionGraph, LoadModuleOptions, MedusaVitePlugin } from "./types"
import { getModuleType } from "./utils"
import { generateWidgetEntrypoint, validateWidget } from "./widgets"

const EVENT_ADD = "add"
const EVENT_CHANGE = "change"

function getExtensionGraphPath(
  path: string,
  type: "form" | "container" | "widget" | "route"
) {
  if (["form", "container"].includes(type)) {
    return `${path}/${type}`
  }
  return path
}

export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const _extensionGraph: ExtensionGraph = new Map<string, Set<string>>()
  const _sources = new Set<string>(options?.sources ?? [])

  let server: Vite.ViteDevServer | undefined
  let watcher: Vite.FSWatcher | undefined

  async function generateEntrypoint(options: LoadModuleOptions) {
    switch (options.type) {
      case "widget":
        return await generateWidgetEntrypoint(_sources, options.get)
      case "route":
        return await generateRouteEntrypoint(_sources, options.get)
      case "form":
        return await generateCustomFieldFormEntrypoint(_sources, options.get)
      case "container":
        return await generateCustomFieldContainerEntrypoint(
          _sources,
          options.get
        )
      default:
        return null
    }
  }

  async function loadVirtualModule(id: string, options: LoadModuleOptions) {
    const result = await generateEntrypoint(options)
    if (!result) {
      return
    }

    const { module, paths } = result
    for (const path of paths) {
      const extensionGraphPath = getExtensionGraphPath(path, options.type)
      const ids = _extensionGraph.get(extensionGraphPath) || new Set<string>()
      ids.add(id)
      _extensionGraph.set(extensionGraphPath, ids)
    }
    return module
  }

  async function reloadModule(moduleId: string) {
    const module = server?.moduleGraph.getModuleById(moduleId)
    if (module) {
      await server?.reloadModule(module)
    }
  }

  async function reloadModules(moduleIds: Set<string>) {
    for (const moduleId of moduleIds) {
      await reloadModule(moduleId)
    }
  }

  function getWidgetZoneImports(zoneValues: InjectionZone[]): Set<string> {
    return new Set(
      zoneValues.map((zone) =>
        resolveVirtualId(getVirtualId(getWidgetImport(zone)))
      )
    )
  }

  function getCustomFieldFormImports(formId: FormId[]): Set<string> {
    return new Set(
      formId.map((form) => resolveVirtualId(getVirtualId(getFormImport(form))))
    )
  }

  function getCustomFieldContainerImports(
    containerIds: ContainerId[]
  ): Set<string> {
    return new Set(
      containerIds.map((container) =>
        resolveVirtualId(getVirtualId(getContainerImport(container)))
      )
    )
  }

  async function handleInvalidFile(file: string) {
    const extensionIds = _extensionGraph.get(file)
    _extensionGraph.delete(file)
    if (extensionIds) {
      await reloadModules(extensionIds)
    }
  }

  async function updateAndReload(graphPath: string, imports: Set<string>) {
    _extensionGraph.set(graphPath, imports)
    await reloadModules(imports)
  }

  async function genericHandler(
    file: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE,
    validator: (file: string) => Promise<any>,
    getImports: (result: any) => Set<string>,
    getGraphPath: (file: string) => string
  ) {
    const result = await validator(file)
    const graphPath = getGraphPath(file)

    if (!result.valid) {
      return event === EVENT_CHANGE
        ? await handleInvalidFile(graphPath)
        : undefined
    }

    const imports = getImports(result)

    if (event === EVENT_ADD || !_extensionGraph.has(graphPath)) {
      await updateAndReload(graphPath, imports)
      return
    }

    const existingModules = _extensionGraph.get(graphPath) || new Set<string>()
    const updatedImports = new Set<string>(existingModules)

    for (const moduleId of existingModules) {
      if (!imports.has(moduleId)) {
        updatedImports.delete(moduleId)
        await reloadModule(moduleId)
      }
    }

    for (const moduleId of imports) {
      if (!existingModules.has(moduleId)) {
        updatedImports.add(moduleId)
        await reloadModule(moduleId)
      }
    }

    await updateAndReload(graphPath, updatedImports)
  }

  async function handleWidgetChange(
    file: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    await genericHandler(
      file,
      event,
      validateWidget,
      (result) =>
        getWidgetZoneImports(
          Array.isArray(result.zone) ? result.zone : [result.zone]
        ),
      (file) => file
    )
  }

  async function handleRouteChange(
    file: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    await genericHandler(
      file,
      event,
      validateRoute,
      () => new Set(RESOLVED_ROUTE_MODULES),
      (file) => file
    )
  }

  async function handleCustomFieldChange(
    path: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    const formPath = getCustomFieldFormPath(path)
    const containerPath = getCustomFieldContainerPath(path)

    await genericHandler(
      path,
      event,
      validateCustomFieldForm,
      (result) =>
        getCustomFieldFormImports(
          Array.isArray(result.form) ? result.form : [result.form]
        ),
      () => formPath
    )

    await genericHandler(
      path,
      event,
      validateCustomFieldContainer,
      (result) => getCustomFieldContainerImports([result.container]),
      () => containerPath
    )
  }

  const handlers = {
    widget: handleWidgetChange,
    route: handleRouteChange,
    "custom-field": handleCustomFieldChange,
  }

  async function handleAddOrChange(
    path: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    const type = getModuleType(path)

    if (type === "none") {
      return
    }

    const handler = handlers[type]

    if (handler) {
      await handler(path, event)
    }
  }

  async function handleUnlink(path: string) {
    const moduleIds = _extensionGraph.get(path)
    _extensionGraph.delete(path)
    if (moduleIds) {
      await reloadModules(moduleIds)
    }
  }

  return {
    name: "@medusajs/admin-vite-plugin",
    enforce: "pre",
    configureServer(_server) {
      server = _server
      watcher = _server.watcher

      _sources.forEach((source) => {
        watcher?.add(source)
      })

      watcher.on("all", async (event, path) => {
        switch (event) {
          case "add":
          case "change":
            await handleAddOrChange(path, event)
            break
          case "unlinkDir":
          case "unlink":
            await handleUnlink(path)
            break
        }
      })
    },
    resolveId(id) {
      if (VIRTUAL_MODULES.includes(id)) {
        return resolveVirtualId(id)
      }
      return null
    },
    async load(id) {
      if (RESOLVED_WIDGET_MODULES.includes(id)) {
        return loadVirtualModule(id, { type: "widget", get: getWidgetZone(id) })
      }
      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        return loadVirtualModule(id, {
          type: "route",
          get: id.includes("link") ? "link" : "page",
        })
      }
      if (RESOLVED_FORM_MODULES.includes(id)) {
        return loadVirtualModule(id, { type: "form", get: getFormId(id) })
      }
      if (RESOLVED_CONTAINER_MODULES.includes(id)) {
        return loadVirtualModule(id, {
          type: "container",
          get: getContainerId(id),
        })
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
