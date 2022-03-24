import { AwilixContainer } from "awilix"
import { AdminProductsListRes } from "../../api"
import { pickBy, omit } from "lodash"
import { MedusaError } from "medusa-core-utils"
import { Product } from "../../models/product"
import { ProductService } from "../../services"
import { FindConfig } from "../../types/common"
import { FilterableProductProps } from "../../types/product"

type ListContext = {
  limit: number
  offset: number
  order?: string
  fields?: string
  expand?: string
  allowedFields?: string[]
  defaultFields?: string[]
  defaultRelations?: string[]
}

const listAndCount = async (
  scope: AwilixContainer,
  query: FilterableProductProps,
  body?: object,
  context: ListContext = { limit: 50, offset: 0 }
): Promise<AdminProductsListRes> => {
  const { limit, offset, allowedFields, defaultFields, defaultRelations } =
    context

  const productService: ProductService = scope.resolve("productService")

  let includeFields: string[] = []
  if (context.fields) {
    includeFields = context.fields.split(",")
  }

  let expandFields: string[] = []
  if (context.expand) {
    expandFields = context.expand.split(",")
  }

  const listConfig: FindConfig<Product> = {
    select: (includeFields.length
      ? includeFields
      : defaultFields) as (keyof Product)[],
    relations: expandFields.length ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
  }

  if (typeof context.order !== "undefined") {
    let orderField = context.order
    if (context.order.startsWith("-")) {
      const [, field] = context.order.split("-")
      orderField = field
      listConfig.order = { [field]: "DESC" }
    } else {
      listConfig.order = { [context.order]: "ASC" }
    }

    if (!(allowedFields || []).includes(orderField)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order field must be a valid product field"
      )
    }
  }

  const filterableFields: FilterableProductProps = omit(query, [
    "limit",
    "offset",
    "expand",
    "fields",
    "order",
  ])

  const [products, count] = await productService.listAndCount(
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )

  return {
    products,
    count,
    offset,
    limit,
  }
}

export default listAndCount
