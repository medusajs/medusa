import { defaultRelations, defaultFields } from "."

/**
 * @oas [delete] /products/{id}/options/{option_id}
 * operationId: "DeleteProductsProductOptionsOption"
 * summary: "Delete a Product Option"
 * description: "Deletes a Product Option. Before a Product Option can be deleted all Option Values for the Product Option must be the same. You may, for example, have to delete some of your variants prior to deleting the Product Option"
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (path) option_id=* {string} The id of the Product Option.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted Product Option
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { id, option_id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.deleteOption(id, option_id)
    const data = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({
      option_id,
      object: "option",
      deleted: true,
      product: data,
    })
  } catch (err) {
    throw err
  }
}
