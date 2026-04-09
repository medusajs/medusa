/**
 * @schema AdminCreateStoreCreditAccount
 * type: object
 * description: The details of the store credit account to create.
 * x-schemaName: AdminCreateStoreCreditAccount
 * required:
 *   - currency_code
 * properties:
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The store credit account's currency code.
 *     example: usd
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that the store credit account belongs to.
 *   metadata:
 *     type: object
 *     description: The store credit account's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 * 
*/

