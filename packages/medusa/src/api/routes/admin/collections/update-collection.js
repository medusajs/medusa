import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /collections/{id}
 * operationId: "PostCollectionsCollection"
 * summary: "Update a Product Collection"
 * description: "Updates a Product Collection."
 * parameters:
 *   - (path) id=* {string} The id of the Collection.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           title:
 *             type: string
 *             description:  The title to identify the Collection by.
 *           handle:
 *             type: string
 *             description:  An optional handle to be used in slugs, if none is provided we will kebab-case the title.
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
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
  const { id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().optional(),
    handle: Validator.string().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const productCollectionService = req.scope.resolve(
      "productCollectionService"
    )

    const updated = await productCollectionService.update(id, value)
    const collection = await productCollectionService.retrieve(updated.id)

    res.status(200).json({ collection })
  } catch (err) {
    throw err
  }
}
