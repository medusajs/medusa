import { INotificationModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export default async function loadSubscribers({ container }) {
  const notificationService: INotificationModuleService = container.resolve(
    ModuleRegistrationName.NOTIFICATION
  )

  notificationService.subscribe(
    ["order.created", "order.updated"],
    "sendgrid",
    {
      channel: "email",
    }
  )
}
