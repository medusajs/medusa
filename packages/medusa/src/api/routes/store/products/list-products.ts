import { Type } from "class-transformer"
import { IsBoolean, IsInt, IsNumber, IsOptional } from "class-validator"
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

  const selector = {}

  if (validated.is_giftcard && validated.is_giftcard === true) {
    selector["is_giftcard"] = validated.is_giftcard
  }

  selector["status"] = ["published"]

  const listConfig = {
    relations: defaultStoreProductsRelations,
    skip: validated.offset,
    take: validated.limit,
  }

  const [products, count] = await productService.listAndCount(
    selector,
    listConfig
  )

  res.json({
    products,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class StoreGetProductsParams {
  @IsInt()
  @Type(() => Number)
  limit = 100

  @IsInt()
  @Type(() => Number)
  offset = 0

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_giftcard?: boolean
}
