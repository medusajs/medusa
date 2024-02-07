/**
 * @schema CampaignBudget
 * type: object
 * description: The campaign's budget.
 * x-schemaName: CampaignBudget
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The budget's ID.
 *   type:
 *     type: string
 *     enum:
 *       - spend
 *       - usage
 *   limit:
 *     type: number
 *     title: limit
 *     description: The budget's limit.
 *   used:
 *     type: number
 *     title: used
 *     description: The budget's used.
 * 
*/

