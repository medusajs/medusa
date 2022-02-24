import { IsString } from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /products/{id}/metadata
 * operationId: "PostProductsProductMetadata"
 * summary: "Set Product metadata"
 * description: "Set metadata key/value pair for Product"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - key
 *           - value
 *         properties:
 *           key:
 *             description: The metadata key
 *             type: string
 *           value:
 *             description: The metadata value
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
export default async (req: Request, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminPostProductsProductMetadataReq,
    req.body
  )

  const productService = req.scope.resolve("productService")
  await productService.update(id, {
    metadata: { [validated.key]: validated.value },
  })

  const product = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.status(200).json({ product })
}

export class AdminPostProductsProductMetadataReq {
  @IsString()
  key: string

  @IsString()
  value: string
}
