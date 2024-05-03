/**
 * @schema CreatePromotion
 * type: object
 * description: SUMMARY
 * x-schemaName: CreatePromotion
 * required:
 *   - code
 *   - type
 * properties:
 *   code:
 *     type: string
 *     title: code
 *     description: The promotion's code.
 *   type:
 *     type: string
 *     enum:
 *       - standard
 *       - buyget
 *   is_automatic:
 *     type: boolean
 *     title: is_automatic
 *     description: The promotion's is automatic.
 *   application_method:
 *     $ref: "#/components/schemas/CreateApplicationMethod"
 *   rules:
 *     type: array
 *     description: The promotion's rules.
 *     items:
 *       type: object
 *       description: The rule's rules.
 *       x-schemaName: CreatePromotionRule
 *       required:
 *         - attribute
 *         - operator
 *         - values
 *       properties:
 *         description:
 *           type: string
 *           title: description
 *           description: The rule's description.
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The rule's attribute.
 *         operator:
 *           type: string
 *           enum:
 *             - gt
 *             - lt
 *             - eq
 *             - ne
 *             - in
 *             - lte
 *             - gte
 *         values:
 *           oneOf:
 *             - type: string
 *               title: values
 *               description: The rule's values.
 *             - type: array
 *               description: The rule's values.
 *               items:
 *                 type: string
 *                 title: values
 *                 description: The value's values.
 *   campaign:
 *     $ref: "#/components/schemas/CreateCampaign"
 *   campaign_id:
 *     type: string
 *     title: campaign_id
 *     description: The promotion's campaign id.
 * 
*/

