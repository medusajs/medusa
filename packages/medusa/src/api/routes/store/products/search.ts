import { IsNumber, IsOptional, IsString } from "class-validator"

import ProductService from "../../../../services/product"
import { SearchService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /store/products/search
 * operationId: PostProductsSearch
 * summary: Search Products
 * description: "Run a search query on products using the search service installed on the Medusa backend. The searching is handled through the search service, so the returned data's
 *  format depends on the search service you're using."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostSearchReq"
 * x-codegen:
 *   method: search
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.products.search({
 *         q: "Shirt"
 *       })
 *       .then(({ hits }) => {
 *         console.log(hits.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/products/search' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "q": "Shirt"
 *       }'
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StorePostSearchRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  // As we want to allow wildcards, we pass a config allowing this
  const validated = await validator(StorePostSearchReq, req.body, {
    whitelist: false,
    forbidNonWhitelisted: false,
  })

  const { q, offset, limit, filter, ...options } = validated

  const paginationOptions = { offset, limit }

  const searchService: SearchService = req.scope.resolve("searchService")

  const results = await searchService.search(ProductService.IndexName, q, {
    paginationOptions,
    filter,
    additionalOptions: options,
  })

  res.status(200).send(results)
}

/**
 * @schema StorePostSearchReq
 * type: object
 * properties:
 *  q:
 *    type: string
 *    description: The search query.
 *  offset:
 *    type: number
 *    description: The number of products to skip when retrieving the products.
 *  limit:
 *    type: number
 *    description: Limit the number of products returned.
 *  filter:
 *    description: Pass filters based on the search service.
 */
export class StorePostSearchReq {
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  filter?: unknown
}
