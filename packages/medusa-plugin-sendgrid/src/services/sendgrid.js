import { BaseService } from "medusa-interfaces"
import SendGrid from "@sendgrid/mail"

class SendGridService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: SendGrid api key
   *      order_placed: {
   *        template_id: 1234,
   *        from: Medusa <hello@medusa.example>,
   *        subject: Medusa - Order confirmation
   *      },
   *      order_updated: {
   *        ...
   *      }
   *    }
   */
  constructor(options) {
    super()

    this.options_ = options

    // this.sendGrid_ = SendGrid.setApiKey(options.api_key)
    SendGrid.setApiKey(options.api_key)
  }

  /**
   * Sends an order confirmation using SendGrid.
   * @param {string} event - event related to the order
   * @param {Object} order - the order object sent to SendGrid, that must
   *    correlate with the structure specificed in the dynamic template
   * @returns {Promise} result of the send operation
   */
  async sendEmail(event, order) {
    let templateId, from, subject
    switch (event) {
      case "order.placed":
        templateId = this.options_.order_placed.template_id
        from = this.options_.order_placed.from
        subject = this.options_.order_placed.subject
        break
      case "order.updated":
        templateId = this.options_.order_updated.template_id
        from = this.options_.order_updated.from
        subject = this.options_.order_updated.subject
        break
      case "order.cancelled":
        templateId = this.options_.order_cancelled.template_id
        from = this.options_.order_cancelled.from
        subject = this.options_.order_cancelled.subject
        break
    }

    try {
      return SendGrid.send({
        from,
        subject,
        templateId,
        to: order.email,
        dynamic_template_data: order,
      })
    } catch (error) {
      throw error
    }
  }
}

export default SendGridService
