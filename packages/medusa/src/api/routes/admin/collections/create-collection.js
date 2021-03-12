import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /collections
 * operationId: "PostCollections"
 * summary: "Create a Product Collection"
 * description: "Creates a Product Collection."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - title
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
  const schema = Validator.object().keys({
    title: Validator.string().required(),
    handle: Validator.string()
      .optional()
      .allow(""),
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

    const created = await productCollectionService.create(value)
    const collection = await productCollectionService.retrieve(created.id)

    res.status(200).json({ collection })
  } catch (err) {
    throw err
  }
}
