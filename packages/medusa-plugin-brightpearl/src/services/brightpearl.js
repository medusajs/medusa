import { BaseService } from "medusa-interfaces"
import Brightpearl from "../utils/brightpearl"

class BrightpearlService extends BaseService {
  constructor({ totalsService, regionService, orderService, discountService }, options) {
    super()

    this.options = options
    this.regionService_ = regionService
    this.orderService_ = orderService
    this.totalsService_ = totalsService
    this.discountService_ = discountService

    this.brightpearl_ = new Brightpearl({
      account: options.account,
      datacenter: options.datacenter,
      app_ref: options.app_ref,
      token: options.token
    })
  }

  async createGoodsOutNote(fromOrder, shipment) {
    const id = fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id

    if (!id) {
      return
    }

    const order = await this.brightpearl_.orders.retrieve(id)
    const productRows = shipment.item_ids.map(id => {
      const row = order.rows.find(({ externalRef }) => externalRef === id)
      return {
        productId: row.productId,
        salesOrderRowId: row.id,
        quantity: row.quantity
      }
    })

    const goodsOut = {
      warehouses: [
        {
          releaseDate: new Date(),
          warehouseId: this.options.warehouse,
          transfer: false,
          products: productRows,
        }
      ],
      priority: false,
    }

    return this.brightpearl_.warehouses.createGoodsOutNote(id, goodsOut)
  }

  registerGoodsOutShipped(noteId, shipment) {
    return this.brightpearl_.warehouses.registerGoodsOutEvent(noteId, {
      events: [
        {
          eventCode: "SHW",
          occured: new Date(),
          eventOwnerId: this.options.event_owner,
        }
      ]
    })
  }

  registerGoodsOutTrackingNumber(noteId, shipment) {
    return this.brightpearl_.warehouses.updateGoodsOutNote(noteId, {
      priority: false,
      shipping: {
        reference: shipment.tracking_number,
      }
    })
  }

  async createSalesOrder(fromOrder) {
    let customer = await this.retrieveCustomerByEmail(fromOrder.email)

    // All sales orders must have a customer
    if (!customer) {
      customer = await this.createCustomer(fromOrder)
    }

    const { shipping_address } = fromOrder
    const order = {
      currency: {
        code: fromOrder.currency_code
      },
      externalRef: fromOrder._id,
      customer: {
        id: customer.contactId,
        address: {
          addressFullName: `${shipping_address.first_name} ${shipping_address.last_name}`,
          addressLine1: shipping_address.address_1,
          addressLine2: shipping_address.address_2,
          postalCode: shipping_address.postal_code,
          countryIsoCode: shipping_address.country_code,
          telephone: shipping_address.phone,
          email: fromOrder.email,
        }
      },
      delivery: {
        shippingMethodId: 0,
        address: {
          addressFullName: `${shipping_address.first_name} ${shipping_address.last_name}`,
          addressLine1: shipping_address.address_1,
          addressLine2: shipping_address.address_2,
          postalCode: shipping_address.postal_code,
          countryIsoCode: shipping_address.country_code,
          telephone: shipping_address.phone,
          email: fromOrder.email,
        }
      },
      rows: await this.getBrightpearlRows(fromOrder)
    }

    return this.brightpearl_.orders.create(order)
      .then(async salesOrderId => {
        const order = await this.brightpearl_.orders.retrieve(salesOrderId)
        const resResult = await this.brightpearl_.warehouses.createReservation(order, this.options.warehouse)
        return salesOrderId
      })
      .then(async salesOrderId => {
        const paymentMethod = fromOrder.payment_method
        const paymentType = "AUTH"
        const payment = {
          transactionRef: `${paymentMethod._id}.${paymentType}`, // Brightpearl cannot accept an auth and capture with same ref
          transactionCode: fromOrder._id,
          paymentMethodCode: "1220",
          orderId: salesOrderId,
          currencyIsoCode: fromOrder.currency_code,
          paymentDate: new Date(),
          paymentType,
        }

        // Only if authorization type
        if (paymentType === "AUTH") {
          const today = new Date()
          const authExpire = today.setDate(today.getDate() + 7)
          payment.amountAuthorized = await this.totalsService_.getTotal(fromOrder)
          payment.authorizationExpiry = new Date(authExpire)
        } else {
          // For captured
        }

        await this.brightpearl_.payments.create(payment)

        return salesOrderId
      })
      .then((salesOrderId) => {
        return this.orderService_.setMetadata(fromOrder._id, "brightpearl_sales_order_id", salesOrderId)
      })
  }

  async createCapturedPayment(fromOrder) {
    const soId = fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id
    if (!soId) {
      return
    }

    const paymentType = "CAPTURE"
    const paymentMethod = fromOrder.payment_method
    const payment = {
      transactionRef: `${paymentMethod._id}.${paymentType}`, // Brightpearl cannot accept an auth and capture with same ref
      transactionCode: fromOrder._id,
      paymentMethodCode: "1220",
      orderId: soId,
      paymentDate: new Date(),
      currencyIsoCode: fromOrder.currency_code,
      amountPaid: await this.totalsService_.getTotal(fromOrder),
      paymentType,
    }

    await this.brightpearl_.payments.create(payment)
  }

  async getBrightpearlRows(fromOrder) { 
    const region = await this.regionService_.retrieve(fromOrder.region_id)
    const discount = fromOrder.discounts.find(({ discount_rule }) => discount_rule.type !== "free_shipping")
    let lineDiscounts = []
    if (discount) {
      lineDiscounts = this.discountService_.getLineDiscounts(fromOrder, discount)
    }

    const lines = await Promise.all(fromOrder.items.map(async item => {
      const bpProduct = await this.retrieveProductBySKU(item.content.variant.sku)

      const discount = lineDiscounts.find(l => l.item._id.equals(item._id)) || { amount: 0 }

      const row = {}
      if (bpProduct) {
        row.productId = bpProduct.productId
      } else {
        row.name = item.title
      }
      row.net = item.content.unit_price * item.quantity - discount.amount
      row.tax = row.net * fromOrder.tax_rate
      row.quantity = item.quantity
      row.taxCode = region.tax_code
      row.externalRef = item._id
      row.nominalCode = this.options.sales_account_code || "4000"

      return row
    }))

    const shippingTotal = this.totalsService_.getShippingTotal(fromOrder)
    const shippingMethods = fromOrder.shipping_methods
    if (shippingMethods.length > 0) {
      lines.push({
        name: `Shipping: ${shippingMethods.map(m => m.name).join(" + ")}`,
        quantity: 1,
        net: shippingTotal,
        tax: shippingTotal * fromOrder.tax_rate,
        taxCode: region.tax_code,
        nominalCode: this.options.shipping_account_code || "4040",
      })
    }
    return lines
  }

  retrieveCustomerByEmail(email) {
    return this.brightpearl_.customers.retrieveByEmail(email).then(customers => {
      if (!customers.length) {
        return null
      }
      return customers.find(c => c.primaryEmail === email)
    })
  }

  retrieveProductBySKU(sku) {
    return this.brightpearl_.products.retrieveBySKU(sku).then(products => {
      if (!products.length) {
        return null
      }
      return products[0]
    })
  }

  async createCustomer(fromOrder) {
    const address = await this.brightpearl_.addresses.create({
      addressLine1: fromOrder.shipping_address.address_1,
      addressLine2: fromOrder.shipping_address.address_2,
      postalCode: fromOrder.shipping_address.postal_code,
      countryIsoCode: fromOrder.shipping_address.country_code,
    })

    const customer = await this.brightpearl_.customers.create({
      firstName: fromOrder.shipping_address.first_name,
      lastName: fromOrder.shipping_address.last_name,
      postAddressIds: {
        DEF: address,
        BIL: address,
        DEL: address,
      }
    })

    return { contactId: customer }
  }
}

export default BrightpearlService
