import { omit, pickBy } from "lodash"
import { isDefined } from "medusa-core-utils"
import { AdminCustomersListRes } from "../../api"
import { AdminGetCustomersParams } from "../../api/routes/admin/customers"
import { Customer } from "../../models/customer"
import { CustomerService } from "../../services"
import { FindConfig } from "../../types/common"
import { validator } from "../../utils/validator"

const listAndCount = async (
  scope,
  query,
  body
): Promise<AdminCustomersListRes> => {
  const validatedQueryParams = await validator(AdminGetCustomersParams, query)

  const customerService: CustomerService = scope.resolve("customerService")

  let expandFields: string[] = []
  if (validatedQueryParams.expand) {
    expandFields = validatedQueryParams.expand.split(",")
  }

  let orderBy: { [key: string]: "ASC" | "DESC" } | undefined = undefined
  if (validatedQueryParams.order) {
    const order = validatedQueryParams.order
    const direction = order.startsWith("-") ? "DESC" : "ASC"
    const field = order.replace(/^-/, "")
    orderBy = {
      [field]: direction,
    }
  }

  const listConfig: FindConfig<Customer> = {
    relations: expandFields,
    skip: validatedQueryParams.offset,
    take: validatedQueryParams.limit,
    order: orderBy,
  }

  const filterableFields = omit(validatedQueryParams, [
    "limit",
    "offset",
    "expand",
    "fields",
    "order",
  ])

  const [customers, count] = await customerService.listAndCount(
    pickBy(filterableFields, (val) => isDefined(val)),
    listConfig
  )

  return {
    customers,
    count,
    offset: validatedQueryParams.offset,
    limit: validatedQueryParams.limit,
  }
}

export default listAndCount
