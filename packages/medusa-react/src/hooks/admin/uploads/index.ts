/**
 * @packageDocumentation
 *
 * Mutations listed here are used to send requests to the [Admin Upload API Routes](https://docs.medusajs.com/api/admin#uploads).
 *
 * All hooks listed require {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 *
 * The methods in this class are used to upload any type of resources. For example, they can be used to upload CSV files that are used to import products into the store.
 *
 * Related Guide: [How to upload CSV file when importing a product](https://docs.medusajs.com/modules/products/admin/import-products#1-upload-csv-file).
 *
 * @customNamespace Hooks.Admin.Uploads
 */

export * from "./mutations"
