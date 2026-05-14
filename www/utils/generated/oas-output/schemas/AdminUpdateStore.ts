/**
 * @schema AdminUpdateStore
 * type: object
 * description: The properties to update in a store.
 * x-schemaName: AdminUpdateStore
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The store's name.
 *   supported_currencies:
 *     type: array
 *     description: The store's supported currencies.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateStoreSupportedCurrency"
 *   default_sales_channel_id:
 *     type: string
 *     title: default_sales_channel_id
 *     description: The ID of the default sales channel in the store.
 *   default_region_id:
 *     type: string
 *     title: default_region_id
 *     description: The ID of the default region in the store.
 *   default_location_id:
 *     type: string
 *     title: default_location_id
 *     description: The ID of the default stock location in the store.
 *   metadata:
 *     type: object
 *     description: The store's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   supported_locales:
 *     type: array
 *     description: The store's supported locales.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateStoreSupportedLocale"
 * 
*/

