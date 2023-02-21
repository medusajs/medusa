import { HttpClient } from "./HttpClient"
import { Indent } from "./Indent"
import { parse } from "./openApi/v3"
import { getOpenApiSpec } from "./utils/getOpenApiSpec"
import { getOpenApiVersion } from "./utils/getOpenApiVersion"
import { isString } from "./utils/isString"
import { postProcessClient } from "./utils/postProcessClient"
import { registerHandlebarTemplates } from "./utils/registerHandlebarTemplates"
import { writeClient } from "./utils/writeClient"

export { HttpClient } from "./HttpClient"
export { Indent } from "./Indent"

export type PackageNames = {
  models?: string
  client?: string
}

export type Options = {
  input: string | Record<string, any>
  output: string
  httpClient?: HttpClient
  clientName?: string
  useOptions?: boolean
  useUnionTypes?: boolean
  exportCore?: boolean
  exportServices?: boolean
  exportModels?: boolean
  exportHooks?: boolean
  exportSchemas?: boolean
  indent?: Indent
  packageNames?: PackageNames
  postfixServices?: string
  postfixModels?: string
  request?: string
  write?: boolean
}

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 * @param clientName Custom client class name
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore Generate core client classes
 * @param exportServices Generate services
 * @param exportModels Generate models
 * @param exportHooks Generate hooks
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param packageNames Package name to use in import statements.
 * @param postfixServices Service name postfix
 * @param postfixModels Model name postfix
 * @param request Path to custom request file
 * @param write Write the files to disk (true or false)
 */
export const generate = async ({
  input,
  output,
  httpClient = HttpClient.FETCH,
  clientName,
  useOptions = false,
  useUnionTypes = false,
  exportCore = true,
  exportServices = true,
  exportModels = true,
  exportHooks = true,
  exportSchemas = false,
  indent = Indent.SPACE_4,
  packageNames = {},
  postfixServices = "Service",
  postfixModels = "",
  request,
  write = true,
}: Options): Promise<void> => {
  const openApi = isString(input) ? await getOpenApiSpec(input) : input
  const openApiVersion = getOpenApiVersion(openApi)
  const templates = registerHandlebarTemplates({
    httpClient,
    useUnionTypes,
    useOptions,
  })

  const client = parse(openApi)
  const clientFinal = postProcessClient(client)
  if (write) {
    await writeClient(
      clientFinal,
      templates,
      output,
      httpClient,
      useOptions,
      useUnionTypes,
      exportCore,
      exportServices,
      exportModels,
      exportHooks,
      exportSchemas,
      indent,
      packageNames,
      postfixServices,
      postfixModels,
      clientName,
      request
    )
  }
}

export default {
  HttpClient,
  generate,
}
