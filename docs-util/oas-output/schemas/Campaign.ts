/**
 * @schema Campaign
 * type: object
 * description: The campaign's details.
 * x-schemaName: Campaign
 * required:
 *   - id
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
 *     $ref: "#/components/schemas/CampaignBudget"
 * 
*/

