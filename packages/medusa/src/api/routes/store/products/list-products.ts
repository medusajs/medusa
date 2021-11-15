import { Type } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional } from "class-validator"
import { defaultStoreProductsRelations } from "."
import { ProductService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products
 * operationId: GetProducts
 * summary: List Products
 * description: "Retrieves a list of Products."
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of Products.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Products to return,
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")

  const validated = await validator(StoreGetProductsParams, req.query)

  const limit = validated.limit || 100
  const offset = validated.offset || 0

  const selector = {}

  if (validated.is_giftcard && validated.is_giftcard === true) {
    selector["is_giftcard"] = validated.is_giftcard
  }

  selector["status"] = ["published"]

  const listConfig = {
    relations: defaultStoreProductsRelations,
    skip: offset,
    take: limit,
  }

  const [products, count] = await productService.listAndCount(
    selector,
    listConfig
  )

  res.json({ products, count, offset, limit })
}

export class StoreGetProductsParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_giftcard?: boolean
}
