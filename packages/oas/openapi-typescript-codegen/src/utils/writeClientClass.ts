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

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param clientName Custom client class name
 * @param indent Indentation options (4, 2 or tab)
 * @param postfix Service name postfix
 */
export const writeClientClass = async (
  client: Client,
  templates: Templates,
  outputPath: string,
  httpClient: HttpClient,
  clientName: string,
  indent: Indent,
  postfix: string
): Promise<void> => {
  const templateResult = templates.client({
    clientName,
    httpClient,
    postfix,
    server: client.server,
    version: client.version,
    models: sortModelsByName(client.models),
    services: sortServicesByName(client.services),
    httpRequest: getHttpRequestName(httpClient),
  })

  await writeFile(
    resolve(outputPath, `${clientName}.ts`),
    i(f(templateResult), indent)
  )
}
