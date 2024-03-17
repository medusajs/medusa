/**
 * @packageDocumentation
 *
 * Queries and mutations listed here are used to send requests to the [Admin Auth API Routes](https://docs.medusajs.com/api/admin#auth_getauth).
 *
 * They allow admin users to manage their session, such as login or log out.
 * You can send authenticated requests for an admin user either using the Cookie header, their API token, or the JWT Token.
 * When you log the admin user in using the {@link Hooks.Admin.Auth.useAdminLogin | user authentication} hook, Medusa React will automatically attach the
 * cookie header in all subsequent requests.
 *
 * Related Guide: [How to implement user profiles](https://docs.medusajs.com/modules/users/admin/manage-profile).
 *
 * @customNamespace Hooks.Admin.Auth
 */

export * from "./queries"
export * from "./mutations"
