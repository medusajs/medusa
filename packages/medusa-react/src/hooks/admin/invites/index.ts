/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Invite API Routes](https://docs.medusajs.com/api/admin#invites).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * An admin can invite new users to manage their team. This would allow new users to authenticate as admins and perform admin functionalities.
 *
 * Related Guide: [How to manage invites](https://docs.medusajs.com/modules/users/admin/manage-invites).
 *
 * @customNamespace Hooks.Admin.Invites
 */

export * from "./queries"
export * from "./mutations"
