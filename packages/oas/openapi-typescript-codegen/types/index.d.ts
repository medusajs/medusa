export declare enum HttpClient {
  FETCH = "fetch",
  XHR = "xhr",
  NODE = "node",
  AXIOS = "axios",
  ANGULAR = "angular",
}

export declare enum Indent {
  SPACE_4 = "4",
  SPACE_2 = "2",
  TAB = "tab",
}

export type PackageNames = {
  models?: string
  client?: string
}

export type Options = {
  input: string | Record<string, any>
  output: string
  httpClient?: HttpClient | "fetch" | "xhr" | "node" | "axios" | "angular"
  clientName?: string
  useOptions?: boolean
  useUnionTypes?: boolean
  exportCore?: boolean
  exportServices?: boolean
  exportModels?: boolean
  exportHooks?: boolean
  exportSchemas?: boolean
  indent?: Indent | "4" | "2" | "tab"
  packageNames?: PackageNames
  postfixServices?: string
  postfixModels?: string
  request?: string
  write?: boolean
}

export declare function generate(options: Options): Promise<void>

declare type OpenAPI = {
  HttpClient: HttpClient
  Indent: Indent
  generate: typeof generate
}

export default OpenAPI
