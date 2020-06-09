import { BaseService } from "medusa-interfaces"
import SendGrid from "@sendgrid/mail"

class SendGridService extends BaseService {
  constructor({}, options) {
    super()

    this.sendGrid_ = SendGrid.setApiKey(options.api_key)
  }

  /**
   * Sends an order confirmation using SendGrid.
   * @param {string} event - event related to the order
   * @param {string} from - sender of the order confirmation,
   *    e.g. `Medusa <hello@medusa.example>`
   * @param {string} subject - subject of the order confirmation,
   *    e.g. `Medusa - Order confirmation`
   * @param {Object} order - the order object sent to SendGrid, that must
   *    correlate with the structure specificed in the dynamic template
   * @returns {Promise} result of the send operation
   */
  async sendEmail(event, from, subject, order) {
    let templateId
    switch (event) {
      case "order.placed":
        templateId = options.template_id.order_placed
        break
      case "order.updated":
        templateId = options.template_id.order_updated
        break
      case "order.cancelled":
        templateId = options.template_id.order_cancelled
        break
    }

    return this.sendGrid_.send({
      from: options.sender,
      subject,
      templateId,
      to: order.email,
      dynamic_template_data: order,
    })
  }
}

export default SendGridService
