import { MedusaError, Validator } from "medusa-core-utils"

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
  const schema = Validator.object().keys({
    limit: Validator.number().optional().default(10),
    offset: Validator.number().optional().default(0),
    created_at: Validator.date().optional(),
    updated_at: Validator.date().optional(),
    product_id: Validator.string().optional(),
    email: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.query)

  if (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error.details.join(", ")
    )
  }

  console.log(value)

  const { limit, offset, ...filterableFields } = value

  const productReviewService = req.scope.resolve("productReviewService")

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
