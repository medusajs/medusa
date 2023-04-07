import type { OpenApiOAuthFlows } from "./OpenApiOAuthFlows"
import type { OpenApiReference } from "./OpenApiReference"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#securitySchemeObject
 */
export interface OpenApiSecurityScheme extends OpenApiReference {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect"
  description?: string
  name?: string
  in?: "query" | "header" | "cookie"
  scheme?: string
  bearerFormat?: string
  flows?: OpenApiOAuthFlows
  openIdConnectUrl?: string
}
