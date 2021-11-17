import { IsString } from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { ProductService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /products/{id}/options/{option_id}
 * operationId: "PostProductsProductOptionsOption"
 * summary: "Update a Product Option."
 * description: "Updates a Product Option"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (path) option_id=* {string} The id of the Product Option.
 * requestBody:
 *   content:
 *     application/json:
 *       required:
 *         - title
 *       schema:
 *         properties:
 *           title:
 *             description: "The title of the Product Option"
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
  const { id, option_id } = req.params

  const validated = await validator(
    AdminPostProductsProductOptionsOption,
    req.body
  )

  const productService: ProductService = req.scope.resolve("productService")

  await productService.updateOption(id, option_id, validated)

  const product = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({ product })
}

export class AdminPostProductsProductOptionsOption {
  @IsString()
  title: string
}
