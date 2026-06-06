import { IModuleService, ModuleJoinerConfig } from "@zjedene-medusa/types"
import { defineJoinerConfig } from "@zjedene-medusa/utils"

export class ModuleService implements IModuleService {
  __joinerConfig(): ModuleJoinerConfig {
    return defineJoinerConfig("module-service", {
      alias: [
        {
          name: ["custom_name"],
          entity: "Custom",
        },
      ],
    })
  }
}
