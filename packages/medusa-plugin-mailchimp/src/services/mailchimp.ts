import { TransactionBaseService } from "@medusajs/medusa"
import Mailchimp = require("mailchimp-api-v3")
import * as crypto from "crypto"
import { MailchimpPluginOptions } from "../types"

class MailchimpService extends TransactionBaseService {
  protected options_: MailchimpPluginOptions
  protected mailchimp_: Mailchimp

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: Mailchimp api key
   *      newsletter_list_id: "123456789"
   *    }
   */
  constructor(_, options: MailchimpPluginOptions) {
    super(_, options)

    this.options_ = options

    this.mailchimp_ = new Mailchimp(options.api_key)
  }

  /**
   * Subscribes an email to a newsletter.
   * @param {string} email - email to use for the subscription
   * @param {Object} data - additional data (see https://mailchimp.com/developer/marketing/api/list-merges/)
   * @return {Promise} result of newsletter subscription
   */
  async subscribeNewsletterAdd(email: string, data: any) {
    return this.mailchimp_.post(
      `/lists/${this.options_.newsletter_list_id}/members`,
      {
        email_address: email,
        status: "subscribed",
        ...data,
      }
    )
  }

  /**
   * Updates an email to a newsletter.
   * @param {string} email - email to use for the subscription
   * @param {Object} data - additional data (see https://mailchimp.com/developer/marketing/api/list-merges/)
   * @return {Promise} result of newsletter subscription
   */

  async subscribeNewsletterUpdate(
    email: string,
    data: any,
    statusIfNew?: string,
    status?: string
  ) {
    const lowercase = email.toLowerCase()
    const hash = crypto.createHash("md5").update(lowercase).digest("hex")

    return this.mailchimp_.put(
      `/lists/${this.options_.newsletter_list_id}/members/${hash}`,
      {
        email_address: email,
        status_if_new: statusIfNew || "subscribed",
        status: status || "subscribed",
        ...data,
      }
    )
  }
}

export default MailchimpService
