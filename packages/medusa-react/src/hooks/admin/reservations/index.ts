/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Reservation API Routes](https://docs.medusajs.com/api/admin#reservations).
 * To use these hooks, make sure to install the
 * [@medusajs/inventory](https://docs.medusajs.com/modules/multiwarehouse/install-modules#inventory-module) module in your Medusa backend.
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * Reservations, provided by the [Inventory Module](https://docs.medusajs.com/modules/multiwarehouse/inventory-module),
 * are quantities of an item that are reserved, typically when an order is placed but not yet fulfilled.
 * Reservations can be associated with any resources, but commonly with line items of an order.
 *
 * Related Guide: [How to manage item allocations in orders](https://docs.medusajs.com/modules/multiwarehouse/admin/manage-item-allocations-in-orders).
 *
 * @customNamespace Hooks.Admin.Reservations
 */

export * from "./mutations"
export * from "./queries"
