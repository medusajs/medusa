import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import Brightpearl from "../utils/brightpearl"

class BrightpearlService extends BaseService {
  constructor(
    {
      oauthService,
      totalsService,
      productVariantService,
      regionService,
      orderService,
      discountService,
    },
    options
  ) {
    super()

    this.options = options
    this.productVariantService_ = productVariantService
    this.regionService_ = regionService
    this.orderService_ = orderService
    this.totalsService_ = totalsService
    this.discountService_ = discountService
    this.oauthService_ = oauthService
  }

  async getClient() {
    if (this.brightpearlClient_) {
      return this.brightpearlClient_
    }

    const authData = await this.oauthService_.retrieveByName("brightpearl")
    const { data } = authData

    if (!data || !data.access_token) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You must authenticate the Brightpearl app in settings before continuing"
      )
    }

    const client = new Brightpearl(
      {
        account: this.options.account,
        url: data.api_domain,
        auth_type: data.token_type,
        access_token: data.access_token,
      },
      async (client) => {
        const newAuth = await this.oauthService_.refreshToken(
          "brightpearl",
          data.refresh_token
        )
        client.updateAuth({
          auth_type: newAuth.token_type,
          access_token: newAuth.access_token,
        })
      }
    )

    this.authData_ = data
    this.brightpearlClient_ = client
    return client
  }

  async getAuthData() {
    if (this.authData_) {
      return this.authData_
    }

    const { data } = await this.oauthService_.retrieveByName("brightpearl")
    if (!data || !data.access_token) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You must authenticate the Brightpearl app in settings before continuing"
      )
    }

    this.authData_ = data
    return data
  }

  async verifyWebhooks() {
    const brightpearl = await this.getClient()
    const hooks = [
      {
        subscribeTo: "goods-out-note.created",
        httpMethod: "POST",
        uriTemplate: `${this.options.backend_url}/brightpearl/goods-out`,
        bodyTemplate:
          '{"account": "${account-code}", "lifecycle_event": "${lifecycle-event}", "resource_type": "${resource-type}", "id": "${resource-id}" }',
        contentType: "application/json",
        idSetAccepted: false,
      },
      {
        subscribeTo: "product.modified.on-hand-modified",
        httpMethod: "POST",
        uriTemplate: `${this.options.backend_url}/brightpearl/inventory-update`,
        bodyTemplate:
          '{"account": "${account-code}", "lifecycle_event": "${lifecycle-event}", "resource_type": "${resource-type}", "id": "${resource-id}" }',
        contentType: "application/json",
        idSetAccepted: false,
      },
    ]

    const installedHooks = await brightpearl.webhooks.list().catch(() => [])
    for (const hook of hooks) {
      const isInstalled = installedHooks.find(
        (i) =>
          i.subscribeTo === hook.subscribeTo &&
          i.httpMethod === hook.httpMethod &&
          i.uriTemplate === hook.uriTemplate &&
          i.bodyTemplate === hook.bodyTemplate &&
          i.contentType === hook.contentType &&
          i.idSetAccepted === hook.idSetAccepted
      )

      if (!isInstalled) {
        await brightpearl.webhooks.create(hook)
      }
    }
  }

  async syncInventory() {
    const client = await this.getClient()
    const variants = await this.productVariantService_.list()

    let search = true
    let bpProducts = []
    while (search) {
      const { products, metadata } = await client.products.search(search)
      bpProducts = [...bpProducts, ...products]
      if (metadata.morePagesAvailable) {
        search = `firstResult=${metadata.lastResult + 1}`
      } else {
        search = false
      }
    }

    if (bpProducts.length) {
      const productRange = `${bpProducts[0].productId}-${
        bpProducts[bpProducts.length - 1].productId
      }`

      const availabilities = await client.products.retrieveAvailability(
        productRange
      )
      return Promise.all(
        variants.map(async (v) => {
          const brightpearlProduct = bpProducts.find(
            (prod) => prod.SKU === v.sku
          )
          if (!brightpearlProduct) {
            return
          }

          const { productId } = brightpearlProduct
          const availability = availabilities[productId]
          if (availability) {
            const onHand = availability.total.onHand

            // Only update if the inventory levels have changed
            if (parseInt(v.inventory_quantity) !== parseInt(onHand)) {
              return this.productVariantService_.update(v._id, {
                inventory_quantity: onHand,
              })
            }
          }
        })
      )
    }
  }

  async updateInventory(productId) {
    const client = await this.getClient()
    const availability = await client.products
      .retrieveAvailability(productId)
      .catch(() => null)

    if (availability) {
      const brightpearlProduct = await client.products.retrieve(productId)
      const onHand = availability[productId].total.onHand

      const sku = brightpearlProduct.identity.sku
      const [variant] = await this.productVariantService_.list({ sku })

      if (variant && variant.manage_inventory) {
        await this.productVariantService_.update(variant._id, {
          inventory_quantity: onHand,
        })
      }
    }
  }

  async createGoodsOutNote(fromOrder, shipment) {
    const client = await this.getClient()
    const id =
      fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id

    if (!id) {
      return
    }

    const order = await client.orders.retrieve(id)
    const productRows = shipment.item_ids.map((id) => {
      const row = order.rows.find(({ externalRef }) => externalRef === id)
      return {
        productId: row.productId,
        salesOrderRowId: row.id,
        quantity: row.quantity,
      }
    })

    const goodsOut = {
      warehouses: [
        {
          releaseDate: new Date(),
          warehouseId: this.options.warehouse,
          transfer: false,
          products: productRows,
        },
      ],
      priority: false,
    }

    return client.warehouses.createGoodsOutNote(id, goodsOut)
  }

  async registerGoodsOutShipped(noteId, shipment) {
    const client = await this.getClient()
    return client.warehouses.registerGoodsOutEvent(noteId, {
      events: [
        {
          eventCode: "SHW",
          occured: new Date(),
          eventOwnerId: this.options.event_owner,
        },
      ],
    })
  }

  async registerGoodsOutTrackingNumber(noteId, shipment) {
    const client = await this.getClient()
    return client.warehouses.updateGoodsOutNote(noteId, {
      priority: false,
      shipping: {
        reference: shipment.tracking_numbers.join(", "),
      },
    })
  }

  async createRefundCredit(fromOrder, fromRefund) {
    const region = await this.regionService_.retrieve(fromOrder.region_id)
    const client = await this.getClient()
    const authData = await this.getAuthData()
    const orderId = fromOrder.metadata.brightpearl_sales_order_id
    if (orderId) {
      let accountingCode = this.options.sales_account_code || "4000"
      if (
        fromRefund.reason === "discount" &&
        this.options.discount_account_code
      ) {
        accountingCode = this.options.discount_account_code
      }

      const parentSo = await client.orders.retrieve(orderId)
      const order = {
        currency: parentSo.currency,
        ref: parentSo.ref,
        externalRef: `${parentSo.externalRef}.${fromOrder.refunds.length}`,
        channelId: this.options.channel_id || `1`,
        installedIntegrationInstanceId: authData.installation_instance_id,
        customer: parentSo.customer,
        delivery: parentSo.delivery,
        parentId: orderId,
        rows: [
          {
            name: `${fromRefund.reason}: ${fromRefund.note}`,
            quantity: 1,
            taxCode: region.tax_code,
            net: fromRefund.amount / (1 + fromOrder.tax_rate),
            tax:
              fromRefund.amount - fromRefund.amount / (1 + fromOrder.tax_rate),
            nominalCode: accountingCode,
          },
        ],
      }

      return client.orders
        .createCredit(order)
        .then(async (creditId) => {
          const paymentMethod = fromOrder.payment_method
          const paymentType = "PAYMENT"
          const payment = {
            transactionRef: `${paymentMethod._id}.${fromOrder.refunds.length}`,
            transactionCode: fromOrder._id,
            paymentMethodCode: this.options.payment_method_code || "1220",
            orderId: creditId,
            currencyIsoCode: fromOrder.currency_code,
            amountPaid: fromRefund.amount,
            paymentDate: new Date(),
            paymentType,
          }

          const existing = fromOrder.metadata.brightpearl_credit_ids || []
          const newIds = [...existing, creditId]

          await client.payments.create(payment)

          return this.orderService_.setMetadata(
            fromOrder._id,
            "brightpearl_credit_ids",
            newIds
          )
        })
        .catch((err) => console.log(err.response.data.errors))
    }
  }

  async createSalesCredit(fromOrder, fromReturn) {
    const region = await this.regionService_.retrieve(fromOrder.region_id)
    const client = await this.getClient()
    const authData = await this.getAuthData()
    const orderId = fromOrder.metadata.brightpearl_sales_order_id
    if (orderId) {
      const parentSo = await client.orders.retrieve(orderId)
      const order = {
        currency: parentSo.currency,
        ref: parentSo.ref,
        externalRef: `${parentSo.externalRef}.${fromOrder.refunds.length}`,
        channelId: this.options.channel_id || `1`,
        installedIntegrationInstanceId: authData.installation_instance_id,
        customer: parentSo.customer,
        delivery: parentSo.delivery,
        parentId: orderId,
        rows: fromReturn.items.map((i) => {
          const parentRow = parentSo.rows.find((row) => {
            return row.externalRef === i.item_id
          })
          return {
            net: (parentRow.net / parentRow.quantity) * i.quantity,
            tax: (parentRow.tax / parentRow.quantity) * i.quantity,
            productId: parentRow.productId,
            taxCode: parentRow.taxCode,
            externalRef: parentRow.externalRef,
            nominalCode: parentRow.nominalCode,
            quantity: i.quantity,
          }
        }),
      }

      const total = order.rows.reduce((acc, next) => {
        return acc + next.net + next.tax
      }, 0)

      const difference = fromReturn.refund_amount - total
      if (difference) {
        order.rows.push({
          name: "Difference",
          quantity: 1,
          taxCode: region.tax_code,
          net: difference / (1 + fromOrder.tax_rate),
          tax: difference - difference / (1 + fromOrder.tax_rate),
          nominalCode: this.options.sales_account_code || "4000",
        })
      }

      return client.orders
        .createCredit(order)
        .then(async (creditId) => {
          const paymentMethod = fromOrder.payment_method
          const paymentType = "PAYMENT"
          const payment = {
            transactionRef: `${paymentMethod._id}.${fromOrder.refunds.length}`,
            transactionCode: fromOrder._id,
            paymentMethodCode: this.options.payment_method_code || "1220",
            orderId: creditId,
            currencyIsoCode: fromOrder.currency_code,
            amountPaid: fromReturn.refund_amount,
            paymentDate: new Date(),
            paymentType,
          }

          const existing = fromOrder.metadata.brightpearl_credit_ids || []
          const newIds = [...existing, creditId]

          await client.payments.create(payment)

          return this.orderService_.setMetadata(
            fromOrder._id,
            "brightpearl_credit_ids",
            newIds
          )
        })
        .catch((err) => console.log(err.response.data.errors))
    }
  }

  async createSalesOrder(fromOrder) {
    const client = await this.getClient()
    let customer = await this.retrieveCustomerByEmail(fromOrder.email)

    // All sales orders must have a customer
    if (!customer) {
      customer = await this.createCustomer(fromOrder)
    }

    const authData = await this.getAuthData()

    const { shipping_address } = fromOrder
    const order = {
      currency: {
        code: fromOrder.currency_code,
      },
      ref: fromOrder.display_id,
      externalRef: fromOrder._id,
      channelId: this.options.channel_id || `1`,
      installedIntegrationInstanceId: authData.installation_instance_id,
      statusId: this.options.default_status_id || `3`,
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
        },
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
        },
      },
      rows: await this.getBrightpearlRows(fromOrder),
    }

    return client.orders
      .create(order)
      .then(async (salesOrderId) => {
        const order = await client.orders.retrieve(salesOrderId)
        const resResult = await client.warehouses.createReservation(
          order,
          this.options.warehouse
        )
        return salesOrderId
      })
      .then(async (salesOrderId) => {
        const paymentMethod = fromOrder.payment_method
        const paymentType = "AUTH"
        const payment = {
          transactionRef: `${paymentMethod._id}.${paymentType}`, // Brightpearl cannot accept an auth and capture with same ref
          transactionCode: fromOrder._id,
          paymentMethodCode: this.options.payment_method_code || "1220",
          orderId: salesOrderId,
          currencyIsoCode: fromOrder.currency_code,
          paymentDate: new Date(),
          paymentType,
        }

        // Only if authorization type
        if (paymentType === "AUTH") {
          const today = new Date()
          const authExpire = today.setDate(today.getDate() + 7)
          payment.amountAuthorized = await this.totalsService_.getTotal(
            fromOrder
          )
          payment.authorizationExpiry = new Date(authExpire)
        } else {
          // For captured
        }

        await client.payments.create(payment)

        return salesOrderId
      })
      .then((salesOrderId) => {
        return this.orderService_.setMetadata(
          fromOrder._id,
          "brightpearl_sales_order_id",
          salesOrderId
        )
      })
  }

  async createCapturedPayment(fromOrder) {
    const client = await this.getClient()
    const soId =
      fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id
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

    await client.payments.create(payment)
  }

  async getBrightpearlRows(fromOrder) {
    const region = await this.regionService_.retrieve(fromOrder.region_id)
    const discount = fromOrder.discounts.find(
      ({ discount_rule }) => discount_rule.type !== "free_shipping"
    )
    let lineDiscounts = []
    if (discount) {
      lineDiscounts = this.totalsService_.getLineDiscounts(fromOrder, discount)
    }

    const lines = await Promise.all(
      fromOrder.items.map(async (item) => {
        const bpProduct = await this.retrieveProductBySKU(
          item.content.variant.sku
        )

        const discount = lineDiscounts.find((l) =>
          item._id.equals(l.item._id)
        ) || {
          amount: 0,
        }

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
      })
    )

    const shippingTotal = this.totalsService_.getShippingTotal(fromOrder)
    const shippingMethods = fromOrder.shipping_methods
    if (shippingMethods.length > 0) {
      lines.push({
        name: `Shipping: ${shippingMethods.map((m) => m.name).join(" + ")}`,
        quantity: 1,
        net: shippingTotal,
        tax: shippingTotal * fromOrder.tax_rate,
        taxCode: region.tax_code,
        nominalCode: this.options.shipping_account_code || "4040",
      })
    }
    return lines
  }

  async retrieveCustomerByEmail(email) {
    const client = await this.getClient()
    return client.customers.retrieveByEmail(email).then((customers) => {
      if (!customers.length) {
        return null
      }
      return customers.find((c) => c.primaryEmail === email)
    })
  }

  async retrieveProduct(byId) {
    const client = await this.getClient()
    return client.products.retrieve(byId)
  }

  async retrieveProductBySKU(sku) {
    const client = await this.getClient()
    return client.products.retrieveBySKU(sku).then((products) => {
      if (!products.length) {
        return null
      }
      return products[0]
    })
  }

  async createFulfillmentFromGoodsOut(id) {
    const client = await this.getClient()

    // Get goods out and associated order
    const goodsOut = await client.warehouses.retrieveGoodsOutNote(id)
    const order = await client.orders.retrieve(goodsOut.orderId)

    // Only relevant for medusa orders check channel id
    if (order.channelId !== parseInt(this.options.channel_id)) {
      return
    }

    // Combine the line items that we are going to create a fulfillment for
    const lines = Object.keys(goodsOut.orderRows)
      .map((key) => {
        const row = order.rows.find((r) => r.id == key)
        if (row) {
          return {
            item_id: row.externalRef,
            quantity: goodsOut.orderRows[key][0].quantity,
          }
        }

        return null
      })
      .filter((i) => !!i)

    return this.orderService_.createFulfillment(order.externalRef, lines, {
      goods_out_note: id,
    })
  }

  async createCustomer(fromOrder) {
    const client = await this.getClient()
    const address = await client.addresses.create({
      addressLine1: fromOrder.shipping_address.address_1,
      addressLine2: fromOrder.shipping_address.address_2,
      postalCode: fromOrder.shipping_address.postal_code,
      countryIsoCode: fromOrder.shipping_address.country_code,
    })

    const customer = await client.customers.create({
      firstName: fromOrder.shipping_address.first_name,
      lastName: fromOrder.shipping_address.last_name,
      postAddressIds: {
        DEF: address,
        BIL: address,
        DEL: address,
      },
    })

    return { contactId: customer }
  }
}

export default BrightpearlService
