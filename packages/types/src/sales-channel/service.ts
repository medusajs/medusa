import { ModuleJoinerConfig } from "../modules-sdk"
import { SalesChannelDTO } from "./common"

export interface ISalesChannelModuleService {
  /**
   * @ignore
   */
  __joinerConfig(): ModuleJoinerConfig

  retrieve(id: string): Promise<SalesChannelDTO>
}
