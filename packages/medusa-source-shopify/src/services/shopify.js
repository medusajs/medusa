import { BaseService } from "medusa-interfaces"
import _ from "lodash"
import { INCLUDE_PRESENTMENT_PRICES } from "../utils/const"

class ShopifyService extends BaseService {
  constructor(
    {
      manager,
      // lineItemService,
      // productService,
      // productVariantService,
      // productCollectionService,
      shippingProfileService,
      // customerService,
      // orderService,
      // regionService,
      // fulfillmentService,
      // orderRepository,
      // paymentRepository,
      shopifyProductService,
      shopifyCollectionService,
      shopifyClientService,
    },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    // /** @private @const {LineItemService} */
    // this.lineItemService_ = lineItemService
    // /** @private @const {ProductService} */
    // this.productService_ = productService
    // /** @private @const {ProductVariantService} */
    // this.productVariantService_ = productVariantService
    // /** @private @const {ProductCollectionService} */
    // this.collectionService_ = productCollectionService
    /** @private @const {ShippingProfileService} */
    this.shippingProfileService_ = shippingProfileService
    // /** @private @const {CustomerService} */
    // this.customerService_ = customerService
    // /** @private @const {OrderService} */
    // this.orderService_ = orderService
    // /** @private @const {FulfillmentService} */
    // this.fulfillmentService_ = fulfillmentService
    // /** @private @const {RegionService} */
    // this.regionService_ = regionService
    // /** @private @const {PaymentRepository} */
    // this.paymentRepository_ = paymentRepository
    // /** @private @const {OrderRepository} */
    // this.orderRepository_ = orderRepository
    /** @private @const {ShopifyRestClient} */
    this.client_ = shopifyClientService
    /** @private @const {ShopifyProductService} */
    this.productService_ = shopifyProductService
    /** @private @const {ShopifyCollectionService} */
    this.collectionService_ = shopifyCollectionService
    /** @private @const {ShopifyRestClient} */
    this.client_ = shopifyClientService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyService({
      manager: transactionManager,
      options: this.options,
      // orderService: this.orderService_,
      // customerService: this.customerService_,
      // productCollectionService: this.collectionService_,
      shippingProfileService: this.shippingProfileService_,
      shopifyClientService: this.client_,
      shopifyProductService: this.productService_,
      shopifyCollectionService: this.collectionService_,
      // productVariantRepository: this.productVariantRepository_,
      // productService: this.productService_,
      // regionService: this.regionService_,
      // paymentRepository: this.paymentRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async importShopify() {
    return this.atomicPhase_(async (manager) => {
      await this.shippingProfileService_.createDefault()
      await this.shippingProfileService_.createGiftCardDefault()

      let products = await this.client_.list(
        "products",
        INCLUDE_PRESENTMENT_PRICES
      )
      const customCollections = await this.client_.list("custom_collections")
      const smartCollections = await this.client_.list("smart_collections")
      const collects = await this.client_.list("collects")

      await this.collectionService_
        .withTransaction(manager)
        .createWithProducts(
          collects,
          [...customCollections, ...smartCollections],
          products
        )

      for (const product of products) {
        await this.productService_.withTransaction(manager).create(product)
      }
    })
  }

  // async createCollectionsWithProducts(
  //   collects,
  //   normalizedCollections,
  //   products
  // ) {
  //   return this.atomicPhase_(async (manager) => {
  //     return Promise.all(
  //       normalizedCollections.map(async (nc) => {
  //         let collection = await this.collectionService_
  //           .retrieveByHandle(nc.handle)
  //           .catch((_) => undefined)

  //         if (!collection) {
  //           collection = await this.collectionService_
  //             .withTransaction(manager)
  //             .create(nc)
  //         }

  //         const productIds = collects.reduce((productIds, c) => {
  //           if (c.collection_id === collection.metadata.sh_id) {
  //             productIds.push(c.product_id)
  //           }
  //           return productIds
  //         }, [])

  //         const reducedProducts = products.reduce((reducedProducts, p) => {
  //           if (productIds.includes(p.id)) {
  //             reducedProducts.push(p)
  //             /**
  //              * As we only support products belonging to one collection,
  //              * we need to remove the product from the list of products
  //              * to prevent trying to add a product to several collections.
  //              * This is done on a first-come basis, so once a product belongs
  //              * to a collection, it is then removed from the list of products
  //              * that still needs to be imported.
  //              */
  //             removeIndex(products, p)
  //           }
  //           return reducedProducts
  //         }, [])

  //         return Promise.all(
  //           reducedProducts.map(async (rp) => {
  //             try {
  //               await this.createProduct(rp, collection.id)
  //             } catch (_err) {
  //               console.log(`${rp.title} already exists. Skipping`)
  //             }
  //           })
  //         )
  //       })
  //     )
  //   })
  // }

  // async createProduct(productOrId, collectionId) {
  //   return this.atomicPhase_(async (manager) => {
  //     let product
  //     let shippingProfile

  //     if (typeof productOrId === "number") {
  //       /**
  //        * Events related to products only contain a ID for the product
  //        * related to the event, so we need to fetch the product.
  //        */
  //       product = await this.client_.get({
  //         path: `products/${productOrId}`,
  //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
  //       })
  //     } else {
  //       product = productOrId
  //     }

  //     const normalizedProduct = this.normalizeProduct(product, collectionId)
  //     // Get default shipping profile
  //     if (normalizedProduct.is_giftcard) {
  //       shippingProfile = await this.shippingProfileService_.retrieveGiftCardDefault()
  //     } else {
  //       shippingProfile = await this.shippingProfileService_.retrieveDefault()
  //     }

  //     const variants = normalizedProduct.variants
  //     delete normalizedProduct.variants

  //     normalizedProduct.profile_id = shippingProfile

  //     const newProd = await this.productService_
  //       .withTransaction(manager)
  //       .create(normalizedProduct)

  //     if (variants && variants.length) {
  //       const optionIds = normalizedProduct.options.map(
  //         (o) => newProd.options.find((newO) => newO.title === o.title).id
  //       )

  //       for (const v of variants) {
  //         const variant = {
  //           ...v,
  //           options: v.options.map((o, index) => ({
  //             ...o,
  //             option_id: optionIds[index],
  //           })),
  //         }

  //         await this.productVariantService_
  //           .withTransaction(manager)
  //           .create(newProd.id, variant)
  //       }
  //     }
  //   })
  // }

  // async createCustomer(customer, shippingAddress, billingAddress) {
  //   return this.atomicPhase_(async (manager) => {
  //     const existingCustomer = await this.customerService_
  //       .retrieveByEmail(customer.email)
  //       .catch((_err) => undefined)

  //     if (existingCustomer) {
  //       return existingCustomer
  //     }

  //     const normalizedCustomer = this.normalizeCustomer(
  //       customer,
  //       shippingAddress,
  //       billingAddress
  //     )
  //     let normalizedBilling = normalizedCustomer.billing_address
  //     let normalizedShipping = normalizedCustomer.shipping_address

  //     delete normalizedCustomer.billing_address
  //     delete normalizedCustomer.shipping_address

  //     const medusaCustomer = await this.customerService_
  //       .withTransaction(manager)
  //       .create(normalizedCustomer)

  //     await this.customerService_
  //       .withTransaction(manager)
  //       .addAddress(medusaCustomer.id, normalizedShipping)
  //       .catch((e) =>
  //         console.log(
  //           "Failed on creating shipping address",
  //           e,
  //           normalizedShipping
  //         )
  //       )

  //     const result = await this.customerService_
  //       .withTransaction(manager)
  //       .update(medusaCustomer.id, {
  //         billing_address: normalizedBilling,
  //       })
  //       .catch((e) =>
  //         console.log(
  //           "Failed on creating billing address",
  //           e,
  //           normalizedBilling
  //         )
  //       )

  //     return result
  //   })
  // }

  // async addShippingMethod(shippingLine, orderId, taxRate) {
  //   const soId = "so_01FH3KPZ9TWTDPB6EQ4ZE7N0NJ" //temp

  //   return this.atomicPhase_(async (manager) => {
  //     const order = await this.orderService_
  //       .withTransaction(manager)
  //       .addShippingMethod(
  //         orderId,
  //         soId,
  //         {},
  //         {
  //           price: parsePrice(shippingLine.price) * (1 - taxRate),
  //         }
  //       )

  //     return order
  //   })
  // }

  // async getRegion(countryCode) {
  //   try {
  //     return await this.regionService_.retrieveByCountryCode(
  //       countryCode.toLowerCase()
  //     )
  //   } catch (_err) {
  //     return null
  //   }
  // }

  // getShopifyTaxRate(taxLines) {
  //   return taxLines[0].rate || 0
  // }

  // async receiveRefund(refund) {
  //   return {}
  // }

  // async restockItems(lineItems) {
  //   return this.atomicPhase_(async (manager) => {
  //     for (const lineItem of lineItems) {
  //     }
  //   })
  // }

  // async createOrder(order) {
  //   return this.atomicPhase_(async (manager) => {
  //     const { customer, shipping_address, billing_address, tax_lines } = order

  //     const medCustomer = await this.createCustomer(
  //       customer,
  //       shipping_address,
  //       billing_address
  //     )

  //     if (!medCustomer) {
  //       throw new MedusaError(
  //         MedusaError.Types.NOT_FOUND,
  //         `An error occured while attempting to create or retrieve a customer`
  //       )
  //     }

  //     const normalizedOrder = await this.normalizeOrder(order, medCustomer.id)

  //     if (!normalizedOrder) {
  //       throw new MedusaError(
  //         MedusaError.Types.INVALID_DATA,
  //         `An error occurred while normalizing the order`
  //       )
  //     }

  //     const medusaOrder = await this.orderService_
  //       .withTransaction(manager)
  //       .create(normalizedOrder)

  //     await Promise.all(
  //       order.shipping_lines.map(async (sl) =>
  //         this.addShippingMethod(
  //           sl,
  //           medusaOrder.id,
  //           this.getShopifyTaxRate(tax_lines)
  //         )
  //       )
  //     )

  //     await this.createPayment({
  //       order_id: medusaOrder.id,
  //       currency_code: medusaOrder.currency_code,
  //       total: this.getOrderTotal(order),
  //     })
  //   })
  // }

  // async cancelOrder(orderId) {
  //   return this.atomicPhase_(async (manager) => {
  //     const order = this.orderService_.retrieveByExternalId(orderId)

  //     return await this.orderService_.withTransaction(manager).cancel(order.id)
  //   })
  // }

  // async createPayment(data) {
  //   return this.atomicPhase_(async (manager) => {
  //     const paymentRepo = manager.getCustomRepository(this.paymentRepository_)

  //     const created = paymentRepo.create({
  //       provider_id: "shopify",
  //       amount: data.total,
  //       currency_code: data.currency_code,
  //       data: {},
  //       order_id: data.order_id,
  //     })

  //     return paymentRepo.save(created)
  //   })
  // }

  // async updateProduct(product) {
  //   return this.atomicPhase_(async (manager) => {
  //     const medusaProduct = await this.productService_
  //       .retrieveByHandle(product.handle, {
  //         relations: ["variants"],
  //       })
  //       .catch((_) => undefined)

  //     if (!medusaProduct) {
  //       console.log("No product found")
  //       return Promise.resolve({})
  //     }

  //     const { variants } = await this.client_
  //       .get({
  //         path: `products/${product.id}`,
  //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
  //       })
  //       .then((res) => {
  //         return res.body.product
  //       })

  //     product.variants = variants || []

  //     const normalizedUpdate = this.normalizeProduct(product)
  //     const updates = _.pickBy(normalizedUpdate, Boolean)

  //     updates.variants = await Promise.all(
  //       updates.variants.map(async (v) => {
  //         const match = medusaProduct.variants.find((mv) => mv.sku === v.sku)

  //         if (match) {
  //           let variant = await this.productVariantService_
  //             .withTransaction(manager)
  //             .retrieve(match.id, { relations: ["options"] })
  //           let options = variant.options.map((o, i) => {
  //             return { ...o, ...v.options[i] }
  //           })
  //           v.options = options
  //           v.id = variant.id
  //         }
  //         //errors on update with new variant
  //         return v
  //       })
  //     )

  //     return await this.productService_
  //       .withTransaction(manager)
  //       .update(medusaProduct.id, updates)
  //   })
  // }

  // async deleteProduct(id) {
  //   return this.atomicPhase_(async (manager) => {
  //     const product = await this.productService_
  //       .retrieveByExternalId(id)
  //       .catch((_) => undefined)

  //     if (product) {
  //       await this.productService_.withTransaction(manager).delete(product.id)
  //     }
  //   })
  // }

  // async createFulfillment(data) {
  //   return this.atomicPhase_(async (manager) => {
  //     const {
  //       id,
  //       order_id,
  //       line_items,
  //       tracking_number,
  //       tracking_numbers,
  //       tracking_url,
  //       tracking_urls,
  //     } = data
  //     let order = await this.orderService_
  //       .retrieveByExternalId(order_id, {
  //         relations: ["items"],
  //       })
  //       .catch((_) => undefined)

  //     // if order occured before we began listening for orders to the shop
  //     if (!order) {
  //       const shopifyOrder = this.client_.get({
  //         path: `orders/${order_id}`,
  //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
  //       })
  //       order = await this.createOrder(shopifyOrder)
  //     }

  //     const itemsToFulfill = line_items.map((l) => {
  //       const match = order.items.find((i) => i.variant.sku === l.sku)

  //       if (!match) {
  //         throw new MedusaError(
  //           MedusaError.Types.INVALID_DATA,
  //           `Error on line item ${l.id}. Missing SKU. Product variants are required to have a SKU code.`
  //         )
  //       }

  //       return { item_id: match.id, quantity: l.quantity }
  //     })

  //     return await this.orderService_
  //       .withTransaction(manager)
  //       .createFulfillment(order.id, itemsToFulfill, {
  //         metadata: {
  //           sh_id: id,
  //           tracking_number,
  //           tracking_numbers,
  //           tracking_url,
  //           tracking_urls,
  //         },
  //       })
  //   })
  // }

  // async updateFulfillment(data) {
  //   return this.atomicPhase_(async (manager) => {
  //     const { id, order_id, status } = data
  //     let order = await this.orderService_
  //       .retrieveByExternalId(order_id, {
  //         relations: ["fulfillments", "items"],
  //       })
  //       .catch((_) => undefined)

  //     if (!order) {
  //       const shopifyOrder = this.client_.get({
  //         path: `orders/${order_id}`,
  //         extraHeaders: INCLUDE_PRESENTMENT_PRICES,
  //       })
  //       order = await this.createOrder(shopifyOrder)
  //     }

  //     const fulfillment = order.fulfillments.find(
  //       (f) => f.metadata.sh_id === id
  //     )

  //     if (status === "cancelled") {
  //       return await this.orderService_
  //         .withTransaction(manager)
  //         .cancelFulfillment(fulfillment.id)
  //     }

  //     if (status === "success") {
  //       //This can happend if a user adds shipping info such as tracking links after creating the fulfillment
  //       return Promise.resolve({})
  //     }
  //   })
  // }

  // async updateOrder(data) {
  //   return this.atomicPhase_(async (manager) => {
  //     const order = await this.orderService_
  //       .withTransaction(manager)
  //       .retrieveByExternalId(data.id, {
  //         relations: ["items", "shipping_address", "customer"],
  //       })

  //     for (const i of data.line_items) {
  //       if (i.fulfillable_quantity === 0) {
  //         removeIndex(data.line_items, i)
  //       }
  //     }

  //     const normalized = await this.normalizeOrder(data, order.customer.id)

  //     let itemUpdates = {
  //       update: [],
  //       add: [],
  //     }

  //     //need to divide line items into three categories
  //     // - delete: LineItem exists in Medusa but not in update
  //     // - update: LineItem exists both in Medusa and in update
  //     // - add: LineItem exists in update but not Medusa

  //     let orderItems = []

  //     for (const i of order.items) {
  //       let variant = await this.productVariantService_
  //         .withTransaction(manager)
  //         .retrieve(i.variant_id)
  //       orderItems.push({ sku: variant.sku, id: i.id })
  //     }

  //     for (const i of data.line_items) {
  //       let match = orderItems.find((oi) => oi.sku === i.sku)

  //       if (match) {
  //         console.log("before normalization")
  //         let normalized = await this.normalizeLineItem(
  //           i,
  //           this.getShopifyTaxRate(data.tax_lines)
  //         )
  //         removeIndex(orderItems, match)
  //         itemUpdates.update.push({ id: match.id, ...normalized })
  //       } else {
  //         let normalized = await this.normalizeLineItem(
  //           i,
  //           this.getShopifyTaxRate(data.tax_lines)
  //         )
  //         itemUpdates.add.push(normalized)
  //       }
  //     }

  //     order.email = data.email

  //     const orderRepo = manager.getCustomRepository(this.orderRepository_)
  //     await orderRepo.save(order)

  //     if (itemUpdates.add.length) {
  //       for (const i of itemUpdates.add) {
  //         await this.lineItemService_
  //           .withTransaction(manager)
  //           .create({ order_id: order.id, ...i })
  //       }
  //     }

  //     if (itemUpdates.update.length) {
  //       for (const i of itemUpdates.update) {
  //         console.log("update to item", { quantity: i.quantity })
  //         const updatedItem = await this.lineItemService_
  //           .withTransaction(manager)
  //           .update(i.id, { quantity: i.quantity })
  //         console.log("result of update", updatedItem)
  //       }
  //     }

  //     if (orderItems.length) {
  //       for (const i of orderItems) {
  //         await this.lineItemService_.withTransaction(manager).delete(i.id)
  //       }
  //     }

  //     await this.orderService_
  //       .withTransaction(manager)
  //       .updateShippingAddress_(order, normalized.shipping_address)
  //   })
  // }

  // async normalizeOrder(shopifyOrder, customerId) {
  //   return this.atomicPhase_(async (manager) => {
  //     const paymentStatus = this.normalizeOrderPaymentStatus(
  //       shopifyOrder.financial_status
  //     )
  //     const fulfillmentStatus = this.normalizeOrderFulfilmentStatus(
  //       shopifyOrder.fulfillment_status
  //     )

  //     const region = await this.getRegion(
  //       shopifyOrder.shipping_address.country_code
  //     )

  //     return {
  //       status: this.normalizeOrderStatus(fulfillmentStatus, paymentStatus),
  //       region_id: region.id,
  //       email: shopifyOrder.email,
  //       customer_id: customerId,
  //       currency_code: shopifyOrder.currency.toLowerCase(),
  //       tax_rate: region.tax_rate,
  //       tax_total: parsePrice(shopifyOrder.total_tax),
  //       subtotal: shopifyOrder.subtotal_price,
  //       shipping_address: this.normalizeAddress(shopifyOrder.shipping_address),
  //       billing_address: this.normalizeAddress(shopifyOrder.billing_address),
  //       discount_total: shopifyOrder.total_discounts,
  //       fulfilment_status: fulfillmentStatus,
  //       payment_status: paymentStatus,
  //       items: await Promise.all(
  //         shopifyOrder.line_items.map(async (i) => {
  //           return this.normalizeLineItem(
  //             i,
  //             this.getShopifyTaxRate(shopifyOrder.tax_lines)
  //           )
  //         })
  //       ),
  //       external_id: shopifyOrder.id,
  //     }
  //   })
  // }

  // getOrderTotal(order) {
  //   const shippingTotal = order.shipping_lines.reduce(
  //     (total, i) => parsePrice(i.price) + total,
  //     0
  //   )

  //   const itemTotal = order.line_items.reduce(
  //     (total, i) => parsePrice(i.price) + total,
  //     0
  //   )

  //   return shippingTotal + itemTotal
  // }

  // async normalizeLineItem(lineItem, taxRate) {
  //   return this.atomicPhase_(async (manager) => {
  //     const productVariant = await this.productVariantService_
  //       .withTransaction(manager)
  //       .retrieveBySKU(lineItem.sku)

  //     return {
  //       title: lineItem.title,
  //       is_giftcard: lineItem.gift_card,
  //       unit_price: parsePrice(lineItem.price) * (1 - taxRate),
  //       quantity: lineItem.quantity,
  //       fulfilled_quantity: lineItem.quantity - lineItem.fulfillable_quantity,
  //       variant_id: productVariant.id,
  //     }
  //   })
  // }

  // normalizeOrderStatus(fulfillmentStatus, paymentStatus) {
  //   if (fulfillmentStatus === "fulfilled" && paymentStatus === "captured") {
  //     return "completed"
  //   } else {
  //     return "pending"
  //   }
  // }

  // normalizeOrderFulfilmentStatus(fulfilmentStatus) {
  //   switch (fulfilmentStatus) {
  //     case null:
  //       return "not_fulfilled"
  //     case "fulfilled":
  //       return "fulfilled"
  //     case "partial":
  //       return "partially_fulfilled"
  //     case "restocked":
  //       return "returned"
  //     case "pending":
  //       return "not_fulfilled"
  //     default:
  //       return "not_fulfilled"
  //   }
  // }

  // normalizeOrderPaymentStatus(financial_status) {
  //   switch (financial_status) {
  //     case "refunded":
  //       return "refunded"
  //     case "voided":
  //       return "canceled"
  //     case "partially_refunded":
  //       return "partially_refunded"
  //     case "partially_paid":
  //       return "not_paid"
  //     case "pending":
  //       return "not_paid"
  //     case "authorized":
  //       return "awaiting"
  //     case "paid":
  //       return "captured"
  //     default:
  //       break
  //   }
  // }

  // normalizeProductOption(option) {
  //   return {
  //     title: option.name,
  //     values: option.values.map((v) => {
  //       return { value: v }
  //     }),
  //   }
  // }

  // normalizePrices(presentmentPrices) {
  //   return presentmentPrices.map((p) => {
  //     return {
  //       amount: parsePrice(p.price.amount),
  //       currency_code: p.price.currency_code.toLowerCase(),
  //     }
  //   })
  // }

  // normalizeVariantOptions(option1, option2, option3) {
  //   let opts = []
  //   if (option1) {
  //     opts.push({
  //       value: option1,
  //     })
  //   }

  //   if (option2) {
  //     opts.push({
  //       value: option2,
  //     })
  //   }

  //   if (option3) {
  //     opts.push({
  //       value: option3,
  //     })
  //   }

  //   return opts
  // }

  // normalizeTag(tag) {
  //   return {
  //     value: tag,
  //   }
  // }

  // normalizeVariant(variant) {
  //   return {
  //     title: variant.title,
  //     prices: this.normalizePrices(variant.presentment_prices),
  //     sku: variant.sku || null,
  //     barcode: variant.barcode || null,
  //     upc: variant.barcode || null,
  //     inventory_quantity: variant.inventory_quantity,
  //     variant_rank: variant.position,
  //     allow_backorder: variant.inventory_policy === "continue",
  //     manage_inventory: variant.inventory_management === "shopify", //if customer previously managed inventory through Shopify then true
  //     weight: variant.grams,
  //     options: this.normalizeVariantOptions(
  //       variant.option1,
  //       variant.option2,
  //       variant.option3
  //     ),
  //   }
  // }

  // normalizeProduct(product, collectionId) {
  //   return {
  //     title: product.title,
  //     handle: product.handle,
  //     description: product.body_html,
  //     product_type: {
  //       value: product.product_type,
  //     },
  //     is_giftcard: product.product_type === "Gift Cards",
  //     options:
  //       product.options.map((option) => this.normalizeProductOption(option)) ||
  //       [],
  //     variants:
  //       product.variants.map((variant) => this.normalizeVariant(variant)) || [],
  //     tags: product.tags.split(",").map((tag) => this.normalizeTag(tag)) || [],
  //     images: product.images.map((img) => img.src) || [],
  //     thumbnail: product.image?.src || null,
  //     collection_id: collectionId || null,
  //     external_id: product.id,
  //     status: "proposed", //products from Shopify should always be of status "proposed"
  //   }
  // }

  // normalizeCollection(shopifyCollection) {
  //   return {
  //     title: shopifyCollection.title,
  //     handle: shopifyCollection.handle,
  //     metadata: {
  //       sh_id: shopifyCollection.id,
  //       sh_body: shopifyCollection.body_html,
  //     },
  //   }
  // }

  // normalizeAddress(shopifyAddress) {
  //   return {
  //     first_name: shopifyAddress.first_name,
  //     last_name: shopifyAddress.last_name,
  //     phone: shopifyAddress.phone,
  //     company: shopifyAddress.company,
  //     address_1: shopifyAddress.address1,
  //     address_2: shopifyAddress.address2,
  //     city: shopifyAddress.city,
  //     postal_code: shopifyAddress.zip,
  //     country_code: shopifyAddress.country_code.toLowerCase(),
  //     province: shopifyAddress.province_code,
  //   }
  // }

  // normalizeCustomer(shopifyCustomer, shippingAddress, billingAddress) {
  //   return {
  //     first_name: shopifyCustomer.first_name,
  //     last_name: shopifyCustomer.last_name,
  //     email: shopifyCustomer.email,
  //     phone: shopifyCustomer.phone,
  //     shipping_address: this.normalizeAddress(shippingAddress),
  //     billing_address: this.normalizeAddress(billingAddress),
  //     metadata: {
  //       sh_id: shopifyCustomer.id,
  //     },
  //   }
  // }
}

export default ShopifyService
