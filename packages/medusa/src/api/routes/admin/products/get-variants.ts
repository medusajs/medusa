import { ProductService } from "../../../../services"
import { defaultStoreProductsVariantsRelations } from "../../store/products"
import { validator } from "../../../../utils/validator"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"

/**
 * @oas [get] /products/{id}/variants
 * operationId: "GetProductsProductVariants"
 * summary: "List a Product's Product Variants"
 * description: "Retrieves a list of the Product Variants associated with a Product."
 * x-authenticated: true
 * parameters:
 *   - (query) id=* {string} Id of the product to search for.
 *   - (query) fields {string} Comma separated string of the column to select.
 *   - (query) expand {string} Comma separated string of the relations to include.
 *   - (query) offset {string} How many products to skip in the result.
 *   - (query) limit {string} Limit the number of products returned.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             variants:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_variant"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(StoreGetProductsVariantsParams, req.query)

  let includeFields: string[] = []
  if (validated.fields) {
    includeFields = [...new Set(validated.fields.split(",")), "id"]
  }

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = [...new Set([...validated.expand.split(",")])]
  }

  const listConfig = {
    select: includeFields.length ? includeFields : undefined,
    relations: expandFields.length
      ? [...new Set([...expandFields, ...defaultStoreProductsVariantsRelations])]
      : defaultStoreProductsVariantsRelations,
    skip: validated.offset,
    take: validated.limit,
    include_discount_prices: true,
  }

  const productService: ProductService = req.scope.resolve("productService")
  const variants = await productService.retrieveVariants(id, listConfig)

  res.json({ variants })
}

export class StoreGetProductsVariantsParams {
  @IsString()
  @IsOptional()
  fields?: string

  @IsString()
  @IsOptional()
  expand?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 100
}
