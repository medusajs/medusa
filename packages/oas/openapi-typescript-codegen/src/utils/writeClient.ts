import { resolve } from "path"

import type { Client } from "../client/interfaces/Client"
import type { HttpClient } from "../HttpClient"
import type { Indent } from "../Indent"
import { mkdir, rmdir, writeFile } from "./fileSystem"
import { isDefined } from "./isDefined"
import { isSubDirectory } from "./isSubdirectory"
import type { Templates } from "./registerHandlebarTemplates"
import { writeClientClass } from "./writeClientClass"
import { writeClientCore } from "./writeClientCore"
import { writeClientHooks } from "./writeClientHooks"
import {
  writeClientIndex,
  writeClientIndexHooks,
  writeClientIndexModels,
  writeClientIndexServices,
} from "./writeClientIndex"
import { writeClientModels } from "./writeClientModels"
import { writeClientSchemas } from "./writeClientSchemas"
import { writeClientServices } from "./writeClientServices"
import { writeUseClient } from "./writeUseClient"
import { PackageNames } from "../index"
import { formatIndentation as i } from "./formatIndentation"

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore Generate core client classes
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportHooks Generate hooks
 * @param exportSchemas Generate schemas
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param packageNames Package name to use in import statements.
 * @param postfixServices Service name postfix
 * @param postfixModels Model name postfix
 * @param clientName Custom client class name
 * @param request Path to custom request file
 */
export const writeClient = async (
  client: Client,
  templates: Templates,
  output: string,
  httpClient: HttpClient,
  useOptions: boolean,
  useUnionTypes: boolean,
  exportCore: boolean,
  exportServices: boolean,
  exportModels: boolean,
  exportHooks: boolean,
  exportSchemas: boolean,
  indent: Indent,
  packageNames: PackageNames,
  postfixServices: string,
  postfixModels: string,
  clientName?: string,
  request?: string
): Promise<void> => {
  const outputPath = resolve(process.cwd(), output)
  const outputPathCore = resolve(outputPath, "core")
  const outputPathModels = resolve(outputPath, "models")
  const outputPathSchemas = resolve(outputPath, "schemas")
  const outputPathServices = resolve(outputPath, "services")
  const outputPathHooks = resolve(outputPath, "hooks")

  if (!isSubDirectory(process.cwd(), output)) {
    throw new Error(
      `Output folder is not a subdirectory of the current working directory`
    )
  }

  if (exportCore) {
    await rmdir(outputPathCore)
    await mkdir(outputPathCore)
    await writeClientCore(
      client,
      templates,
      outputPathCore,
      httpClient,
      indent,
      clientName,
      request
    )
  }

  if (exportServices) {
    await rmdir(outputPathServices)
    await mkdir(outputPathServices)
    await writeClientServices(
      client.services,
      templates,
      outputPathServices,
      httpClient,
      useUnionTypes,
      useOptions,
      indent,
      postfixServices,
      clientName,
      packageNames
    )
    await writeClientIndexServices(
      client,
      templates,
      outputPathServices,
      useUnionTypes,
      exportCore,
      exportServices,
      exportModels,
      exportHooks,
      exportSchemas,
      postfixServices,
      postfixModels,
      clientName
    )
  }

  if (exportHooks) {
    await rmdir(outputPathHooks)
    await mkdir(outputPathHooks)
    await writeClientHooks(
      client.services,
      templates,
      outputPathHooks,
      httpClient,
      useUnionTypes,
      useOptions,
      indent,
      postfixServices,
      clientName,
      packageNames
    )
    await writeClientIndexHooks(
      client,
      templates,
      outputPathHooks,
      useUnionTypes,
      exportCore,
      exportServices,
      exportModels,
      exportHooks,
      exportSchemas,
      postfixServices,
      postfixModels,
      clientName
    )
  }

  /**
   * Deprecate. To remove.
   */
  if (exportSchemas) {
    await rmdir(outputPathSchemas)
    await mkdir(outputPathSchemas)
    await writeClientSchemas(
      client.models,
      templates,
      outputPathSchemas,
      httpClient,
      useUnionTypes,
      indent
    )
  }

  if (exportModels) {
    await rmdir(outputPathModels)
    await mkdir(outputPathModels)
    await mkdir(outputPathCore)
    await writeFile(
      resolve(outputPathCore, "ModelUtils.ts"),
      i(templates.core.modelUtils({}), indent)
    )
    await writeClientModels(
      client.models,
      templates,
      outputPathModels,
      httpClient,
      useUnionTypes,
      indent
    )
    await writeClientIndexModels(
      client,
      templates,
      outputPathModels,
      useUnionTypes,
      exportCore,
      exportServices,
      exportModels,
      exportHooks,
      exportSchemas,
      postfixServices,
      postfixModels,
      clientName
    )
  }

  if (isDefined(clientName) && exportServices) {
    await mkdir(outputPath)
    await writeClientClass(
      client,
      templates,
      outputPath,
      httpClient,
      clientName,
      indent,
      postfixServices
    )
  }

  if (isDefined(clientName) && exportHooks) {
    await mkdir(outputPath)
    await mkdir(outputPathCore)
    await writeFile(
      resolve(outputPathCore, "HookUtils.ts"),
      i(templates.core.hookUtils({}), indent)
    )
    await writeUseClient(
      client,
      templates,
      outputPath,
      httpClient,
      clientName,
      indent,
      postfixServices,
      packageNames
    )
  }

  if (exportCore || exportServices || exportSchemas || exportModels) {
    await mkdir(outputPath)
    await writeClientIndex(
      client,
      templates,
      outputPath,
      useUnionTypes,
      exportCore,
      exportServices,
      exportModels,
      exportHooks,
      exportSchemas,
      postfixServices,
      postfixModels,
      clientName
    )
  }
}
