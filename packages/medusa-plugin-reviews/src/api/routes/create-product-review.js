import { MedusaError, Validator } from "medusa-core-utils"

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
export default async (req, res) => {
  const schema = Validator.object().keys({
    product_id: Validator.string().required(),
    rating: Validator.number().required(),
    body: Validator.string().optional(),
    email: Validator.string().required(),
    name: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)

  if (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error.details.join(", ")
    )
  }

  console.log(value)

  const productReviewService = req.scope.resolve("productReviewService")

  const productReview = await productReviewService.create(value)
  res.status(200).json({ productReview })
}
