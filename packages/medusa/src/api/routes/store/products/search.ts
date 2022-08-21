import { IsNumber, IsOptional, IsString } from "class-validator"

import ProductService from "../../../../services/product"
import { SearchService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products/search
 * operationId: GetProductsSearch
 * summary: Search Products
 * description: "Run a search query on products using the search engine installed on Medusa"
 * parameters:
 *   - (query) q=* {string} The query to run the search with.
 *   - (query) offset {integer} How many products to skip in the result.
 *   - (query) limit {integer} Limit the number of products returned.
 *   - (query) filter {} Filter based on the search engine.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             hits:
 *               type: array
 *               description: Array of results. The format of the items depends on the search engine installed on the server.
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
