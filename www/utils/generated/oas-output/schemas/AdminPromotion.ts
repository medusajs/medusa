/**
 * @schema AdminPromotion
 * type: object
 * description: The application method's promotion.
 * x-schemaName: AdminPromotion
 * properties:
 *   application_method:
 *     $ref: "#/components/schemas/AdminApplicationMethod"
 *   rules:
 *     type: array
 *     description: The promotion's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminPromotionRule"
 *   id:
 *     type: string
 *     title: id
 *     description: The promotion's ID.
 *   code:
 *     type: string
 *     title: code
 *     description: The promotion's code.
 *   type:
 *     oneOf:
 *       - type: string
 *         title: type
 *         description: The promotion's type.
 *       - type: string
 *         title: type
 *         description: The promotion's type.
 *   is_automatic:
 *     type: boolean
 *     title: is_automatic
 *     description: The promotion's is automatic.
 *   campaign_id:
 *     type: string
 *     title: campaign_id
 *     description: The promotion's campaign id.
 *   campaign:
 *     $ref: "#/components/schemas/AdminCampaign"
 * required:
 *   - id
 * 
*/

