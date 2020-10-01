import { BaseService } from "medusa-interfaces"
import Mailchimp from "mailchimp-api-v3"

class MailchimpService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: Mailchimp api key
   *      newsletter_list_id: "123456789"
   *    }
   */
  constructor({}, options) {
    super()

    this.options_ = options

    this.mailchimp_ = new Mailchimp(options.api_key)
  }

  /**
   * Subscribes an email to a newsletter.
   * @param {string} email - email to use for the subscription
   * @param {Object} data - additional data (see https://mailchimp.com/developer/api/marketing/list-members/add-member-to-list/)
   * @return {Promise} result of newsletter subscription
   */
  async subscribeNewsletter(email, data) {
    return this.mailchimp_.post(
      `/lists/${this.options_.newsletter_list_id}/members`,
      {
        email_address: email,
        status: "subscribed",
        ...data,
      }
    )
  }
}

export default MailchimpService
