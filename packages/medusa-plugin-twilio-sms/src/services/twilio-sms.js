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

  /**
   * @param {Object} data - Twilio message options
   * see: https://www.twilio.com/docs/sms/api/message-resource#create-a-message-resource
   */
  async sendSms(data) {
    return this.twilioClient.messages.create({
      from: this.options_.from_number,
      ...data,
    })
  }
}

export default TwilioSmsService
