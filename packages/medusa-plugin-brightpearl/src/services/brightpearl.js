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

    const client = new Brightpearl({
      url: data.api_domain,
      auth_type: data.token_type,
      access_token: data.access_token,
    })

    this.brightpearlClient_ = client
    return client
  }

  async verifyWebhooks() {
    const brightpearl = await this.getClient()
    const hooks = [
      {
        subscribeTo: "product.modified.on-hand-modified",
        httpMethod: "POST",
        uriTemplate: `${this.options.backend_url}/brightpearl/inventory-update`,
        bodyTemplate:
          '{"account": "${account-code}", "lifecycleEvent": "${lifecycle-event}", "resourceType": "${resource-type}", "id": "${resource-id}" }',
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
    return Promise.all(
      variants.map(async (v) => {
        const brightpearlProduct = await this.retrieveProductBySKU(v.sku)
        if (!brightpearlProduct) {
          return
        }

        const { productId } = brightpearlProduct
        const availability = await client.products.retrieveAvailability(
          productId
        )
        const onHand = availability[productId].total.onHand

        return this.productVariantService_.update(v._id, {
          inventory_quantity: onHand,
        })
      })
    )
  }

  async updateInventory(productId) {
    const client = await this.getClient()
    const brightpearlProduct = await client.products.retrieve(productId)
    const availability = await client.products.retrieveAvailability(productId)

    const onHand = availability[productId].total.onHand

    const sku = brightpearlProduct.identity.sku
    const [variant] = await this.productVariantService_.list({ sku })

    if (variant && variant.manage_inventory) {
      await this.productVariantService_.update(variant._id, {
        inventory_quantity: onHand,
      })
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
        reference: shipment.tracking_number,
      },
    })
  }

  async createSalesOrder(fromOrder) {
    const client = await this.getClient()
    let customer = await this.retrieveCustomerByEmail(fromOrder.email)

    // All sales orders must have a customer
    if (!customer) {
      customer = await this.createCustomer(fromOrder)
    }

    const { shipping_address } = fromOrder
    const order = {
      currency: {
        code: fromOrder.currency_code,
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
      lineDiscounts = this.discountService_.getLineDiscounts(
        fromOrder,
        discount
      )
    }

    const lines = await Promise.all(
      fromOrder.items.map(async (item) => {
        const bpProduct = await this.retrieveProductBySKU(
          item.content.variant.sku
        )

        const discount = lineDiscounts.find((l) =>
          l.item._id.equals(item._id)
        ) || { amount: 0 }

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

  async retrieveProductBySKU(sku) {
    const client = await this.getClient()
    return client.products.retrieveBySKU(sku).then((products) => {
      if (!products.length) {
        return null
      }
      return products[0]
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
