import { omit, pickBy } from "lodash"
import { AdminGetCustomersParams } from "../../api/routes/admin/customers"
import { AdminCustomersListRes } from "../../api"
import { CustomerService } from "../../services"
import { FindConfig } from "../../types/common"
import { validator } from "../../utils/validator"
import { Customer } from "../../models/customer"
import { isDefined } from "medusa-core-utils"

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

  const listConfig: FindConfig<Customer> = {
    relations: expandFields,
    skip: validatedQueryParams.offset,
    take: validatedQueryParams.limit,
  }

  const filterableFields = omit(validatedQueryParams, [
    "limit",
    "offset",
    "expand",
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
