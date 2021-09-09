import axios from "axios"
import moment from "moment"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import EUCountries from "../utils/eu-countries"

const ECONOMIC_BASE_URL = "https://restapi.e-conomic.com"

class EconomicService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    {
   *      secret_token: "foo",
   *      agreement_token: "bar",
   *      customer_number_dk: 012
   *      customer_number_eu: 345
   *      customer_number_world: 678,
   *      unit_number: 42,
   *      payment_terms_number: 42,
   *      layout_number: 42,
   *      vatzone_number_eu: 42,
   *      vatzone_number_dk: 42,
   *      vatzone_number_world: 42,
   *      recipient_name: "Webshop customer"
   *    }
   */
  constructor({ orderService, totalsService, regionService }, options) {
    super()

    this.orderService_ = orderService

    this.totalsService_ = totalsService

    this.regionService_ = regionService

    this.options_ = options

    this.economic_ = axios.create({
      baseURL: ECONOMIC_BASE_URL,
      headers: {
        "X-AppSecretToken": options.secret_token,
        "X-AgreementGrantToken": options.agreement_token,
        "Content-Type": "application/json",
      },
    })
  }

  decideCustomerAndVatNumber_(country_code) {
    const upperCased = country_code.toUpperCase()
    if (upperCased === "DK") {
      return {
        vat: this.options_.vatzone_number_dk,
        customer: this.options_.customer_number_dk,
      }
    }

    if (EUCountries.includes(upperCased)) {
      return {
        vat: this.options_.vatzone_number_eu,
        customer: this.options_.customer_number_eu,
      }
    }

    return {
      vat: this.options_.vatzone_number_world,
      customer: this.options_.customer_number_world,
    }
  }

  async createEconomicLinesFromOrder(order) {
    let order_lines = []
    // Find the discount, that is not free shipping
    const discount = order.discounts.find(
      ({ rule }) => rule.type !== "free_shipping"
    )
    // If the discount has an item specific allocation method,
    // we need to fetch the discount for each item
    let itemDiscounts = []
    if (discount) {
      itemDiscounts = await this.totalsService_.getAllocationItemDiscounts(
        discount,
        order
      )
    }

    order.items.forEach((item) => {
      const total_amount = item.unit_price * item.quantity
      // Find the discount for current item and default to 0
      const itemDiscount =
        (
          itemDiscounts &&
          itemDiscounts.find((el) => el.lineItem.id === item.id)
        ).amount || 0

      // Withdraw discount from the total item amount
      const total_discounted_amount = total_amount - itemDiscount

      order_lines.push({
        lineNumber: order_lines.length + 1,
        sortKey: 1,
        unit: {
          unitNumber: this.options_.unit_number,
        },
        product: {
          productNumber: item.variant.sku,
        },
        quantity: item.quantity,
        // Do we include taxes on this bad boy?
        unitNetPrice: total_discounted_amount,
      })
    })

    return order_lines
  }

  async createInvoiceFromOrder(order) {
    // Fetch currency code from order region
    const { currency_code } = await this.regionService_.retrieve(
      order.region_id
    )

    const vatZoneAndCustomer = this.decideCustomerAndVatNumber_(
      order.billing_address.country_code
    )

    const lines = await this.createEconomicLinesFromOrder(order)

    return {
      date: moment().format("YYYY-MM-DD"),
      currency: currency_code,
      paymentTerms: {
        paymentTermsNumber: this.options_.payment_terms_number,
      },
      references: {
        other: order.id,
      },
      customer: {
        customerNumber: vatZoneAndCustomer.customer,
      },
      recipient: {
        name: this.options_.recipient_name,
        vatZone: {
          vatZoneNumber: vatZoneAndCustomer.vat,
        },
      },
      layout: {
        layoutNumber: this.options_.layout_number,
      },
      lines,
    }
  }

  async draftEconomicInvoice(orderId) {
    const order = await this.orderService_.retrieve(orderId)
    const invoice = await this.createInvoiceFromOrder(order)

    try {
      const draftInvoice = await this.economic_.post(
        `${ECONOMIC_BASE_URL}/invoices/drafts`,
        invoice
      )

      await this.orderService_.setMetadata(
        order.id,
        "economicDraftId",
        draftInvoice.data.draftInvoiceNumber
      )

      const invoiceOrder = await this.orderService_.retrieve(order.id)
      return invoiceOrder
    } catch (error) {
      throw error
    }
  }

  async bookEconomicInvoice(orderId) {
    try {
      const order = await this.orderService_.retrieve(orderId)
      const { economicDraftId } = order.metadata

      if (!economicDraftId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "The order does not have an invoice number"
        )
      }

      const bookInvoiceRequest = {
        draftInvoice: {
          draftInvoiceNumber: parseInt(economicDraftId),
        },
      }

      return this.economic_.post(
        `${ECONOMIC_BASE_URL}/invoices/booked`,
        bookInvoiceRequest
      )
    } catch (error) {
      throw error
    }
  }
}

export default EconomicService
