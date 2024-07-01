/**
 * @schema AdminProductVariantParams
 * type: object
 * description: The product's variants.
 * x-schemaName: AdminProductVariantParams
 * properties:
 *   q:
 *     type: string
 *     title: q
 *     description: The variant's q.
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The variant's ID.
 *       - type: array
 *         description: The variant's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   sku:
 *     oneOf:
 *       - type: string
 *         title: sku
 *         description: The variant's sku.
 *       - type: array
 *         description: The variant's sku.
 *         items:
 *           type: string
 *           title: sku
 *           description: The sku's details.
 *   product_id:
 *     oneOf:
 *       - type: string
 *         title: product_id
 *         description: The variant's product id.
 *       - type: array
 *         description: The variant's product id.
 *         items:
 *           type: string
 *           title: product_id
 *           description: The product id's details.
 *   options:
 *     type: object
 *     description: The variant's options.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The variant's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The variant's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The variant's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The variant's fields.
 *   $and:
 *     type: array
 *     description: The variant's $and.
 *     items:
 *       oneOf:
 *         - type: object
 *           description: The $and's details.
 *           x-schemaName: BaseProductVariantParams
 *           properties:
 *             q:
 *               type: string
 *               title: q
 *               description: The $and's q.
 *             id:
 *               oneOf:
 *                 - type: string
 *                   title: id
 *                   description: The $and's ID.
 *                 - type: array
 *                   description: The $and's ID.
 *                   items:
 *                     type: string
 *                     title: id
 *                     description: The id's ID.
 *             sku:
 *               oneOf:
 *                 - type: string
 *                   title: sku
 *                   description: The $and's sku.
 *                 - type: array
 *                   description: The $and's sku.
 *                   items:
 *                     type: string
 *                     title: sku
 *                     description: The sku's details.
 *             product_id:
 *               oneOf:
 *                 - type: string
 *                   title: product_id
 *                   description: The $and's product id.
 *                 - type: array
 *                   description: The $and's product id.
 *                   items:
 *                     type: string
 *                     title: product_id
 *                     description: The product id's details.
 *             options:
 *               type: object
 *               description: The $and's options.
 *             limit:
 *               type: number
 *               title: limit
 *               description: The $and's limit.
 *             offset:
 *               type: number
 *               title: offset
 *               description: The $and's offset.
 *             order:
 *               type: string
 *               title: order
 *               description: The $and's order.
 *             fields:
 *               type: string
 *               title: fields
 *               description: The $and's fields.
 *             $and:
 *               type: array
 *               description: The $and's details.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $and's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $and's details.
 *             $or:
 *               type: array
 *               description: The $and's $or.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $or's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $or's details.
 *         - type: object
 *           description: The $and's details.
 *           properties:
 *             $and:
 *               type: array
 *               description: The $and's details.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $and's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $and's details.
 *             $or:
 *               type: array
 *               description: The $and's $or.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $or's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $or's details.
 *   $or:
 *     type: array
 *     description: The variant's $or.
 *     items:
 *       oneOf:
 *         - type: object
 *           description: The $or's details.
 *           x-schemaName: BaseProductVariantParams
 *           properties:
 *             q:
 *               type: string
 *               title: q
 *               description: The $or's q.
 *             id:
 *               oneOf:
 *                 - type: string
 *                   title: id
 *                   description: The $or's ID.
 *                 - type: array
 *                   description: The $or's ID.
 *                   items:
 *                     type: string
 *                     title: id
 *                     description: The id's ID.
 *             sku:
 *               oneOf:
 *                 - type: string
 *                   title: sku
 *                   description: The $or's sku.
 *                 - type: array
 *                   description: The $or's sku.
 *                   items:
 *                     type: string
 *                     title: sku
 *                     description: The sku's details.
 *             product_id:
 *               oneOf:
 *                 - type: string
 *                   title: product_id
 *                   description: The $or's product id.
 *                 - type: array
 *                   description: The $or's product id.
 *                   items:
 *                     type: string
 *                     title: product_id
 *                     description: The product id's details.
 *             options:
 *               type: object
 *               description: The $or's options.
 *             limit:
 *               type: number
 *               title: limit
 *               description: The $or's limit.
 *             offset:
 *               type: number
 *               title: offset
 *               description: The $or's offset.
 *             order:
 *               type: string
 *               title: order
 *               description: The $or's order.
 *             fields:
 *               type: string
 *               title: fields
 *               description: The $or's fields.
 *             $and:
 *               type: array
 *               description: The $or's $and.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $and's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $and's details.
 *             $or:
 *               type: array
 *               description: The $or's details.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $or's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $or's details.
 *         - type: object
 *           description: The $or's details.
 *           properties:
 *             $and:
 *               type: array
 *               description: The $or's $and.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $and's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $and's details.
 *             $or:
 *               type: array
 *               description: The $or's details.
 *               items:
 *                 oneOf:
 *                   - type: object
 *                     description: The $or's details.
 *                     x-schemaName: BaseProductVariantParams
 *                   - type: object
 *                     description: The $or's details.
 * 
*/

