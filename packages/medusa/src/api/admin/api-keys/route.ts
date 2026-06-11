import { createApiKeysWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminCreateApiKeyType } from "./validators"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * Retrieves a list of API keys with optional filtering and pagination.
 * 
 * This endpoint allows administrators to list API keys registered in the system.
 * It supports filtering by various criteria and returns paginated results.
 * Token values are omitted from the response for security purposes.
 * 
 * @param req - The authenticated request object containing filters and pagination parameters
 * @param res - The response object
 * @returns Paginated list of API keys with metadata
 * 
 * @example
 * ```typescript
 * // GET /admin/api-keys?limit=20&offset=0&type=secret
 * // Returns: { api_keys: ApiKey[], count: number, offset: number, limit: number }
 * ```
 * 
 * @see {@link https://docs.medusajs.com/api/admin#api-keys_getapikeys | API Documentation}
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetApiKeysParams>,
  res: MedusaResponse<HttpTypes.AdminApiKeyListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "api_key",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: apiKeys, metadata } = await remoteQuery(queryObject)

  res.json({
    api_keys: apiKeys,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

/**
 * Creates a new API key with the provided configuration.
 * 
 * This endpoint creates either a secret key (for backend use) or a publishable key
 * (for frontend use). The raw token is returned in the response for secret keys,
 * and this is the only time the full secret token will be visible.
 * 
 * The created API key is automatically associated with the authenticated user
 * as the creator for audit purposes.
 * 
 * @param req - The authenticated request object containing the API key data
 * @param res - The response object
 * @returns The created API key with the raw token (for secret keys)
 * 
 * @example
 * ```typescript
 * // POST /admin/api-keys
 * // Body: { title: "My API Key", type: "secret" }
 * // Returns: { api_key: { id: "apk_123", title: "My API Key", token: "sk_abc123...", type: "secret" } }
 * ```
 * 
 * @throws {ValidationError} When the request body validation fails
 * @see {@link https://docs.medusajs.com/api/admin#api-keys_postapikeys | API Documentation}
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateApiKeyType>,
  res: MedusaResponse<HttpTypes.AdminApiKeyResponse>
) => {
  const input = [
    {
      ...req.validatedBody,
      created_by: req.auth_context.actor_id,
    },
  ]

  const { result } = await createApiKeysWorkflow(req.scope).run({
    input: { api_keys: input },
  })

  // We should not refetch the api key here, as we need to show the secret key in the response (and never again)
  // And the only time we get to see the secret, is when we create it
  res.status(200).json({ api_key: result[0] })
}
