import { IModuleService, ModuleJoinerConfig } from "@medusajs/types"
import { defineJoinerConfig } from "@medusajs/utils"

export class ModuleService implements IModuleService {
  __joinerConfig(): ModuleJoinerConfig {
    return defineJoinerConfig("module-service", {
      alias: [
        {
          name: ["custom_name"],
          args: {
            entity: "Custom",
          },
        },
      ],
    })
  }
}
