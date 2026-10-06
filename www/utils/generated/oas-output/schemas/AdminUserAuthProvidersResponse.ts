/**
 * @schema AdminUserAuthProvidersResponse
 * type: object
 * description: The list of auth providers that a user can authenticate with. These represent the auth providers that the user has previously used to log in or register with the system.
 * x-schemaName: AdminUserAuthProvidersResponse
 * required:
 *   - providers
 * properties:
 *   providers:
 *     type: array
 *     description: |-
 *       The IDs of the auth providers the user can authenticate with, such as
 *       `emailpass`.
 *     items:
 *       type: string
 *       title: providers
 *       description: The provider's identifier.
 *       example: emailpass
 * 
*/

