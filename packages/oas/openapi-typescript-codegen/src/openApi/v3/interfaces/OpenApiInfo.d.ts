import type { OpenApiContact } from "./OpenApiContact"
import type { OpenApiLicense } from "./OpenApiLicense"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#infoObject
 */
export interface OpenApiInfo {
  title: string
  description?: string
  termsOfService?: string
  contact?: OpenApiContact
  license?: OpenApiLicense
  version: string
}
