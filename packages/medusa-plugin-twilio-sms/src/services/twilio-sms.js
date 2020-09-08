import { BaseService } from "medusa-interfaces"
import twilio from "twilio"

class TwilioSmsService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      account_sid: "1234",
   *      auth_token: "XXX",
   *      from_number: "+4512345678"
   *    }
   */
  constructor({}, options) {
    super()

    this.options_ = options

    this.twilioClient = twilio(options.account_sid, options.auth_token)
  }

  async sendSms(to, body) {
    return this.twilioClient.messages.create({
      to,
      body,
      from: this.options_.from_number,
    })
  }
}

export default TwilioSmsService
