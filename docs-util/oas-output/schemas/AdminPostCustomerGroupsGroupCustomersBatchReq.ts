/**
 * @schema AdminPostCustomerGroupsGroupCustomersBatchReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostCustomerGroupsGroupCustomersBatchReq
 * required:
 *   - customer_ids
 * properties:
 *   customer_ids:
 *     type: array
 *     description: The customer group's customer ids.
 *     items:
 *       type: object
 *       description: The customer id's customer ids.
 *       x-schemaName: CustomerGroupsBatchCustomer
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The customer id's ID.
 * 
*/

