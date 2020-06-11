import { BaseService } from "medusa-interfaces"
import SendGrid from "@sendgrid/mail"

class SendGridService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: SendGrid api key
   *      from: Medusa <hello@medusa.example>,
   *      order_placed_template: 01234
   *      order_updated_template: 56789
   *      order_updated_cancellede: 4242
   *    }
   */
  constructor(options) {
    super()

    this.options_ = options

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
    let templateId
    switch (event) {
      case "order.placed":
        templateId = this.options_.order_placed_template
        break
      case "order.updated":
        templateId = this.options_.order_updated_template
        break
      case "order.cancelled":
        templateId = this.options_.order_cancelled_template
        break
    }

    try {
      return SendGrid.send({
        templateId,
        from: options.from,
        to: order.email,
        dynamic_template_data: order,
      })
    } catch (error) {
      throw error
    }
  }
}

export default SendGridService
