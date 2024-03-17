/**
 * @packageDocumentation
 *
 * Queries and Mutations listed here are used to send requests to the [Admin Stock Location API Routes](https://docs.medusajs.com/api/admin#stock-locations).
 * To use these hooks, make sure to install the
 * [@medusajs/stock-location](https://docs.medusajs.com/modules/multiwarehouse/install-modules#stock-location-module) module in your Medusa backend.
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * A stock location, provided by the [Stock Location module](https://docs.medusajs.com/modules/multiwarehouse/stock-location-module),
 * indicates a physical address that stock-kept items, such as physical products, can be stored in.
 * An admin can create and manage available stock locations.
 *
 * Related Guide: [How to manage stock locations](https://docs.medusajs.com/modules/multiwarehouse/admin/manage-stock-locations).
 *
 * @customNamespace Hooks.Admin.Stock Locations
 */

export * from "./queries"
export * from "./mutations"
