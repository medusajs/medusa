/**
 * @schema AdminExportProductResponse
 * type: object
 * description: The details of the product export.
 * x-schemaName: AdminExportProductResponse
 * required:
 *   - transaction_id
 * properties:
 *   transaction_id:
 *     type: string
 *     title: transaction_id
 *     description: The ID of the workflow execution's transaction. Use it to check the status of the export by sending a GET request to `/admin/workflows-executions/export-products/:transaction-id`
 * 
*/

