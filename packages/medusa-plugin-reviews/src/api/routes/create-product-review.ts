import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import ProductReviewService from "../../services/product-review"
import { CreateProductReviewInput } from "../../types/product-review"
import { validator } from "@medusajs/medusa/dist/utils/validator"

/**
 * @oas [post] /reviews
 * operationId: "PostProductReviews"
 * summary: "Create a Customer Product Review"
 * description: "Creates a Customer Product Review."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - product_id
 *           - rating
 *           - email
 *         properties:
 *           product_id:
 *             type: string
 *             description:  The id to identify the product by.
 *           rating:
 *             type: number
 *             description:  The rating value from 1 to 5, describing the review.
 *           body:
 *             type: string
 *             description:  An optional body text to be as a description for the review.
 *           email:
 *             type: string
 *             description:  The email of the customer giving the review.
 *           name:
 *             type: string
 *             description:  The name of the customer giving the review.
 * tags:
 *   - ProductReview
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            review:
 *              $ref: "#/components/schemas/product_review"
 */
export default async (req: Request, res: Response) => {
  const validatedBody = await validator(StorePostProductReviewsReq, req)

  const productReviewService: ProductReviewService = req.scope.resolve(
    "productReviewService"
  )

  const productReview = await productReviewService.create(
    validatedBody as CreateProductReviewInput
  )
  res.status(200).json({ productReview })
}

export class StorePostProductReviewsReq {
  @IsString()
  @IsNotEmpty()
  product_id: string

  @IsInt()
  @IsNotEmpty()
  rating: number

  @IsString()
  @IsOptional()
  body?: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsOptional()
  name?: string
}
