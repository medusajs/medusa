import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { ProductService, ProductVariantService } from "../../../../services"

/**
 * @oas [delete] /products/{id}/variants/{variant_id}
 * operationId: "DeleteProductsProductVariantsVariant"
 * summary: "Delete a Product Variant"
 * description: "Deletes a Product Variant."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (path) variant_id=* {string} The id of the Product Variant.
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
 *               description: The id of the deleted Product Variant.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */
export default async (req, res) => {
  const { id, variant_id } = req.params

  const productVariantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )
  const productService: ProductService = req.scope.resolve("productService")

  await productVariantService.delete(variant_id)

  const data = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({
    variant_id,
    object: "product-variant",
    deleted: true,
    product: data,
  })
}
