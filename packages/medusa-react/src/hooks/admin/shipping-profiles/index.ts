/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Shipping Profile API Routes](https://docs.medusajs.com/api/admin#shipping-profiles).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A shipping profile is used to group products that can be shipped in the same manner.
 * They are created by the admin and they're not associated with a fulfillment provider.
 *
 * Related Guide: [Shipping Profile architecture](https://docs.medusajs.com/modules/carts-and-checkout/shipping#shipping-profile).
 *
 * @customNamespace Hooks.Admin.Shipping Profiles
 */

export * from "./queries"
export * from "./mutations"
