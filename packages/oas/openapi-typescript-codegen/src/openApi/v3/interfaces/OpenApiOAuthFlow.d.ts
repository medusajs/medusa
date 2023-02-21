import type { Dictionary } from "../../../utils/types"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#oauthFlowObject
 */
export interface OpenApiOAuthFlow {
  authorizationUrl: string
  tokenUrl: string
  refreshUrl?: string
  scopes: Dictionary<string>
}
