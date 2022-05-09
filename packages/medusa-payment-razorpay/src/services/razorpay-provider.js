import _ from "lodash"
import Razorpay from "razorpay"
import { PaymentService } from "medusa-interfaces"
const crypto = require('crypto');

class RazorpayProviderService extends PaymentService {
  static identifier = "razorpay"
  static RAZORPAY_NAME_LENGTH_LIMIT = 50
  static seq_number = 0
  constructor({   customerService, totalsService, regionService }, options) {
    super()

    /**
     * Razorpay payment provider modelled around the stripe payment provider. 
     * 
     * Required Razorpay options:
     *  {
     *    api_key: "razorpay_secret_key", REQUIRED
     *    api_key_secret: "razor_pay_key_secret", REQUIRED
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

  _validateSignature(razorpay_payment_id,razorpay_order_id,razorpay_signature)
  {
    
      let crypto = require("crypto");
      let body = razorpay_order_id + "|" + razorpay_payment_id
      let expectedSignature = crypto.createHmac('sha256', this.options_.api_key_secret)
                                  .update(body.toString())
                                  .digest('hex');
     //                             console.log("sig received " ,razorpay_signature);
     //                             console.log("sig generated " ,expectedSignature);
     return expectedSignature === razorpay_signature
  }



  /**
   * Fetches Razorpay order. Check its status and returns the
   * corresponding Medusa status.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the order
   */
  async getStatus(orderData) {
    const { id } = orderData
    const orderResponse = await this.razorpay_.orders.fetch(id)

    let status = "pending"

    if (orderResponse.status === "created") {
      return status
    }

    if (orderResponse.status === "attempted") {
      return "processing"
    }

  
  if (orderResponse.status === "paid") {
    status = "authorized"
      return status
    }
  }
  /**
   * This function is irrelavent in razorpay standard checkout, as the payment types are stored and activiated in the client
   * Fetches a customers saved payment methods if registered in Razorpay.
   * @param {object} customer - customer to fetch saved cards for
   * @returns {Promise<Array<object>>} saved payments methods
   */
  async retrieveSavedMethods(customer) {
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

  async _findExistingCustomer(email,contact)
  {
    let customer_limit_per_page = 100
    let razorpayCustomerOfInterest = undefined
    let notFound = true;
    let fectchCustomerQueryParams = {
      count : customer_limit_per_page,
      skip : 0
    }
  
    do{
      let razorpayCustomers = await this.razorpay_.customers.all( fectchCustomerQueryParams)
      let customers = razorpayCustomers.items;
      let customer_interest = customers.filter(customer=>{if (customer.email === email|| customer.contact === contact) return true})
      if (customer_interest.length > 0)
      {
        razorpayCustomerOfInterest = await this.razorpay_.customers.fetch( customer_interest[0].id)
        notFound = false
        break;
      }
      else{
      fectchCustomerQueryParams = {
        count : customer_limit_per_page,
        skip : razorpayCustomers.count
      }
    }
    }while(razorpayCustomers.response<=customer_limit_per_page && notFound && razorpayCustomers.count);
    
    return razorpayCustomerOfInterest
  }

  /**
   * Creates a Razorpay customer using a Medusa customer.
   * @param {object} customer - Customer data from Medusa
   * @returns {Promise<object>} Razorpay customer
   */
  

  async createCustomer(customer) {
    try {
      let createCustomerQueryParams = {fail_existing:0,email:"startup@medusa.com"}
      let razorpayCustomer =undefined
      let razorpayCustomerUpdated = undefined
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
      try {
      razorpayCustomer = await this.razorpay_.customers.create( createCustomerQueryParams)
      if (customer.id) {
        await this.customerService_.update(customer.id, {
          metadata: { razorpay_id: razorpayCustomer.id },
        })
      }
      }
      catch (error)
      {
        razorpayCustomer = this._findExistingCustomer(customer.email,customer.contact)  
      }
      if (razorpayCustomer?.created_at) {
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
    
    const { customer_id, region_id, email ,order_number,display_id} = cart
    const { currency_code } = await this.regionService_.retrieve(region_id)

    const amount = await this.totalsService_.getTotal(cart)

    const intentRequest = {
      amount: amount, 
      currency: currency_code.toString().toUpperCase(),
      receipt:(display_id??"0000")+"_seq_"+RazorpayProviderService.seq_number,
     // partial_payment:true,
      notes: { cart_id: `${cart.id}` },
    }
    RazorpayProviderService.seq_number = RazorpayProviderService.seq_number+1
    if (customer_id) {
      const customer = await this.customerService_.retrieve(customer_id)

      if (customer.metadata?.razorpay_id) {
        intentRequest.notes["customer"] = customer.metadata.razorpay_id
      } else {
        const razorpayCustomer = await this.createCustomer({
          email,
          id: customer_id,
        })

        intentRequest.notes["customer_id"] = razorpayCustomer.id
      }
    } else {
      const razorpayCustomer = await this.createCustomer({
        email,
      })

      intentRequest.notes["customer_id"] = razorpayCustomer.id
    }

    const orderIntent = await this.razorpay_.orders.create(
      intentRequest
    )

    return orderIntent
  }


  /**
   * Creates a Razorpay order.
   * If customer is not registered in Razorpay, we do so.
   * @param {object} cart - cart to create a payment for
   * @returns {object} Razorpay order
   */
  async createPayment(cart) {
    const orderIntent = await this.createOrder(cart)
    return orderIntent
  }

  /**
   * Retrieves Razorpay order.
   * @param {object} sessionData - the data of the payment to retrieve
   * @returns {Promise<object>} Razorpay order
   */
  async retrievePayment(sessionData) {
    try {
      return this.razorpay_.orders  .fetch(sessionData.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Gets a Razorpay order intent and returns it.
   * @param {object} data - the data of the payment to retrieve
   * @returns {Promise<object>} Razorpay order
   */
  async getPaymentData(sessionData) {
    try {
      return this.razorpay_.orders.fetch(sessionData.data.id)
    } catch (error) {
      throw error
    }
  }

  /**
   * Authorizes Razorpay order by simply returning
   * the status for the order in use.
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
      let result ={}
      
      //razorpay_payment_id: 'pay_JE243QWSepvqeH', razorpay_order_id: 'order_JE217mxaUTILbJ', razorpay_signature: '28021fc7955db5841a386c95c5186e98fb6d529b8196cb195af17af22da0e4fa'
      if(update.razorpay_payment_id)
      {      
        result= this.razorpay_.orders.edit(sessionData.id,{"notes":{"razorpay_payment_id":update.razorpay_payment_id,
        "razorpay_order_id":update.razorpay_order_id,"razorpay_signature":update.razorpay_signature}})
      }
      else
      {
        result= this.razorpay_.orders.edit(sessionData.id,{"notes":update})
      }

      return result;
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates Razorpay order.
   * @param {object} sessionData - payment session data.
   * @param {object} update - object to update intent with
   * @returns {object} Razorpay order
   */
  async updatePayment(sessionData, cart) {
   try {

    return this.createPayment(cart)
    /*  const razorpayId = cart.customer?.metadata?.razorpay_id || undefined

      if (razorpayId !== sessionData?.data?.customer_id??"") {
        return this.createPayment(cart)
      } else {
        if (cart.total && sessionData.amount === Math.round(cart.total)) {
          return sessionData
        }

        return this.razorpay_.payments.edit(sessionData.id, {
          amount: Math.round(cart.total),
        })
      }
    */} catch (error) {
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

  /*razory pay doesn't support updating customer details of orders  thus we return an existing order as is*/
  /**
   * Updates customer of Razorpay order.
   * @param {string} order_id - id of order to update
   * @param {string} customerId - id of new Razorpay customer
   * @returns {object} Razorpay order
   */
  async updatePaymentIntentCustomer(order_id, customerId) {
    try {
       order_of_interest = this.razorpay_.orders.fetch(order_id)
       return order_of_interest
    } catch (error) {
      throw error
    }
  }

  /**
   * Captures payment for Razorpay order.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} Razorpay payment result
   */
  async capturePayment(paymentData) {
   
    try {
      const { razorpay_payment_id,razorpay_order_id,razorpay_signature } = paymentData.data.notes
      if(!this._validateSignature(razorpay_payment_id,razorpay_order_id,razorpay_signature))
       return
      const paymentIntent = await this.razorpay_.payments.fetch(razorpay_payment_id)
      if(paymentIntent.status === "captured")
      {
        return paymentIntent
      }
      else{
        return   await this.razorpay_.payments.capture(razorpay_payment_id,paymentIntent.amount,paymentIntent.currency)
      }
      
  
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
   * Refunds payment for Razorpay order.
   * @param {object} paymentData - payment method data from cart
   * @param {number} amountToRefund - amount to refund
   * @returns {string} refunded order
   */
  async refundPayment(paymentData, amountToRefund,speed="optimum") {
    const orderInformation = await this.razorpay_.orders.fetch(paymentData.data.order_id)
    const { razorpay_payment_id,razorpay_order_id,razorpay_signature } = orderInformation.notes
    if(!this._validateSignature(razorpay_payment_id,razorpay_order_id,razorpay_signature))
      return
    try {
      let paymentMade = await this.razorpay_.payments.fetch(razorpay_payment_id)
      if(paymentMade.amount-paymentMade.amount_refunded >= amountToRefund){
         const refundResult = await this.razorpay_.payments.refund(razorpay_payment_id,{
          amount: Math.round(amountToRefund),
         // id: razorpay_payment_id,
          speed:speed,
          receipt: paymentData.data.order_id
        })
        return refundResult
      }else 
        return
    
      } catch (error) {
      throw error
    }
  }

  /**
   * Cancels payment for Razorpay order.
   * @param {object} paymentData - payment method data from cart
   * @returns {object} canceled order
   * razorpay doesn't support cancelled orders once created, 
   * the status of the, it merely returns the current order.
   */
  async cancelPayment(payment) {
    const { id } = payment.data
    try {
      return await this.razorpay_.orders.fetch(id)
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
