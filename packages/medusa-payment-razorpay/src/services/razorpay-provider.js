import _ from "lodash"
import Razorpay from "razorpay"
import { PaymentService } from "medusa-interfaces"

class RazorpayProviderService extends PaymentService {
  static identifier = "razorpay"
  static RAZORPAY_NAME_LENGTH_LIMIT = 50
  constructor({   customerService, totalsService, regionService }, options) {
    super()

    /**
     * Required Razorpay options:
     *  {
     *    api_key: "razorpay_secret_key", REQUIRED
     *    api_key_secret: "razor_pay_key_secret", REQUIRED
     *    webhook_secret: "razorpay_key_secret", REQUIRED
     *    // Use this flag to capture payment immediately (default is false)
     *    capture: true
     *  }
     */
    this.options_ = options

    /** @private @const {Razorpay} */
    this.razorpay_ = new Razorpay(options={key_id:options.api_key,key_secret:options.api_key_secret})

    /** @private @const {CustomerService} */
    this.customerService_ = customerService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService
  }

  /**
   * Fetches Razorpay payment intent. Check its status and returns the
   * corresponding Medusa status.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the payment intent
   */
  async getStatus(paymentData) {
    const { id } = paymentData.id
    const paymentIntent = await this.razorpay_.payments.fetch(id)

    let status = "pending"

    if (paymentIntent.status === "requires_payment_method") {
      return status
    }

    if (paymentIntent.status === "created") {
      return status
    }

    if (paymentIntent.status === "processing") {
      return status
    }

    if (paymentIntent.status === "created") {
      status = "requires_more"
    }

    if (paymentIntent.status === "failed") {
      status = "canceled"
    }

    if (paymentIntent.status === "authorized") {
      status = "authorized"
    }

    if (paymentIntent.status === "captured") {
      status = "captured"
    }

    return status
  }

  /**
   * Fetches a customers saved payment methods if registered in Razorpay.
   * @param {object} customer - customer to fetch saved cards for
   * @returns {Promise<Array<object>>} saved payments methods
   */
  async retrieveSavedMethods(customer) {
    if (customer.metadata && customer.metadata.razorpay_id) {
      const methods = await this.razorpay_.paymentMethods.list({
        customer: customer.metadata.razorpay_id,
        type: "card",
      })

      return methods.data
    }

    return Promise.resolve([])
  }

  /**
   * Fetches a Razorpay customer
   * @param {string} razorpayCustomerId - Razorpay customer id
   * @returns {Promise<object>} Razorpay customer
   */
  async retrieveCustomer(razorpayCustomerId) {
    if (!razorpayCustomerId) {
      return Promise.resolve()
    }
    try{
      return this.razorpay_.customers.fetch(razorpayCustomerId)
    }
    catch(error){
      throw error
    }
  }

  /**
   * Creates a Razorpay customer using a Medusa customer.
   * @param {object} customer - Customer data from Medusa
   * @returns {Promise<object>} Razorpay customer
   */
  
  getValidatedName_(first_name,last_name)
  {
     
  }
  async createCustomer(customer) {
    try {
      let createCustomerQueryParams = {fail_existing:0}
      let fullname = (customer.first_name??"")+" "+(customer.last_name??"")
      let customerName = customer.name??fullname
      let notes = {}
      if (customerName?.length > RazorpayProviderService.RAZORPAY_NAME_LENGTH_LIMIT){
          createCustomerQueryParams.name = customerName?.substring(0,50)
      }
      else {
        createCustomerQueryParams.name   = customerName??""
      }
      createCustomerQueryParams.notes={fullname:customerName} 
      if (customer.email !=undefined )  {
        createCustomerQueryParams.email = customer.email
      }
      if (customer.contact !=undefined ) {
        createCustomerQueryParams.contact =customer.contact
      }
      createCustomerQueryParams["notes"]["customer_id"]=customer.id
     const razorpayCustomer = await this.razorpay_.customers.create( createCustomerQueryParams)
      let razorpayCustomerUpdated
      if (customer.id) {
        await this.customerService_.update(customer.id, {
          metadata: { razorpay_id: razorpayCustomer.id },
        })
      }
      if (razorpayCustomer.created_at != undefined) {
        razorpayCustomerUpdated= await this.updateCustomer(razorpayCustomer.id,customer)  /* updating the remaining details */
      }

      return razorpayCustomerUpdated??razorpayCustomer
    } catch (error) {
      throw error
    }
  }
/**
   * Updates a Razorpay customer using a Medusa customer.
   * @param {object} razorpayCustomerId - razorpay customer id
   * @param {object} customer - Customer data from Medusa
   * @returns {Promise<object>} Razorpay customer
   */
 async updateCustomer(razorpayCustomerId, customer) {

  let updateCustomerQueryParams = {}
  let fullname = (customer.first_name??"")+" "+(customer.last_name??"")
  let customerName = customer.name??fullname
  delete customer.first_name
  delete customer.last_name
  Object.assign(updateCustomerQueryParams,customer)
  if (customerName.length > RazorpayProviderService.RAZORPAY_NAME_LENGTH_LIMIT){
    updateCustomerQueryParams.name = customerName.substring(0,50)
    }
  else {
    updateCustomerQueryParams.name   = customerName??""
  }
  try{
    delete updateCustomerQueryParams.id
    delete updateCustomerQueryParams.password_hash
    const razorpayUpdateCustomer = await this.razorpay_.customers.edit(razorpayCustomerId, updateCustomerQueryParams)
    return razorpayUpdateCustomer
  }
  catch(error) {
  throw error
  }
 }
  /**
   * Creates a Razorpay Order intent.
   * If customer is not registered in Razorpay, we do so.
   * @param {object} cart - cart to create an order for
   * @returns {object} Razorpay order intent
   */
   async createOrder (cart) {
    const { customer_id, region_id, email ,order_number} = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    const amount = await this.totalsService_.getTotal(cart)

    const intentRequest = {
      amount: Math.round(amount), /*expressing all units in base currecny*/
      currency: currency_code,
      receipt:order_number,
      partial_payment:true,
      setup_future_usage: "on_session",
      capture_method: this.options_.capture ? "automatic" : "manual",
      notes: { cart_id: `${cart.id}` },
    }
    
    if (customer_id) {
      const customer = await this.customerService_.retrieve(customer_id)

      if (customer.metadata?.razorpay_id) {
        intentRequest.customer = customer.metadata.razorpay_id
      } else {
        const razorpayCustomer = await this.createCustomer({
          email,
          id: customer_id,
        })

        intentRequest.customer = razorpayCustomer.id
      }
    } else {
      const razorpayCustomer = await this.createCustomer({
        email,
      })

      intentRequest.customer = razorpayCustomer.id
    }

    const orderIntent = await this.razorpay_.orders.create(
      intentRequest
    )

    return orderIntent
  }


  /**
   * Creates a Razorpay payment intent.
   * If customer is not registered in Razorpay, we do so.
   * @param {object} cart - cart to create a payment for
   * @returns {object} Razorpay payment intent
   */
  async createPayment(cart) {
    const { customer_id, region_id, email,contact,method} = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    
    const orderIntent = await this.createOrder(cart)
    /*
    let intentRequest = {
      amount: orderIntent.amount,
      currency: orderIntent.currency,
      email: email,
      contact: contact,
      order_id: orderIntent.order_id,
      method: method.type, 
    }
    switch(method.type)
    {
      case 'card':
         intentRequest.card={
            number:cart.card.number,
            cvv:cart.card.cvv,
            expiry_month:cart.card.expiry_month,
            expiry_year:cart.card.expiry_year,
            name:cart.cart.name
        }
        break;
    }
    /*  
    const intentRequest = {
      amount: Math.round(amount),
      currency: currency_code,
      setup_future_usage: "on_session",
      capture_method: this.options_.capture ? "automatic" : "manual",
      metadata: { cart_id: `${cart.id}` },
    }*/

    

    /*if (customer_id) {
      const customer = await this.customerService_.retrieve(customer_id)

      if (customer.metadata?.razorpay_id) {
        intentRequest.customer = customer.metadata.razorpay_id
      } else {
        const razorpayCustomer = await this.createCustomer({
          email,
          id: customer_id,
        })

        intentRequest.customer = razorpayCustomer.id
      }
    } else {
      const razorpayCustomer = await this.createCustomer({
        email,
      })

      intentRequest.customer = razorpayCustomer.id
    }

    const paymentIntent = await this.razorpay_.payments.createPaymentJson(
      intentRequest
    )*/
    

    return orderIntent
  }

  /**
   * Retrieves Razorpay payment intent.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Razorpay payment intent
   */
  async retrievePayment(data) {
    try {
      return this.razorpay_.payments.fetch(data.sessionData.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Gets a Razorpay payment intent and returns it.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Razorpay payment intent
   */
  async getPaymentData(data) {
    try {
      return this.razorpay_.payments.fetch(data.payment_id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Authorizes Razorpay payment intent by simply returning
   * the status for the payment intent in use.
   * @param {object} sessionData - payment session data
   * @param {object} context - properties relevant to current context
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment(sessionData, context = {}) {
    const stat = await this.getStatus(sessionData.data)

    try {
      return { data: sessionData.data, status: stat }
    } catch (error) {
      throw error
    }
  }

  async updatePaymentData(sessionData, update) {
    try {
      return this.razorpay_.payments.edit(sessionData.data.payment_id, {
        ...update.data,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Razorpay payment intent.
   * @param {object} sessionData - payment session data.
   * @param {object} update - object to update intent with
   * @returns {object} Razorpay payment intent
   */
  async updatePayment(sessionData, cart) {
    try {
      const razorpayId = cart.customer?.metadata?.razorpay_id || undefined

      if (razorpayId !== sessionData.data.customer_id) {
        return this.createPayment(cart)
      } else {
        if (cart.total && sessionData.amount === Math.round(cart.total)) {
          return sessionData
        }

        return this.razorpay_.payments.edit(sessionData.id, {
          amount: Math.round(cart.total),
        })
      }
    } catch (error) {
      throw error
    }
  }

  async deletePayment(payment) {
    try {
      const { id } = payment.data.payment_id
      return this.razorpay_.payments.cancel(id).catch((err) => {
        if (err.statusCode === 400) {
          return
        }
        throw err
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates customer of Razorpay payment intent.
   * @param {string} payment_id - id of payment intent to update
   * @param {string} customerId - id of new Razorpay customer
   * @returns {object} Razorpay payment intent
   */
  async updatePaymentIntentCustomer(paymentIntentId, customerId) {
    try {
      return this.razorpay_.payments.edit(paymentIntentId, {
        customer: customerId,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Captures payment for Razorpay payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} Razorpay payment intent
   */
  async capturePayment(payment) {
    const { id } = paymentData.data.id
    try {
      const intent = await this.razorpay_.payments.capture(id)
      this.razorpay_.payments.capture(paymentData.paymentId, paymentData.amount, paymentData.currency)
      generated_signature = hmac_sha256(paymentData.order_id + "|" + paymentIntent.id, razorpay_.key_secret);

  if (generated_signature == paymentIntent.signature) {
    return paymentIntent
  }
      return intent
    } catch (error) {
      if (error.code === "payment_intent_unexpected_state") {
        if (error.payment_intent.status === "succeeded") {
          return error.payment_intent
        }
      }
      throw error
    }
  }

  /**
   * Refunds payment for Razorpay payment intent.
   * @param {object} paymentData - payment method data from cart
   * @param {number} amountToRefund - amount to refund
   * @returns {string} refunded payment intent
   */
  async refundPayment(paymentData, amountToRefund,speed="normal") {
    const { id } = paymentData.data.payment_id
    try {
      await this.razorpay_.refunds.create({
        amount: Math.round(amountToRefund),
        id: id,
        speed:speed,
        receipt: paymentData.receipt
      })

      return payment.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Razorpay payment intent.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} canceled payment intent
   */
  async cancelPayment(payment) {
    const { id } = payment.data
    try {
      return await this.razorpay_.paymentIntents.cancel(id)
    } catch (error) {
      if (error.payment_intent.status === "canceled") {
        return error.payment_intent
      }

      throw error
    }
  }

  /**
   * Constructs Razorpay Webhook event
   * @param {object} data - the data of the webhook request: req.body
   * @param {object} signature - the Razorpay signature on the event, that
   *    ensures integrity of the webhook event
   * @returns {object} Razorpay Webhook event
   */
  constructWebhookEvent(data, signature) {
    return this.razorpay_.webhooks.constructEvent(
      data,
      signature,
      this.options_.webhook_secret
    )
  }
}

export default RazorpayProviderService
