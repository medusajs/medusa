import { ArrayNotEmpty, IsString } from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { ProductService, ProductVariantService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /products/{id}/variants/{variant_id}/prices/bulk
 * operationId: "AdminDeletePricesFromProductVariant"
 * summary: "Delete a Product Variant"
 * description: "Deletes a Product Variant."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (path) variant_id=* {string} The id of the Product Variant.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           price_ids:
 *             description: The ids of the Product Variant Prices to delete.
 *             type: array
 *             items:
 *               type: string
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

  const validated = await validator(
    AdminDeletePricesFromProductVariantReq,
    req.body
  )

  await productVariantService.deleteVariantPrices(
    variant_id,
    validated.price_ids
  )

  const data = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({
    price_ids: req.body.price_ids,
    object: "product-variant-price",
    deleted: true,
    product: data,
  })
}

export class AdminDeletePricesFromProductVariantReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  price_ids: string[]
}
