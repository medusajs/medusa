import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { CustomerDTO } from "./common"

export interface ICustomerModuleService extends IModuleService {
  retrieve(
    cartId: string,
    config?: FindConfig<CustomerDTO>,
    sharedContext?: Context
  ): Promise<CustomerDTO>
}
