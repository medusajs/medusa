import { ProductService } from "../../../../services"

/**
 * @oas [get] /products/tag-usage
 * operationId: "GetProductsTagUsage"
 * summary: "List Product Tags Usage Number"
 * description: "Retrieves a list of Product Tags with how many times each is used."
 * x-authenticated: true
 * tags:
 *   - Product Tag
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             tags:
 *               type: array
 *               items:
 *                 properties:
 *                   id:
 *                     description: The ID of the tag.
 *                     type: string
 *                   usage_count:
 *                     description: The number of products that use this tag.
 *                     type: string
 *                   value:
 *                     description: The value of the tag.
 *                     type: string
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")

  const tags = await productService.listTagsByUsage()

  res.json({ tags })
}
