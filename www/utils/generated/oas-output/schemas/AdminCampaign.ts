/**
 * @schema AdminCampaign
 * type: object
 * description: The campaign's details.
 * x-schemaName: AdminCampaign
 * required:
 *   - id
 *   - name
 *   - description
 *   - currency
 *   - campaign_identifier
 *   - starts_at
 *   - ends_at
 *   - budget
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The campaign's ID.
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
 *     description: The campaign's identifier.
 *   starts_at:
 *     type: string
 *     title: starts_at
 *     description: The date and time that the campaign starts.
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The date and time that the campaign ends.
 *   budget:
 *     type: object
 *     description: The campaign's budget.
 *     required:
 *       - id
 *       - type
 *       - currency_code
 *       - limit
 *       - used
 *     properties:
 *       id:
 *         type: string
 *         title: id
 *         description: The budget's ID.
 *       type:
 *         type: string
 *         description: >
 *           The budget's type. `spend` means the limit is set on the total amount discounted by the campaign's promotions; `usage` means the limit is set on the total number of times the campaign's
 *           promotions can be used.
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
 *       used:
 *         type: number
 *         title: used
 *         description: >
 *           How much of the budget has been used. If the limit is `spend`, this property holds the total amount discounted so far. If the limit is `usage`, it holds the number of times the campaign's
 *           promotions have been used so far.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the campaign was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the campaign was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the campaign was deleted.
 * 
*/

