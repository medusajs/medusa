/**
 * @schema AdminExportInventoryItemResponse
 * type: object
 * description: The response for initiating an export inventory items workflow.
 * x-schemaName: AdminExportInventoryItemResponse
 * required:
 *   - transaction_id
 * properties:
 *   transaction_id:
 *     type: string
 *     title: transaction_id
 *     description: The ID of the workflow execution's transaction. Use it to check the status of the export by sending a GET request to `/admin/workflows-executions/export-inventory-items/:transaction-id`
 * 
*/

