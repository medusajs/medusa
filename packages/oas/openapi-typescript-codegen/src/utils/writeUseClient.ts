import { resolve } from "path"

import type { Client } from "../client/interfaces/Client"
import type { HttpClient } from "../HttpClient"
import type { Indent } from "../Indent"
import { writeFile } from "./fileSystem"
import { formatCode as f } from "./formatCode"
import { formatIndentation as i } from "./formatIndentation"
import { getHttpRequestName } from "./getHttpRequestName"
import type { Templates } from "./registerHandlebarTemplates"
import { sortModelsByName } from "./sortModelsByName"
import { sortServicesByName } from "./sortServicesByName"
import camelCase from "camelcase"
import { PackageNames } from "../index"

/**
 * Generate context for hooks.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param clientName Custom client class name
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 * @param packageNames Package name to use in import statements.
 */
export const writeUseClient = async (
  client: Client,
  templates: Templates,
  outputPath: string,
  httpClient: HttpClient,
  clientName: string,
  indent: Indent,
  postfix: string,
  packageNames: PackageNames = {}
): Promise<void> => {
  const templateResult = templates.useClient({
    clientName,
    httpClient,
    postfix,
    server: client.server,
    version: client.version,
    models: sortModelsByName(client.models),
    services: sortServicesByName(client.services),
    httpRequest: getHttpRequestName(httpClient),
    packageNames,
  })

  const filename = `use${camelCase(clientName, { pascalCase: true })}.tsx`
  await writeFile(resolve(outputPath, filename), i(f(templateResult), indent))
}
