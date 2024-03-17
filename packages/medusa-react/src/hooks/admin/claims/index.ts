/**
 * @packageDocumentation
 *
 * Mutations listed here are used to send requests to the [Admin Order API Routes related to claims](https://docs.medusajs.com/api/admin#orders).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A claim represents a return or replacement request of order items. It allows refunding the customer or replacing some or all of its
 * order items with new items.
 *
 * Related Guide: [How to manage claims](https://docs.medusajs.com/modules/orders/admin/manage-claims).
 *
 * @customNamespace Hooks.Admin.Claims
 */

export * from "./mutations"
