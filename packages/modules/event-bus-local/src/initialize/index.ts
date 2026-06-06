import { MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import { IEventBusService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

export const initialize = async (): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap<IEventBusService>({
    moduleKey: serviceKey,
    defaultPath: "@zjedene-medusa/event-bus-local",
  })

  return loaded[serviceKey]
}
