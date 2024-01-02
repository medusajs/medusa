/**
 * @packageDocumentation
 * 
 * Queries and Mutations listed here are used to send requests to the [Admin Store API Routes](https://docs.medusajs.com/api/admin#store).
 * 
 * All hooks listed require {@link useAdminLogin | user authentication}.
 * 
 * A store indicates the general configurations and details about the commerce store. By default, there's only one store in the Medusa backend.
 * Admins can manage the store and its details or configurations.
 * 
 * @namespaceAsCategory Hooks.Admin.Stores
 */

export * from "./queries"
export * from "./mutations"
