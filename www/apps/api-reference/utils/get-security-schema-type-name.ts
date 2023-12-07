import { OpenAPIV3 } from "openapi-types"

export default function getSecuritySchemaTypeName(
  securitySchema: OpenAPIV3.SecuritySchemeObject
) {
  switch (securitySchema.type) {
    case "apiKey":
      return "API Key"
    case "http":
      return "HTTP"
    case "oauth2":
      return "OAuth2"
    case "openIdConnect":
      return "OpenID Connect"
  }
}
