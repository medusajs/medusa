/**
 * @schema ApiKeyResponse
 * type: object
 * description: The API key's details.
 * x-schemaName: ApiKeyResponse
 * required:
 *   - id
 *   - token
 *   - redacted
 *   - title
 *   - type
 *   - last_used_at
 *   - created_by
 *   - created_at
 *   - revoked_by
 *   - revoked_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The API key's ID.
 *   token:
 *     type: string
 *     title: token
 *     description: The API key's token.
 *   redacted:
 *     type: string
 *     title: redacted
 *     description: The redacted form of the API key's token. This is useful when showing portion of the token. For example `sk_...123`.
 *   title:
 *     type: string
 *     title: title
 *     description: The API key's title.
 *   type:
 *     type: string
 *     description: The API key's type. `secret` API keys are used for authenticating admin users, and `publishable` API key are used for storefronts and similar clients to scope requests to sales channels.
 *     enum:
 *       - secret
 *       - publishable
 *   last_used_at:
 *     type: string
 *     title: last_used_at
 *     description: The date the API key was last used.
 *     format: date-time
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that created the API key.
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The date the API key was created.
 *     format: date-time
 *   revoked_by:
 *     type: string
 *     title: revoked_by
 *     description: The ID of the user that revoked the API key.
 *   revoked_at:
 *     type: string
 *     title: revoked_at
 *     description: The date the API key was revoked.
 *     format: date-time
 * 
*/

