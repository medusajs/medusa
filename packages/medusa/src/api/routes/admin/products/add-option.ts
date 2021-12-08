import { IsString } from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { ProductService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /products/{id}/options
 * operationId: "PostProductsProductOptions"
 * summary: "Add an Option"
 * x-authenticated: true
 * description: "Adds a Product Option to a Product"
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - title
 *         properties:
 *           title:
 *             description: "The title the Product Option will be identified by i.e. \"Size\""
 *             type: string
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminPostProductsProductOptionsReq,
    req.body
  )

  const productService: ProductService = req.scope.resolve("productService")

  await productService.addOption(id, validated.title)
  const product = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({ product })
}

class AdminPostProductsProductOptionsReq {
  @IsString()
  title: string
}
