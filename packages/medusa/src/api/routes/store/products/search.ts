import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { SearchService } from "../../../../services"
import ProductService from "../../../../services/product"
import { validator } from "../../../../utils/validator"

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
  filter?: any
}
