import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { IsString } from "class-validator"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /products/{id}/metadata
 * operationId: "PostProductsProductMetadata"
 * summary: "Set Product metadata"
 * description: "Set metadata key/value pair for Product"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
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
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminPostProductsProductMetadataReq,
    req.body
  )

  const productService = req.scope.resolve("productService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService.withTransaction(transactionManager).update(id, {
      metadata: { [validated.key]: validated.value },
    })
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
