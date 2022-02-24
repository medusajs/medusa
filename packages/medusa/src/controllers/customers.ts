import { omit, pickBy } from "lodash"
import { AdminGetCustomersParams, Customer } from ".."
import { CustomerService } from "../services"
import { FindConfig } from "../types/common"

const listAndCount = async (
  customerService: CustomerService,
  queryparams: AdminGetCustomersParams
): Promise<any> => {
  let expandFields: string[] = []
  if (queryparams.expand) {
    expandFields = queryparams.expand.split(",")
  }

  const listConfig: FindConfig<Customer> = {
    relations: expandFields,
    skip: queryparams.offset,
    take: queryparams.limit,
  }

  const filterableFields = omit(queryparams, ["limit", "offset", "expand"])

  return await customerService.listAndCount(
    pickBy(filterableFields, (val) => typeof val !== "undefined"),
    listConfig
  )
}

export default { listAndCount }
