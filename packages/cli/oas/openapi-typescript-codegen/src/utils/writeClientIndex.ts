import { resolve } from "path"

import type { Client } from "../client/interfaces/Client"
import { writeFile } from "./fileSystem"
import { isDefined } from "./isDefined"
import { Templates } from "./registerHandlebarTemplates"
import { sortModelsByName } from "./sortModelsByName"
import { sortServicesByName } from "./sortServicesByName"

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore Generate core
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportHooks Generate hooks
 * @param exportSchemas Generate schemas
 * @param postfixServices Service name postfix
 * @param postfixModels Model name postfix
 * @param clientName Custom client class name
 */
export const writeClientIndex = async (
  client: Client,
  templates: Templates,
  outputPath: string,
  useUnionTypes: boolean,
  exportCore: boolean,
  exportServices: boolean,
  exportModels: boolean,
  exportHooks: boolean,
  exportSchemas: boolean,
  postfixServices: string,
  postfixModels: string,
  clientName?: string
): Promise<void> => {
  const templateResult = templates.indexes.index({
    exportCore,
    exportServices,
    exportModels,
    exportHooks,
    exportSchemas,
    useUnionTypes,
    postfixServices,
    postfixModels,
    clientName,
    server: client.server,
    version: client.version,
    models: sortModelsByName(client.models),
    services: sortServicesByName(client.services),
    exportClient: isDefined(clientName) && exportServices,
  })

  await writeFile(resolve(outputPath, "index.ts"), templateResult)
}

export const writeClientIndexModels = async (
  client: Client,
  templates: Templates,
  outputPath: string,
  useUnionTypes: boolean,
  exportCore: boolean,
  exportServices: boolean,
  exportModels: boolean,
  exportHooks: boolean,
  exportSchemas: boolean,
  postfixServices: string,
  postfixModels: string,
  clientName?: string
): Promise<void> => {
  const templateResult = templates.indexes.indexModels({
    exportCore,
    exportServices,
    exportModels,
    exportHooks,
    exportSchemas,
    useUnionTypes,
    postfixServices,
    postfixModels,
    clientName,
    server: client.server,
    version: client.version,
    models: sortModelsByName(client.models),
    services: sortServicesByName(client.services),
    exportClient: isDefined(clientName),
  })

  await writeFile(resolve(outputPath, "index.ts"), templateResult)
}

export const writeClientIndexServices = async (
  client: Client,
  templates: Templates,
  outputPath: string,
  useUnionTypes: boolean,
  exportCore: boolean,
  exportServices: boolean,
  exportModels: boolean,
  exportHooks: boolean,
  exportSchemas: boolean,
  postfixServices: string,
  postfixModels: string,
  clientName?: string
): Promise<void> => {
  const templateResult = templates.indexes.indexServices({
    exportCore,
    exportServices,
    exportModels,
    exportHooks,
    exportSchemas,
    useUnionTypes,
    postfixServices,
    postfixModels,
    clientName,
    server: client.server,
    version: client.version,
    models: sortModelsByName(client.models),
    services: sortServicesByName(client.services),
    exportClient: isDefined(clientName),
  })

  await writeFile(resolve(outputPath, "index.ts"), templateResult)
}

export const writeClientIndexHooks = async (
  client: Client,
  templates: Templates,
  outputPath: string,
  useUnionTypes: boolean,
  exportCore: boolean,
  exportServices: boolean,
  exportModels: boolean,
  exportHooks: boolean,
  exportSchemas: boolean,
  postfixServices: string,
  postfixModels: string,
  clientName?: string
): Promise<void> => {
  const templateResult = templates.indexes.indexHooks({
    exportCore,
    exportServices,
    exportModels,
    exportHooks,
    exportSchemas,
    useUnionTypes,
    postfixServices,
    postfixModels,
    clientName,
    server: client.server,
    version: client.version,
    models: sortModelsByName(client.models),
    services: sortServicesByName(client.services),
    exportClient: isDefined(clientName),
  })

  await writeFile(resolve(outputPath, "index.ts"), templateResult)
}
