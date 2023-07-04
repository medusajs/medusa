class RestockNotification {
  constructor({ eventBusService, sendgridService }) {
    eventBusService.subscribe(
      "restock-notification.restocked",
      async (eventData) => {
        const templateId = await sendgridService.getTemplateId(
          "restock-notification.restocked"
        )

        if (!templateId) {
          return
        }

        const data = await sendgridService.fetchData(
          "restock-notification.restocked",
          eventData,
          null
        )

        if (!data.emails) {
          return
        }

        return await Promise.all(
          data.emails.map(async (e) => {
            const sendOptions = {
              template_id: templateId,
              from: sendgridService.options_.from,
              to: e,
              dynamic_template_data: data,
            }

            return await sendgridService.sendEmail(sendOptions)
          })
        )
      }
    )
  }
}

export default RestockNotification
