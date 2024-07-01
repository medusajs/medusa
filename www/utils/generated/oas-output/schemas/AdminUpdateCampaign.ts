/**
 * @schema AdminUpdateCampaign
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminUpdateCampaign
 * required:
 *   - description
 *   - starts_at
 *   - ends_at
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The campaign's name.
 *   campaign_identifier:
 *     type: string
 *     title: campaign_identifier
 *     description: The campaign's campaign identifier.
 *   description:
 *     type: string
 *     title: description
 *     description: The campaign's description.
 *   budget:
 *     type: object
 *     description: The campaign's budget.
 *     properties:
 *       limit:
 *         type: number
 *         title: limit
 *         description: The budget's limit.
 *   starts_at:
 *     type: string
 *     title: starts_at
 *     description: The campaign's starts at.
 *     format: date-time
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The campaign's ends at.
 *     format: date-time
 *   promotions:
 *     type: array
 *     description: The campaign's promotions.
 *     items:
 *       type: object
 *       description: The promotion's promotions.
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The promotion's ID.
 * 
*/

