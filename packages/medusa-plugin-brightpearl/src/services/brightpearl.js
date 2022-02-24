import { MedusaError, humanizeAmount } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import Brightpearl from "../utils/brightpearl"

class BrightpearlService extends BaseService {
  constructor(
    {
      manager,
      oauthService,
      totalsService,
      productVariantService,
      regionService,
      orderService,
      swapService,
      claimService,
      discountService,
    },
    options
  ) {
    super()

    this.manager_ = manager
    this.options = options
    this.productVariantService_ = productVariantService
    this.regionService_ = regionService
    this.orderService_ = orderService
    this.totalsService_ = totalsService
    this.discountService_ = discountService
    this.oauthService_ = oauthService
    this.swapService_ = swapService
    this.claimService_ = claimService
  }

  async getClient() {
    const authData = await this.oauthService_.retrieveByName("brightpearl")
    const { data } = authData

    if (!data || !data.access_token) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You must authenticate the Brightpearl app in settings before continuing"
      )
    }

    const tokenStore = {
      getToken: async () => {
        const appData = await this.oauthService_.retrieveByName("brightpearl")
        const authenticationData = appData.data
        return authenticationData.access_token
      },
      refreshToken: async () => {
        const newAuthentication = await this.oauthService_.refreshToken(
          "brightpearl"
        )
        return newAuthentication.data.refresh_token
      },
    }

    const client = new Brightpearl({
      account: this.options.account,
      url: data.api_domain,
      token_store: tokenStore,
    })

    this.authData_ = data
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
      let availabilities = {}
      const perChunk = 100
      const chunkedProducts = bpProducts.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
      }, [])

      // For large product catalogues we get 414 Too long URI so to avoid this
      // we chunk things up
      for (const chunk of chunkedProducts) {
        const productRange = chunk.map(({ productId }) => productId).join(",")

        const chunkAvails = await client.products.retrieveAvailability(
          productRange
        )

        availabilities = Object.assign(availabilities, chunkAvails)
      }

      return Promise.all(
        bpProducts.map(async (bpProduct) => {
          const { SKU: sku, productId } = bpProduct

          const variant = await this.productVariantService_
            .retrieveBySKU(sku, {
              select: ["id", "manage_inventory", "inventory_quantity"],
            })
            .catch((_) => undefined)

          const prodAvail = availabilities[productId]

          let onHand = 0
          if (
            prodAvail &&
            prodAvail.warehouses &&
            prodAvail.warehouses[`${this.options.warehouse}`]
          ) {
            onHand = prodAvail.warehouses[`${this.options.warehouse}`].onHand
          }

          if (variant && variant.manage_inventory) {
            if (parseInt(variant.inventory_quantity) !== parseInt(onHand)) {
              return this.productVariantService_.update(variant.id, {
                inventory_quantity: parseInt(onHand),
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

      const prodAvail = availability[productId]

      let onHand = 0
      if (
        prodAvail.warehouses &&
        prodAvail.warehouses[`${this.options.warehouse}`]
      ) {
        onHand = prodAvail.warehouses[`${this.options.warehouse}`].onHand
      }

      const sku = brightpearlProduct.identity.sku
      if (!sku) return

      const variant = await this.productVariantService_
        .retrieveBySKU(sku)
        .catch((_) => undefined)
      if (variant && variant.manage_inventory) {
        await this.manager_.transaction((m) => {
          return this.productVariantService_
            .withTransaction(m)
            .update(variant.id, {
              inventory_quantity: onHand,
            })
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
    const region = fromOrder.region
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
        externalRef: `${parentSo.externalRef}.${fromRefund.id}`,
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
            net: this.bpnum_(fromRefund.amount, fromOrder.currency_code),
            tax: 0,
            nominalCode: accountingCode,
          },
        ],
      }

      return client.orders
        .createCredit(order)
        .then(async (creditId) => {
          const paymentMethod = fromOrder.payments[0]
          const paymentType = "PAYMENT"
          const payment = {
            transactionRef: `${paymentMethod.id}.${fromRefund.id}`,
            transactionCode: fromOrder.id,
            paymentMethodCode: this.options.payment_method_code || "1220",
            orderId: creditId,
            currencyIsoCode: fromOrder.currency_code.toUpperCase(),
            amountPaid: this.bpnum_(fromRefund.amount, fromOrder.currency_code),
            paymentDate: new Date(),
            paymentType,
          }

          const existing = fromOrder.metadata.brightpearl_credit_ids || []
          const newIds = [...existing, creditId]

          await client.payments.create(payment)

          return this.orderService_.update(fromOrder.id, {
            metadata: {
              brightpearl_credit_ids: newIds,
            },
          })
        })
        .catch((err) => {
          console.log(err)
          console.log(err.response.data.errors)
        })
    }
  }

  async createSalesCredit(fromOrder, fromReturn) {
    const region = fromOrder.region
    const client = await this.getClient()
    const authData = await this.getAuthData()

    const orderIds = this.gatherOrders(fromOrder)
    const orderId = orderIds[0]
    const parentRows = await this.gatherRowsFromOrderIds(orderIds)

    if (orderId) {
      const parentSo = await client.orders.retrieve(orderId)
      const order = {
        currency: parentSo.currency,
        ref: parentSo.ref,
        externalRef: `${parentSo.externalRef}.${fromReturn.id}`,
        channelId: this.options.channel_id || `1`,
        installedIntegrationInstanceId: authData.installation_instance_id,
        customer: parentSo.customer,
        delivery: parentSo.delivery,
        parentId: orderId,
        rows: fromReturn.items.map((i) => {
          const parentRow = parentRows.find((row) => {
            return row.externalRef === i.item_id
          })
          return {
            net: this.bpround_(
              (parentRow.net / parentRow.quantity) * i.quantity
            ),
            tax: this.bpround_(
              (parentRow.tax / parentRow.quantity) * i.quantity
            ),
            productId: parentRow.productId,
            taxCode: parentRow.taxCode,
            externalRef: parentRow.externalRef,
            nominalCode: parentRow.nominalCode,
            quantity: i.quantity,
          }
        }),
      }

      if (fromReturn.shipping_method) {
        const totals = await this.totalsService_.getShippingMethodTotals(
          fromReturn.shipping_method,
          fromOrder,
          {
            include_tax: true,
            use_tax_lines: true,
          }
        )

        order.rows.push({
          net: this.bpnum_(
            -1 * (totals.total - totals.tax_total),
            fromOrder.currency_code
          ),
          tax: this.bpnum_(-1 * totals.tax_total, fromOrder.currency_code),
          name: "Return shipping",
          taxCode: region.tax_code,
          nominalCode: this.options.shipping_account_code || "4040",
          quantity: 1,
        })
      }

      const total = order.rows.reduce((acc, next) => {
        return acc + next.net + next.tax
      }, 0)

      const difference =
        this.bpnum_(fromReturn.refund_amount, fromOrder.currency_code) - total
      if (difference) {
        order.rows.push({
          name: "Difference",
          quantity: 1,
          taxCode: region.tax_code,
          net: this.bpround_(difference),
          tax: 0,
          nominalCode: this.options.sales_account_code || "4000",
        })
      }

      return client.orders
        .createCredit(order)
        .then(async (creditId) => {
          const paymentMethod = fromOrder.payments[0]
          const paymentType = "PAYMENT"
          const payment = {
            transactionRef: `${paymentMethod.id}.${fromReturn.id}`,
            transactionCode: fromOrder.id,
            paymentMethodCode: this.options.payment_method_code || "1220",
            orderId: creditId,
            currencyIsoCode: fromOrder.currency_code.toUpperCase(),
            amountPaid: this.bpnum_(
              fromReturn.refund_amount,
              fromOrder.currency_code
            ),
            paymentDate: new Date(),
            paymentType,
          }

          const existing = fromOrder.metadata.brightpearl_credit_ids || []
          const newIds = [...existing, creditId]

          await client.payments.create(payment)

          return this.orderService_.update(fromOrder.id, {
            metadata: {
              brightpearl_credit_ids: newIds,
            },
          })
        })
        .catch((err) => console.log(err))
    }
  }

  async createSalesOrder(fromOrderId) {
    const fromOrder = await this.orderService_.retrieve(fromOrderId, {
      select: [
        "total",
        "subtotal",
        "shipping_total",
        "gift_card_total",
        "discount_total",
      ],
      relations: [
        "region",
        "shipping_address",
        "billing_address",
        "shipping_methods",
        "payments",
      ],
    })

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
        code: fromOrder.currency_code.toUpperCase(),
      },
      ref: fromOrder.display_id,
      externalRef: fromOrder.id,
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
        await client.warehouses
          .createReservation(order, this.options.warehouse)
          .catch((err) => {
            console.log("Failed to allocate for order:", salesOrderId)
          })
        return salesOrderId
      })
      .then((salesOrderId) => {
        return this.orderService_.update(fromOrder.id, {
          metadata: {
            brightpearl_sales_order_id: salesOrderId,
          },
        })
      })
  }

  async createSwapPayment(fromSwapId) {
    const fromSwap = await this.swapService_.retrieve(fromSwapId)

    const client = await this.getClient()
    const soId =
      fromSwap.metadata && fromSwap.metadata.brightpearl_sales_order_id

    if (!soId || fromSwap.difference_due <= 0) {
      return
    }

    const paymentType = "RECEIPT"
    const payment = {
      transactionRef: `${fromSwap.id}.${paymentType}`, // Brightpearl cannot accept an auth and capture with same ref
      transactionCode: fromSwap.id,
      paymentMethodCode: this.options.payment_method_code || "1220",
      orderId: soId,
      paymentDate: new Date(),
      currencyIsoCode: fromSwap.order.currency_code.toUpperCase(),
      amountPaid: fromSwap.difference_due,
      paymentType,
    }

    await client.payments.create(payment)
  }

  async createSwapOrder(fromOrder, fromSwap) {
    const client = await this.getClient()
    let customer = await this.retrieveCustomerByEmail(fromOrder.email)

    if (!customer) {
      customer = await this.createCustomer({
        ...fromOrder,
        ...fromSwap,
      })
    }

    const authData = await this.getAuthData()

    const sIndex = fromOrder.swaps.findIndex((s) => fromSwap.id === s.id)

    const { shipping_address } = fromSwap
    const order = {
      currency: {
        code: fromOrder.currency_code.toUpperCase(),
      },
      ref: `${fromOrder.display_id}-S${sIndex + 1}`,
      externalRef: `${fromOrder.id}.${fromSwap.id}`,
      channelId: this.options.channel_id || `1`,
      installedIntegrationInstanceId: authData.installation_instance_id,
      statusId:
        this.options.swap_status_id || this.options.default_status_id || `3`,
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
      rows: await this.getBrightpearlRows({
        currency_code: fromOrder.currency_code,
        region: fromOrder.region,
        discounts: fromOrder.discounts,
        tax_rate: fromOrder.tax_rate,
        items: fromSwap.additional_items,
        shipping_methods: fromSwap.shipping_methods,
        return_shipping: fromSwap.return_shipping,
      }),
    }

    return client.orders.create(order).then(async (salesOrderId) => {
      const order = await client.orders.retrieve(salesOrderId)
      await client.warehouses
        .createReservation(order, this.options.warehouse)
        .catch((err) => {
          console.log("Failed to allocate for order:", salesOrderId)
        })

      const total = order.rows.reduce((acc, next) => {
        return acc + parseFloat(next.net) + parseFloat(next.tax)
      }, 0)

      const paymentMethod = fromOrder.payments[0]
      const paymentType = "RECEIPT"
      const payment = {
        transactionRef: `${paymentMethod.id}.${paymentType}-${fromSwap.id}`,
        transactionCode: fromOrder.id,
        paymentMethodCode: this.options.payment_method_code || "1220",
        orderId: salesOrderId,
        currencyIsoCode: fromOrder.currency_code.toUpperCase(),
        amountPaid: total,
        paymentDate: new Date(),
        paymentType,
      }

      await client.payments.create(payment)

      return this.swapService_.update(fromSwap.id, {
        metadata: {
          brightpearl_sales_order_id: salesOrderId,
        },
      })
    })
  }

  async createClaimCredit(fromOrder, fromClaim) {
    const region = fromOrder.region
    const client = await this.getClient()
    const authData = await this.getAuthData()
    const orderId = fromOrder.metadata.brightpearl_sales_order_id
    const cIndex = fromOrder.claims.findIndex((c) => fromClaim.id === c.id)

    if (orderId) {
      const parentSo = await client.orders.retrieve(orderId)
      const order = {
        currency: parentSo.currency,
        ref: `${parentSo.ref}-C${cIndex + 1}`,
        externalRef: `${parentSo.externalRef}.${fromClaim.id}`,
        channelId: this.options.channel_id || `1`,
        installedIntegrationInstanceId: authData.installation_instance_id,
        customer: parentSo.customer,
        delivery: parentSo.delivery,
        parentId: orderId,
        rows: [
          {
            name: `#${fromOrder.display_id}: Claim ${fromClaim.id}`,
            net: this.bpnum_(
              fromClaim.refund_amount,
              fromOrder.currency_code,
              10000 / (100 + fromOrder.tax_rate)
            ),
            tax: this.bpnum_(
              fromClaim.refund_amount * (1 - 100 / (100 + fromOrder.tax_rate)),
              fromOrder.currency_code
            ),
            taxCode: region.tax_code,
            nominalCode: this.options.sales_account_code || `4000`,
            quantity: 1,
          },
        ],
      }

      return client.orders
        .createCredit(order)
        .then(async (creditId) => {
          const paymentMethod = fromOrder.payments[0]
          const paymentType = "PAYMENT"
          const payment = {
            transactionRef: `${paymentMethod.id}.${paymentType}-${fromClaim.id}`,
            transactionCode: fromClaim.id,
            paymentMethodCode: this.options.payment_method_code || "1220",
            orderId: creditId,
            currencyIsoCode: fromOrder.currency_code.toUpperCase(),
            amountPaid: this.bpnum_(
              fromClaim.refund_amount,
              fromOrder.currency_code
            ),
            paymentDate: new Date(),
            paymentType,
          }

          await client.payments.create(payment)
        })
        .catch((err) => console.log(err.response.data.errors))
    }
  }

  gatherOrders(fromOrder) {
    const ids = []
    if (fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id) {
      ids.push(fromOrder.metadata.brightpearl_sales_order_id)
    }

    if (fromOrder.swaps) {
      for (const s of fromOrder.swaps) {
        if (s.metadata && s.metadata.brightpearl_sales_order_id) {
          ids.push(s.metadata.brightpearl_sales_order_id)
        }
      }
    }

    return ids
  }

  async gatherRowsFromOrderIds(ids) {
    const client = await this.getClient()
    const orders = await Promise.all(ids.map((i) => client.orders.retrieve(i)))

    let rows = []
    for (const o of orders) {
      rows = rows.concat(o.rows)
    }

    return rows
  }

  async createSwapCredit(fromOrder, fromSwap) {
    const region = fromOrder.region
    const client = await this.getClient()
    const authData = await this.getAuthData()

    const orderIds = this.gatherOrders(fromOrder)
    const orderId = orderIds[0]
    const parentRows = await this.gatherRowsFromOrderIds(orderIds)
    const sIndex = fromOrder.swaps.findIndex((s) => fromSwap.id === s.id)

    if (orderId) {
      const parentSo = await client.orders.retrieve(orderId)
      const order = {
        currency: parentSo.currency,
        ref: `${parentSo.ref}-S${sIndex + 1}`,
        externalRef: `${parentSo.externalRef}.${fromSwap.id}`,
        channelId: this.options.channel_id || `1`,
        installedIntegrationInstanceId: authData.installation_instance_id,
        customer: parentSo.customer,
        delivery: parentSo.delivery,
        parentId: orderId,
        rows: fromSwap.return_order.items.map((i) => {
          const parentRow = parentRows.find((row) => {
            return row.externalRef === i.item_id
          })
          return {
            net: this.bpround_(
              (parentRow.net / parentRow.quantity) * i.quantity
            ),
            tax: this.bpround_(
              (parentRow.tax / parentRow.quantity) * i.quantity
            ),
            productId: parentRow.productId,
            taxCode: parentRow.taxCode,
            externalRef: parentRow.externalRef,
            nominalCode: parentRow.nominalCode,
            quantity: i.quantity,
          }
        }),
      }

      if (
        fromSwap.return_order.shipping_method &&
        fromSwap.return_order.shipping_method.price
      ) {
        const shippingTotals =
          await this.totalsService_.getShippingMethodTotals(
            fromSwap.return_order.shipping_method,
            fromOrder,
            {
              include_tax: true,
              use_tax_lines: true,
            }
          )
        order.rows.push({
          name: "Return Shipping",
          quantity: 1,
          taxCode: region.tax_code,
          net: this.bpnum_(1 * shippingTotals.price, fromOrder.currency_code),
          tax: this.bpnum_(
            1 * shippingTotals.tax_total,
            fromOrder.currency_code
          ),
          nominalCode: this.options.shipping_account_code || "4040",
        })
      }

      const total = order.rows.reduce((acc, next) => {
        return acc + next.net + next.tax
      }, 0)

      return client.orders
        .createCredit(order)
        .then(async (creditId) => {
          const paymentMethod = fromOrder.payments[0]
          const paymentType = "PAYMENT"
          const payment = {
            transactionRef: `${paymentMethod.id}.${paymentType}-${fromSwap.id}`,
            transactionCode: fromSwap.id,
            paymentMethodCode: this.options.payment_method_code || "1220",
            orderId: creditId,
            currencyIsoCode: fromOrder.currency_code.toUpperCase(),
            amountPaid: total,
            paymentDate: new Date(),
            paymentType,
          }

          await client.payments.create(payment)
        })
        .catch((err) => console.log(err.response.data.errors))
    }
  }

  async createPayment(fromOrderId) {
    const fromOrder = await this.orderService_.retrieve(fromOrderId, {
      select: ["total"],
      relations: ["payments"],
    })

    const client = await this.getClient()
    const soId =
      fromOrder.metadata && fromOrder.metadata.brightpearl_sales_order_id
    if (!soId) {
      return
    }

    const paymentType = "RECEIPT"
    const payment = {
      transactionRef: `${fromOrder.id}.${paymentType}`, // Brightpearl cannot accept an auth and capture with same ref
      transactionCode: fromOrder.id,
      paymentMethodCode: this.options.payment_method_code || "1220",
      orderId: soId,
      paymentDate: new Date(),
      currencyIsoCode: fromOrder.currency_code.toUpperCase(),
      amountPaid: this.bpnum_(fromOrder.total, fromOrder.currency_code),
      paymentType,
    }

    return client.payments.create(payment)
  }

  async getBrightpearlRows(
    fromOrder,
    config = { include_price: true, is_claim: false }
  ) {
    const { region } = fromOrder

    const lines = await Promise.all(
      fromOrder.items.map(async (item) => {
        const bpProduct = await this.retrieveProductBySKU(item.variant.sku)

        const lineTotals = await this.totalsService_.getLineItemTotals(
          item,
          fromOrder,
          {
            include_tax: true,
            use_tax_lines: true,
          }
        )

        const row = {}
        if (bpProduct) {
          row.productId = bpProduct.productId
        } else {
          row.name = item.title
        }

        if (config.include_price) {
          row.net = this.bpnum_(
            lineTotals.subtotal - lineTotals.discount_total,
            fromOrder.currency_code
          )
          row.tax = this.bpnum_(lineTotals.tax_total, fromOrder.currency_code)
        } else if (config.is_claim) {
          row.net = await this.retrieveProductPrice(
            bpProduct.productId,
            this.options.cost_price_list || `1`
          )

          row.tax = this.bpnum_(
            row.net * 100,
            fromOrder.currency_code,
            lineTotals.tax_lines.reduce((acc, next) => acc + next.rate, 0)
          )
        }

        row.quantity = item.quantity
        row.taxCode = region.tax_code
        row.externalRef = item.id
        row.nominalCode = config.is_claim
          ? this.options.claims_account_code || "4000"
          : this.options.sales_account_code || "4000"

        if (item.is_giftcard) {
          row.nominalCode = this.options.gift_card_account_code || "4000"
        }

        return row
      })
    )

    // If a gift card was applied to the order we reduce the order amount
    // correspondingly. This reduces the amount payable, while debiting the
    // gift card account that was previously credited, when the gift card was
    // purchased.
    const gcTotal = fromOrder.gift_card_total
    if (gcTotal) {
      let tax = 0
      if (fromOrder.region.gift_cards_taxable) {
        tax = this.bpnum_(
          -1 * gcTotal,
          fromOrder.currency_code,
          fromOrder.region.tax_rate
        )
      }

      lines.push({
        name: `Gift Card`,
        net: this.bpnum_(-1 * gcTotal, fromOrder.currency_code),
        tax,
        quantity: 1,
        taxCode: region.tax_code,
        nominalCode: this.options.gift_card_account_code || "4000",
      })
    }

    const shippingMethods = fromOrder.shipping_methods
    if (shippingMethods.length > 0) {
      const shippingTotal = await shippingMethods.reduce(async (acc, next) => {
        const accum = await acc
        const totals = await this.totalsService_.getShippingMethodTotals(
          next,
          fromOrder,
          {
            include_tax: true,
            use_tax_lines: true,
          }
        )
        return {
          price: accum.price + totals.price,
          tax: accum.tax + totals.tax_total,
        }
      }, Promise.resolve({ price: 0, tax: 0 }))

      lines.push({
        name: `Shipping: ${shippingMethods.map((m) => m.name).join(" + ")}`,
        quantity: 1,
        net: this.bpnum_(shippingTotal.price, fromOrder.currency_code),
        tax: this.bpnum_(shippingTotal.tax, fromOrder.currency_code),
        taxCode: region.tax_code,
        nominalCode: this.options.shipping_account_code || "4040",
      })
    }

    return lines
  }

  async createClaim(fromOrder, fromClaim) {
    const client = await this.getClient()
    let customer = await this.retrieveCustomerByEmail(fromOrder.email)

    if (!customer) {
      customer = await this.createCustomer({
        ...fromOrder,
        ...fromClaim,
      })
    }

    const authData = await this.getAuthData()

    const cIndex = fromOrder.claims.findIndex((s) => fromClaim.id === s.id)

    const { shipping_address } = fromClaim
    const order = {
      currency: {
        code: this.options.base_currency || `EUR`,
      },
      priceListId: this.options.cost_price_list || `1`,
      ref: `${fromOrder.display_id}-C${cIndex + 1}`,
      externalRef: `${fromOrder.id}.${fromClaim.id}`,
      channelId: this.options.channel_id || `1`,
      installedIntegrationInstanceId: authData.installation_instance_id,
      statusId:
        this.options.claim_status_id || this.options.default_status_id || `3`,
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
      rows: await this.getBrightpearlRows(
        {
          currency_code: fromOrder.currency_code,
          region: fromOrder.region,
          discounts: fromOrder.discounts,
          tax_rate: fromOrder.tax_rate,
          items: fromClaim.additional_items,
          shipping_methods: [],
        },
        { include_price: false, is_claim: true }
      ),
    }

    return client.orders
      .create(order)
      .then(async (salesOrderId) => {
        const order = await client.orders.retrieve(salesOrderId)
        await client.warehouses
          .createReservation(order, this.options.warehouse)
          .catch((err) => {
            console.log("Failed to allocate for order:", salesOrderId)
          })

        const total = order.rows.reduce((acc, next) => {
          return acc + parseFloat(next.net) + parseFloat(next.tax)
        }, 0)

        const paymentMethod = fromOrder.payments[0]
        const paymentType = "RECEIPT"
        const payment = {
          transactionRef: `${paymentMethod.id}.${paymentType}-${fromClaim.id}`,
          transactionCode: fromOrder.id,
          paymentMethodCode: this.options.payment_method_code || "1220",
          orderId: salesOrderId,
          currencyIsoCode: this.options.base_currency || "EUR",
          amountPaid: total,
          paymentDate: new Date(),
          paymentType,
        }

        await client.payments.create(payment)

        return this.claimService_.update(fromClaim.id, {
          metadata: {
            brightpearl_sales_order_id: salesOrderId,
          },
        })
      })
      .catch((err) => {
        // console.log(err.response.data)
        throw err
      })
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

  async retrieveProductPrice(id, priceList) {
    const client = await this.getClient()
    return client.products.retrievePrice(id).then((data) => {
      if (!data.priceLists.length) {
        return null
      } else {
        const found = data.priceLists.find(
          (p) => `${p.priceListId}` === `${priceList}`
        )
        return found.quantityPrice["1"]
      }
    })
  }

  async createFulfillmentFromGoodsOut(id) {
    await this.manager_.transaction(async (m) => {
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

              // Brightpearl sometimes gives multiple order row entries
              quantity: goodsOut.orderRows[key].reduce(
                (sum, next) => sum + next.quantity,
                0
              ),
            }
          }

          return null
        })
        .filter((i) => !!i)

      // Orders with a concatenated externalReference are swap orders
      const [_, partId] = order.externalRef.split(".")

      if (partId) {
        if (partId.startsWith("claim")) {
          return this.claimService_
            .withTransaction(m)
            .createFulfillment(partId, {
              metadata: { goods_out_note: id },
            })
        } else {
          return this.swapService_
            .withTransaction(m)
            .createFulfillment(partId, {
              metadata: { goods_out_note: id },
            })
        }
      }

      return this.orderService_
        .withTransaction(m)
        .createFulfillment(order.externalRef, lines, {
          metadata: { goods_out_note: id },
        })
    }, "SERIALIZABLE")
  }

  async createCustomer(fromOrder) {
    const client = await this.getClient()
    const address = await client.addresses.create({
      addressLine1: fromOrder.shipping_address.address_1,
      addressLine2: fromOrder.shipping_address.address_2,
      addressLine3: fromOrder.shipping_address.city,
      addressLine4: fromOrder.shipping_address.province,
      postalCode: fromOrder.shipping_address.postal_code,
      countryIsoCode: fromOrder.shipping_address.country_code,
    })

    const customer = await client.customers.create({
      firstName: fromOrder.shipping_address.first_name,
      lastName: fromOrder.shipping_address.last_name,
      telephones: {
        PRI: fromOrder.shipping_address.phone,
      },
      emails: {
        PRI: fromOrder.email,
        SEC: fromOrder.email,
        TER: fromOrder.email,
      },
      postAddressIds: {
        DEF: address,
        BIL: address,
        DEL: address,
      },
    })

    return { contactId: customer }
  }

  bpround_(n) {
    const decimalPlaces = 4
    return Number(
      Math.round(parseFloat(n + "e" + decimalPlaces)) + "e-" + decimalPlaces
    )
  }

  bpnum_(number, currency, taxRate = 100) {
    const bpNumber = humanizeAmount(number, currency)
    return this.bpround_(bpNumber * (taxRate / 100))
  }
}

export default BrightpearlService
