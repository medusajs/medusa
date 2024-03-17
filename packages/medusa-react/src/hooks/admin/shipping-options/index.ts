/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Shipping Option API Routes](https://docs.medusajs.com/api/admin#shipping-options).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A shipping option is used to define the available shipping methods during checkout or when creating a return.
 * Admins can create an unlimited number of shipping options, each associated with a shipping profile and fulfillment provider, among other resources.
 *
 * Related Guide: [Shipping Option architecture](https://docs.medusajs.com/modules/carts-and-checkout/shipping#shipping-option).
 *
 * @customNamespace Hooks.Admin.Shipping Options
 */

export * from "./queries"
export * from "./mutations"
