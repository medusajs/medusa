/**
 * @schema AdminGiftCard
 * type: object
 * description: The gift card's details.
 * x-schemaName: AdminGiftCard
 * required:
 *   - line_item
 *   - customer
 *   - id
 *   - customer_id
 *   - currency_code
 *   - status
 *   - created_at
 *   - updated_at
 *   - reference
 *   - reference_id
 *   - value
 *   - code
 *   - note
 *   - expires_at
 * properties:
 *   line_item:
 *     $ref: "#/components/schemas/AdminOrderLineItem"
 *   customer:
 *     $ref: "#/components/schemas/AdminCustomer"
 *   id:
 *     type: string
 *     title: id
 *     description: The gift card's ID.
 *   code:
 *     type: string
 *     title: code
 *     description: The gift card's code.
 *   status:
 *     type: string
 *     description: The gift card's status.
 *     enum:
 *       - pending
 *       - redeemed
 *   value:
 *     type: number
 *     title: value
 *     description: The gift card's amount.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The gift card's currency code.
 *     example: usd
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer associated with the gift card.
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The gift card's reference ID.
 *   note:
 *     type: string
 *     title: note
 *     description: The gift card's note.
 *   reference:
 *     type: string
 *     title: reference
 *     description: The gift card's reference.
 *   expires_at:
 *     type: string
 *     title: expires_at
 *     description: The date the gift card expires at.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the gift card was created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the gift card was updated at.
 * 
*/

