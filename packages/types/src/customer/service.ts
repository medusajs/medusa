import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { CustomerDTO } from "./common"
import { CreateCustomerDTO } from "./mutations"

export interface ICustomerModuleService extends IModuleService {
  retrieve(
    customerId: string,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO>

  create(data: CreateCustomerDTO, sharedContext?: Context): Promise<CustomerDTO>
}
