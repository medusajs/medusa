import { defaultFields, defaultRelations } from "."

/**
 * @oas [get] /collections
 * operationId: "GetCollections"
 * summary: "List Product Collections"
 * description: "Retrieve a list of Product Collection."
 * tags:
 *   - Collection
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            collection:
 *              $ref: "#/components/schemas/product_collection"
 */
export default async (req, res) => {
  try {
    const selector = {}

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )

    const listConfig = {
      select: defaultFields,
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    const collections = await productCollectionService.list(
      selector,
      listConfig
    )

    res.status(200).json({ collections })
  } catch (err) {
    throw err
  }
}
