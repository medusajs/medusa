import type { OpenApiOAuthFlow } from "./OpenApiOAuthFlow"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#oauthFlowsObject
 */
export interface OpenApiOAuthFlows {
  implicit?: OpenApiOAuthFlow
  password?: OpenApiOAuthFlow
  clientCredentials?: OpenApiOAuthFlow
  authorizationCode?: OpenApiOAuthFlow
}
