/**
 * @schema AdminCreateCampaign
 * type: object
 * description: The promotion's campaign.
 * x-schemaName: AdminCreateCampaign
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The campaign's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The campaign's description.
 *   currency:
 *     type: string
 *     title: currency
 *     description: The campaign's currency.
 *   campaign_identifier:
 *     type: string
 *     title: campaign_identifier
 *     description: The campaign's campaign identifier.
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
 *   budget:
 *     type: object
 *     description: The campaign's budget.
 *     properties:
 *       type:
 *         type: string
 *         description: The budget's type.
 *         enum:
 *           - spend
 *           - usage
 *       currency_code:
 *         type: string
 *         title: currency_code
 *         description: The budget's currency code.
 *       limit:
 *         type: number
 *         title: limit
 *         description: The budget's limit.
 * 
*/

