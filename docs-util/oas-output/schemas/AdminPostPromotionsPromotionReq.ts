/**
 * @schema AdminPostPromotionsPromotionReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostPromotionsPromotionReq
 * properties:
 *   code:
 *     type: string
 *     title: code
 *     description: The promotion's code.
 *   is_automatic:
 *     type: boolean
 *     title: is_automatic
 *     description: The promotion's is automatic.
 *   type:
 *     type: string
 *     enum:
 *       - standard
 *       - buyget
 *   campaign_id:
 *     type: string
 *     title: campaign_id
 *     description: The promotion's campaign id.
 *   campaign:
 *     $ref: "#/components/schemas/AdminPostCampaignsReq"
 *   application_method:
 *     $ref: "#/components/schemas/ApplicationMethodsMethodPostReq"
 *   rules:
 *     type: array
 *     description: The promotion's rules.
 *     items:
 *       type: object
 *       description: The rule's rules.
 *       x-schemaName: PromotionRule
 *       required:
 *         - operator
 *         - attribute
 *         - values
 *       properties:
 *         operator:
 *           type: string
 *           enum:
 *             - gte
 *             - lte
 *             - gt
 *             - lt
 *             - eq
 *             - ne
 *             - in
 *         description:
 *           type: string
 *           title: description
 *           description: The rule's description.
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The rule's attribute.
 *         values:
 *           type: array
 *           description: The rule's values.
 *           items:
 *             type: string
 *             title: values
 *             description: The value's values.
 * 
*/

