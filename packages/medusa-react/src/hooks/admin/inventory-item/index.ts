/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Inventory Item API Routes](https://docs.medusajs.com/api/admin#inventory-items).
 * To use these hooks, make sure to install the
 * [@medusajs/inventory](https://docs.medusajs.com/modules/multiwarehouse/install-modules#inventory-module) module in your Medusa backend.
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Inventory items, provided by the [Inventory Module](https://docs.medusajs.com/modules/multiwarehouse/inventory-module), can be
 * used to manage the inventory of saleable items in your store.
 *
 * Related Guide: [How to manage inventory items](https://docs.medusajs.com/modules/multiwarehouse/admin/manage-inventory-items).
 *
 * @customNamespace Hooks.Admin.Inventory Items
 */

export * from "./queries"
export * from "./mutations"
