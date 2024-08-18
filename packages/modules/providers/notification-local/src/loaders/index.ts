import { INotificationModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export default async function loadSubscribers({ container, options }) {
  const notificationService: INotificationModuleService = container.resolve(
    ModuleRegistrationName.NOTIFICATION
  )

  notificationService.subscribe(["order.created", "order.updated"], "local", {
    channels: ["email"],
  })

  notificationService.subscribe(
    ["product.created", "product.updated"],
    "local",
    {
      channels: ["log"],
    }
  )
}
