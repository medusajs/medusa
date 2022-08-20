import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, ValidateNested } from "class-validator"
import ProductReviewService from "../../services/product-review"
import { validator } from "@medusajs/medusa/dist/utils/validator"
import { DateComparisonOperator } from "@medusajs/medusa/dist/types/common"

/**
 * @oas [get] /reviews
 * operationId: "GetProductReviews"
 * summary: "List Customer Product Reviews"
 * description: "Retrieve a list of Customer Product Reviews."
 * parameters:
 *   - (query) offset=0 {integer} The number of product reviews to skip before starting to
 *   collect the product reviews set
 *   - (query) limit=10 {integer} The number of product reviews to return
 *   - (query) product_id=p_xyz {string} The id of product to return its reviews
 *   - (query) email=example@email.com {string} The email of the customer who created
 *   the product reviews to return its product reviews
 * tags:
 *   - ProductReview
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            reviews:
 *              $ref: "#/components/schemas/product_review"
 */
export default async (req, res) => {
  const validated = await validator(StoreGetProductReviewsParams, req.query)
  const { limit, offset, ...filterableFields } = validated

  const productReviewService: ProductReviewService = req.scope.resolve(
    "productReviewService"
  )

  const listConfig = {
    skip: offset,
    take: limit,
  }

  const [reviews, count] = await productReviewService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({ reviews, count, limit, offset })
}

export class StoreGetProductReviewsParams {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 10

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number = 0

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  @Type(() => String)
  product_id?: string

  @IsString()
  @IsOptional()
  @Type(() => String)
  email?: string
}
