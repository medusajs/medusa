/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Publishable API Key API Routes](https://docs.medusajs.com/api/admin#publishable-api-keys).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Publishable API Keys can be used to scope Store API calls with an API key, determining what resources are retrieved when querying the API.
 * For example, a publishable API key can be associated with one or more sales channels.
 *
 * When it is passed in the header of a request to the List Product store API Route,
 * the sales channels are inferred from the key and only products associated with those sales channels are retrieved.
 *
 * Admins can manage publishable API keys and their associated resources. Currently, only Sales Channels are supported as a resource.
 *
 * Related Guide: [How to manage publishable API keys](https://docs.medusajs.com/development/publishable-api-keys/admin/manage-publishable-api-keys).
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 */

export * from "./queries"
export * from "./mutations"
