import { EventBusService, SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"
import SendGridService from "../services/sendgrid"
import { EventData } from "../types/generic"

export default async function userHandler({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<EventData>) {
  const sendGridService: SendGridService = container.resolve(
    "sendgridService"
  )

  if (!data) {
    return
  }

  return await sendGridService.sendNotification(
    "user.password_reset",
    data,
    null
  )

}

export const config: SubscriberConfig = {
  event: "user.password_reset",
  context: {
    subscriberId: "user-handler-notification",
  },
}