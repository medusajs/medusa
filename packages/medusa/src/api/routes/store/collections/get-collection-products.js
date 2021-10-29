import { MedusaError, Validator } from "medusa-core-utils"
import { productFields, productRelations } from "."

/**
 * @oas [get] /collections/{id}/products
 * operationId: GetCollectionsProducts
 * summary: Retrieves all Products of a Collection
 * description: "Retrieves all Products of a Collection."
 * parameters:
 *   - (path) id=* {string} The id of the Collection.
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *     description: The maximum amount of Products to retrieve.
 *     default: 20
 *   - in: query
 *     name: offset
 *     schema:
 *       type: integer
 *     description: The index to begin retrieving Products from.
 *     default: 0
 *   - in: query
 *     name: q
 *     schema:
 *       type: string
 *     description: Query on title, subtitle, handle, variant title, variant sku of a Collections' Products.
 *     name: tags
 *     schema:
 *       type: array
 *       items: string
 *     explode: false
 *     description: Only Products of a Collection with the specified Tag ids are included.
 *   - in: query
 *     name: order
 *     schema:
 *        type: string
 *     description: Order result based on either title or created_at / updated_at. Prefix '-' to indicate DESC.
 *     default: title
 * tags:
 *   - Collection
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of Products.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Products to return,
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object({
    limit: Validator.number().default(20),
    offset: Validator.number().default(0),
    q: Validator.string(),
    tags: Validator.array().items(Validator.string()),
    order: Validator.string()
      .valid(
        "title",
        "-title",
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at"
      )
      .default("title"),
  })

  const { value, error } = schema.validate(req.query)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const productService = req.scope.resolve("productService")

  const selector = {}

  selector.collection_id = id

  selector.status = ["published"]

  if ("q" in value) {
    selector.q = value.q
  }

  if ("tags" in value) {
    selector.tags = value.tags
  }

  const listConfig = {
    relations: productRelations,
    fields: productFields,
    skip: value.offset,
    take: value.limit,
  }

  // We use a prefix of '-' to indicate a descending order type.
  const order = value.order
  listConfig.order = {
    [order.replace("-", "")]: order[0] === "-" ? "DESC" : "ASC",
  }

  const products = await productService.list(selector, listConfig)

  res.json({
    products,
    count: products.length,
    offset: value.offset,
    limit: value.limit,
  })
}
