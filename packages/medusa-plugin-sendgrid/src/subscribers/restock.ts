import { ProductService, SubscriberArgs, SubscriberConfig } from "@medusajs/medusa"
import type SendGridService from "../services/sendgrid"
import { MailDataRequired, MailService } from "@sendgrid/mail"
import { EventData } from "../types/generic"

export default async function restockHandler({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<EventData>) {
  const sendGridService: SendGridService = container.resolve(
    "sendgridService"
  )

  const templateId = await sendGridService.getTemplateId(
    "restock-notification.restocked"
  )

  if (!templateId) {
    return
  }

  const fetchedData = await sendGridService.fetchData(
    "restock-notification.restocked",
    data,
    null
  )

  if (!data.emails) {
    return
  }

  return await Promise.all(
    fetchedData.emails.map(async (e) => {
      const sendOptions: MailDataRequired | MailDataRequired[] = {
        templateId: templateId,
        from: sendGridService.options_.from,
        to: e,
        dynamicTemplateData: fetchedData,
      }

      return await sendGridService.sendEmail(sendOptions)
    })
  )
}

export const config: SubscriberConfig = {
  event: "restock-notification.restocked",
  context: {
    subscriberId: "restock-handler",
  },
}