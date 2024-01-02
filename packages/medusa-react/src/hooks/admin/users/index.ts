/**
 * @packageDocumentation
 * 
 * Queries and Mutations listed here are used to send requests to the [Admin User API Routes](https://docs.medusajs.com/api/admin#users).
 * 
 * All hooks listed require {@link useAdminLogin | user authentication}.
 * 
 * A store can have more than one user, each having the same privileges. Admins can manage users, their passwords, and more.
 * 
 * Related Guide: [How to manage users](https://docs.medusajs.com/modules/users/admin/manage-users).
 * 
 * @namespaceAsCategory Hooks.Admin.Users
 */

export * from "./queries"
export * from "./mutations"
