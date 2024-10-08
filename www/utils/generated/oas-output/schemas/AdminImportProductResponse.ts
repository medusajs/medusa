/**
 * @schema AdminImportProductResponse
 * type: object
 * description: The import process's details.
 * x-schemaName: AdminImportProductResponse
 * required:
 *   - transaction_id
 *   - summary
 * properties:
 *   transaction_id:
 *     type: string
 *     title: transaction_id
 *     description: The ID of the workflow execution's transaction. This is useful to confirm the import using the `/admin/products/:transaction-id/import` API route.
 *   summary:
 *     type: object
 *     description: The import's summary.
 *     required:
 *       - toCreate
 *       - toUpdate
 *     properties:
 *       toCreate:
 *         type: number
 *         title: toCreate
 *         description: The number of products that will be created by this import.
 *       toUpdate:
 *         type: number
 *         title: toUpdate
 *         description: The number of products that will be updated by this import.
 * 
*/

