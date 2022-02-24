import { BaseService } from "medusa-interfaces"
import { AdminGetCustomersParams, Customer } from ".."
import { CustomerService } from "../services"
import { FindConfig } from "../types/common"
import { AdminListCustomerSelector } from "../types/customers"

type CustomerGroupConstructorProps = {
  customerService: CustomerService
}
class CustomerController extends BaseService {
  private customerService_: CustomerService

  constructor({ customerService }: CustomerGroupConstructorProps) {
    super()

    this.customerService_ = customerService
  }

  async listAndCount(queryparams: AdminGetCustomersParams): Promise<any> {
    const selector: AdminListCustomerSelector = {}

    if (queryparams.q) {
      selector.q = queryparams.q
    }

    let expandFields: string[] = []
    if (queryparams.expand) {
      expandFields = queryparams.expand.split(",")
    }

    const listConfig: FindConfig<Customer> = {
      relations: expandFields,
      skip: queryparams.offset,
      take: queryparams.limit,
    }

    return await this.customerService_.listAndCount(selector, listConfig)
  }
}

export default CustomerController
