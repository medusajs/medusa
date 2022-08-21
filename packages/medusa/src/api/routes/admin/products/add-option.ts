import { PricingService, ProductService } from "../../../../services"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."

import { IsString } from "class-validator"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /products/{id}/options
 * operationId: "PostProductsProductOptions"
 * summary: "Add an Option"
 * x-authenticated: true
 * description: "Adds a Product Option to a Product"
 * parameters:
 *   - (path) id=* {string} The ID of the Product.
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
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await productService
      .withTransaction(transactionManager)
      .addOption(id, validated.title)
  })

  const rawProduct = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  const [product] = await pricingService.setProductPrices([rawProduct])

  res.json({ product })
}

export class AdminPostProductsProductOptionsReq {
  @IsString()
  title: string
}
