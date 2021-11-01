import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [get] /collections
 * operationId: GetCollections
 * summary: List Collections
 * description: "Retrieves a list of Collections."
 * parameters:
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *     description: The maximum amount of Collections to retrieve.
 *     default: 20
 *   - in: query
 *     name: offset
 *     schema:
 *       type: integer
 *     description: The index to begin retrieving Collections from.
 *     default: 0
 *   - in: query
 *     name: q
 *     schema:
 *       type: string
 *     description: Query based on title and handle of Collections.
 *   - in: query
 *     name: order
 *     schema:
 *        type: string
 *     description: Order result based on either title or created_at / updated_at. Prefix '-' to indicate DESC.
 *     default: title
 * tags:
 *   - Collection
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of Collections.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Collections to return.
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_collection"
 */
export default async (req, res) => {
  const schema = Validator.object({
    limit: Validator.number().default(20),
    offset: Validator.number().default(0),
    q: Validator.string(),
    tags: Validator.array().items(Validator.string()),
    order: Validator.string()
      .valid(
        "title",
        "-title",
        "handle",
        "-handle",
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

  const collectionService = req.scope.resolve("productCollectionService")

  const selector = {}

  if (value.q) {
    selector.q = value.q
  }

  const listConfig = {
    relations: [],
    skip: value.offset,
    take: value.limit,
  }

  // We use a prefix of '-' to indicate a descending order type.
  const order = value.order
  listConfig.order = {
    [order.replace("-", "")]: order[0] === "-" ? "DESC" : "ASC",
  }

  const collections = await collectionService.list(selector, listConfig)

  res.json({
    collections,
    count: collections.length,
    offset: value.offset,
    limit: value.limit,
  })
}
