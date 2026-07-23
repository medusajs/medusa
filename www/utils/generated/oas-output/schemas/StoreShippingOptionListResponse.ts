/**
 * @schema StoreShippingOptionListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: StoreShippingOptionListResponse
 * required:
 *   - shipping_options
 * properties:
 *   shipping_options:
 *     type: array
 *     description: The shipping option's shipping options.
 *     items:
 *       allOf:
 *         - $ref: "#/components/schemas/StoreCartShippingOption"
 *         - type: object
 *           description: The shipping option's shipping options.
 *           required:
 *             - service_zone
 *           properties:
 *             service_zone:
 *               type: object
 *               description: The shipping option's service zone.
 *               required:
 *                 - id
 *                 - fulfillment_set_id
 *                 - fulfillment_set
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The service zone's ID.
 *                 fulfillment_set_id:
 *                   type: string
 *                   title: fulfillment_set_id
 *                   description: The service zone's fulfillment set id.
 *                 fulfillment_set:
 *                   type: object
 *                   description: The service zone's fulfillment set.
 *                   required:
 *                     - id
 *                     - type
 *                     - location
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The fulfillment set's ID.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: The fulfillment set's type.
 *                     location:
 *                       type: object
 *                       description: The fulfillment set's location.
 *                       required:
 *                         - id
 *                         - address
 *                       properties:
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: The location's ID.
 *                         address:
 *                           $ref: "#/components/schemas/StoreFulfillmentAddress"
 * 
*/

