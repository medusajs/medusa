import { AwilixContainer } from "awilix"
import { AdminProductsListRes } from "../../api"
import { pickBy } from "lodash"
import { MedusaError } from "medusa-core-utils"
import { Product } from "../../models/product"
import { ProductService } from "../../services"
import { getListConfig } from "../../utils/get-query-config"
import { FindConfig } from "../../types/common"
import { FilterableProductProps } from "../../types/product"

type ListContext = {
  limit: number
  offset: number
  order?: string
  fields?: string
  expand?: string
  allowedFields?: string[]
  defaultFields?: (keyof Product)[]
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
  let includeFields: (keyof Product)[] | undefined
  if (context.fields) {
    includeFields = context.fields.split(",") as (keyof Product)[]
  }

  let expandFields: string[] | undefined
  if (context.expand) {
    expandFields = context.expand.split(",")
  }

  let orderBy: { [k: symbol]: "DESC" | "ASC" } | undefined
  if (typeof context.order !== "undefined") {
    let orderField = context.order
    if (context.order.startsWith("-")) {
      const [, field] = context.order.split("-")
      orderField = field
      orderBy = { [field]: "DESC" }
    } else {
      orderBy = { [context.order]: "ASC" }
    }

    if (!(allowedFields || []).includes(orderField)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order field must be a valid product field"
      )
    }
  }

  const listConfig = getListConfig<Product>(
    defaultFields ?? [],
    defaultRelations ?? [],
    includeFields,
    expandFields,
    limit,
    offset,
    orderBy
  )

  const [products, count] = await productService.listAndCount(
    pickBy(query, (val) => typeof val !== "undefined"),
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
