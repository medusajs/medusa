/**
 * @schema AdminPromotion
 * type: object
 * description: The application method's promotion.
 * x-schemaName: AdminPromotion
 * required:
 *   - id
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
 *     type: string
 *     description: The promotion's type.
 *     enum:
 *       - standard
 *       - buyget
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
 * 
*/

