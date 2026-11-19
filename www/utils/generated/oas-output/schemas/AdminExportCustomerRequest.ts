/**
 * @schema AdminExportCustomerRequest
 * type: object
 * description: The details of the customer export.
 * x-schemaName: AdminExportCustomerRequest
 * properties:
 *   format:
 *     type: string
 *     description: The format of the exported file. Defaults to `json`.
 *     enum:
 *       - csv
 *       - json
 *   batch_size:
 *     oneOf:
 *       - type: string
 *         title: batch_size
 *         description: The number of customers to retrieve in each batch while generating the export.
 *       - type: number
 *         title: batch_size
 *         description: The number of customers to retrieve in each batch while generating the export.
 * 
*/

