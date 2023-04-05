export enum OpenApiVersion {
  V2 = 2,
  V3 = 3,
}

/**
 * Get the Open API specification version (V2 or V3). This generator only supports
 * version 2 and 3 of the specification, so we will alert the user if we encounter
 * an incompatible type. Or if the type is missing...
 * @param openApi The loaded spec (can be any object)
 */
export const getOpenApiVersion = (openApi: any): OpenApiVersion => {
  const info: any = openApi.swagger || openApi.openapi
  if (typeof info === "string") {
    const c = info.charAt(0)
    const v = Number.parseInt(c)
    if (v === OpenApiVersion.V2 || v === OpenApiVersion.V3) {
      return v as OpenApiVersion
    }
  }
  throw new Error(`Unsupported Open API version: "${String(info)}"`)
}
