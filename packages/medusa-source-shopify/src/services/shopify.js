import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { parsePrice } from "../utils/parse-price"
import { removeIndex } from "../utils/remove-index"
import _ from "lodash"
import { createClient } from "../utils/create-client"
import { pager } from "../utils/pager"
import { INCLUDE_PRESENTMENT_PRICES } from "../const"

class ShopifyService extends BaseService {
  constructor(
    {
      manager,
      productService,
      productVariantService,
      productCollectionService,
      shippingProfileService,
      customerService,
      orderService,
      regionService,
      paymentRepository,
    },
    options
  ) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {ProductService} */
    this.productService_ = productService
    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService
    /** @private @const {ProductCollectionService} */
    this.collectionService_ = productCollectionService
    /** @private @const {ShippingProfileService} */
    this.shippingProfileService_ = shippingProfileService
    /** @private @const {CustomerService} */
    this.customerService_ = customerService
    /** @private @const {OrderService} */
    this.orderService_ = orderService
    /** @private @const {RegionService} */
    this.regionService_ = regionService
    /** @private @const {PaymentRepository} */
    this.paymentRepository_ = paymentRepository
    /** @private @const {ShopifyRestClient} */
    this.client_ = createClient(options)
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyService({
      manager: transactionManager,
      orderService: this.orderService_,
      customerService: this.customerService_,
      productCollectionService: this.collectionService_,
      shippingProfileService: this.shippingProfileService_,
      productVariantRepository: this.productVariantRepository_,
      productService: this.productService_,
      regionService: this.regionService_,
      paymentRepository: this.paymentRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async importShopify() {
    return this.atomicPhase_(async (manager) => {
      await this.shippingProfileService_.createDefault()
      await this.shippingProfileService_.createGiftCardDefault()

      const products = await pager(
        this.client_,
        "products",
        INCLUDE_PRESENTMENT_PRICES
      )
      const customCollections = await pager(this.client_, "custom_collections")
      const smartCollections = await pager(this.client_, "smart_collections")
      const collects = await pager(this.client_, "collects")

      const normalizedCustomCollections = customCollections.map((cc) =>
        this.normalizeCollection(cc)
      )
      const normalizedSmartCollections = smartCollections.map((sc) =>
        this.normalizeCollection(sc)
      )

      await this.createCollectionsWithProducts(
        collects,
        normalizedCustomCollections,
        products
      )

      await this.createCollectionsWithProducts(
        collects,
        normalizedSmartCollections,
        products
      )

      await Promise.all(
        products.map(async (p) => {
          try {
            await this.createProduct(p)
          } catch (err) {
            console.log(`${p.title} already exists`)
          }
        })
      )
    })
  }

  async createCollectionsWithProducts(
    collects,
    normalizedCollections,
    products
  ) {
    return this.atomicPhase_(async (manager) => {
      return Promise.all(
        normalizedCollections.map(async (nc) => {
          let collection = await this.collectionService_
            .retrieveByHandle(nc.handle)
            .catch((_) => undefined)

          if (!collection) {
            collection = await this.collectionService_
              .withTransaction(manager)
              .create(nc)
          }

          const productIds = collects.reduce((productIds, c) => {
            if (c.collection_id === collection.metadata.sh_id) {
              productIds.push(c.product_id)
            }
            return productIds
          }, [])

          const reducedProducts = products.reduce((reducedProducts, p) => {
            if (productIds.includes(p.id)) {
              reducedProducts.push(p)
              /**
               * As we only support products belonging to one collection,
               * we need to remove the product from the list of products
               * to prevent trying to add a product to several collections.
               * This is done on a first-come basis, so once a product belongs
               * to a collection, it is then removed from the list of products
               * that still needs to be imported.
               */
              removeIndex(products, p)
            }
            return reducedProducts
          }, [])

          return Promise.all(
            reducedProducts.map(async (rp) => {
              try {
                await this.createProduct(rp, collection.id)
              } catch (err) {
                console.log(`${rp.title} already exists`)
              }
            })
          )
        })
      )
    })
  }

  async createProduct(productOrId, collectionId) {
    return this.atomicPhase_(async (manager) => {
      let product
      let shippingProfile

      if (typeof productOrId === "number") {
        /**
         * Events related to products only contain a ID for the product
         * related to the event, so we need to fetch the product.
         */
        product = await this.client_.get({
          path: `products/${productOrId}`,
          extraHeaders: INCLUDE_PRESENTMENT_PRICES,
        })
      } else {
        product = productOrId
      }

      const normalizedProduct = this.normalizeProduct(product, collectionId)
      // Get default shipping profile
      if (normalizedProduct.is_giftcard) {
        shippingProfile = await this.shippingProfileService_.retrieveGiftCardDefault()
      } else {
        shippingProfile = await this.shippingProfileService_.retrieveDefault()
      }

      const variants = normalizedProduct.variants
      delete normalizedProduct.variants

      normalizedProduct.profile_id = shippingProfile

      const newProd = await this.productService_
        .withTransaction(manager)
        .create(normalizedProduct)

      if (variants && variants.length) {
        const optionIds = normalizedProduct.options.map(
          (o) => newProd.options.find((newO) => newO.title === o.title).id
        )

        for (const v of variants) {
          const variant = {
            ...v,
            options: v.options.map((o, index) => ({
              ...o,
              option_id: optionIds[index],
            })),
          }

          await this.productVariantService_
            .withTransaction(manager)
            .create(newProd.id, variant)
        }
      }
    })
  }

  async createCustomer(customer, shippingAddress, billingAddress) {
    return this.atomicPhase_(async (manager) => {
      const existingCustomer = await this.customerService_
        .retrieveByEmail(customer.email)
        .catch((_err) => undefined)

      if (existingCustomer) {
        return existingCustomer
      }

      const normalizedCustomer = this.normalizeCustomer(
        customer,
        shippingAddress,
        billingAddress
      )
      let normalizedBilling = normalizedCustomer.billing_address
      let normalizedShipping = normalizedCustomer.shipping_address

      delete normalizedCustomer.billing_address
      delete normalizedCustomer.shipping_address

      const medusaCustomer = await this.customerService_
        .withTransaction(manager)
        .create(normalizedCustomer)

      await this.customerService_
        .withTransaction(manager)
        .addAddress(medusaCustomer.id, normalizedShipping)
        .catch((e) =>
          console.log(
            "Failed on creating shipping address",
            e,
            normalizedShipping
          )
        )

      const result = await this.customerService_
        .withTransaction(manager)
        .update(medusaCustomer.id, {
          billing_address: normalizedBilling,
        })
        .catch((e) =>
          console.log(
            "Failed on creating billing address",
            e,
            normalizedBilling
          )
        )

      return result
    })
  }

  async addShippingMethod(shippingLine, orderId, taxRate) {
    const soId = "so_01FGVE1EPJM1SFRP29YJCK353K" //temp

    return this.atomicPhase_(async (manager) => {
      const order = await this.orderService_
        .withTransaction(manager)
        .addShippingMethod(
          orderId,
          soId,
          {},
          {
            price: parsePrice(shippingLine.price) * (1 - taxRate),
          }
        )

      return order
    })
  }

  async createOrder(order) {
    return this.atomicPhase_(async (manager) => {
      const { customer, shipping_address, billing_address, tax_lines } = order

      const medCustomer = await this.createCustomer(
        customer,
        shipping_address,
        billing_address
      )

      if (!medCustomer) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `An error occured while attempting to create or retrieve a customer`
        )
      }

      const region = await this.regionService_.retrieveByCountryCode(
        shipping_address.country_code.toLowerCase()
      )

      const orderTaxRate = tax_lines[0].rate || 0

      const normalizedOrder = await this.normalizeOrder(
        order,
        medCustomer.id,
        region.id,
        region.tax_rate,
        orderTaxRate
      )

      if (!normalizedOrder) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An error occurred while normalizing the order`
        )
      }

      const medusaOrder = await this.orderService_
        .withTransaction(manager)
        .create(normalizedOrder)

      await Promise.all(
        order.shipping_lines.map(async (sl) =>
          this.addShippingMethod(sl, medusaOrder.id, orderTaxRate)
        )
      )

      await this.createPayment({
        order_id: medusaOrder.id,
        currency_code: medusaOrder.currency_code,
        total: this.getOrderTotal(order),
      })
    })
  }

  async cancelOrder(orderId) {
    return this.atomicPhase_(async (manager) => {
      const order = this.orderService_.retrieveByExternalId(orderId)

      return await this.orderService_.withTransaction(manager).cancel(order.id)
    })
  }

  async createPayment(data) {
    return this.atomicPhase_(async (manager) => {
      const paymentRepo = manager.getCustomRepository(this.paymentRepository_)

      const created = paymentRepo.create({
        provider_id: "shopify",
        amount: data.total,
        currency_code: data.currency_code,
        data: {},
        order_id: data.order_id,
      })

      return paymentRepo.save(created)
    })
  }

  async updateProduct(product) {
    return this.atomicPhase_(async (manager) => {
      const medusaProduct = await this.productService_
        .retrieveByHandle(product.handle, {
          relations: ["variants"],
        })
        .catch((_) => undefined)

      if (!medusaProduct) {
        console.log("No product found")
        return Promise.resolve()
      }

      const { variants } = await this.client_
        .get({
          path: `products/${product.id}`,
          extraHeaders: INCLUDE_PRESENTMENT_PRICES,
        })
        .then((res) => {
          return res.body.product
        })

      product.variants = variants || []

      const normalizedUpdate = this.normalizeProduct(product)
      const updates = _.pickBy(normalizedUpdate, Boolean)

      updates.variants = await Promise.all(
        updates.variants.map(async (v) => {
          const match = medusaProduct.variants.find((mv) => mv.sku === v.sku)

          if (match) {
            let variant = await this.productVariantService_
              .withTransaction(manager)
              .retrieve(match.id, { relations: ["options"] })
            let options = variant.options.map((o, i) => {
              return { ...o, ...v.options[i] }
            })
            v.options = options
            v.id = variant.id
          }
          //errors on update with new variant
          return v
        })
      )

      await this.productService_
        .withTransaction(manager)
        .update(medusaProduct.id, updates)

      return Promise.resolve()
    })
  }

  async deleteProduct(id) {
    return this.atomicPhase_(async (manager) => {
      const product = await this.productService_
        .retrieveByExternalId(id)
        .catch((_) => undefined)

      if (product) {
        await this.productService_.withTransaction(manager).delete(product.id)
      }
    })
  }

  async normalizeOrder(
    shopifyOrder,
    customerId,
    regionId,
    taxRate,
    shopifyTaxRate
  ) {
    return this.atomicPhase_(async (manager) => {
      return {
        status: this.normalizeOrderStatus(),
        region_id: regionId,
        email: shopifyOrder.email,
        customer_id: customerId,
        currency_code: shopifyOrder.currency.toLowerCase(),
        tax_rate: taxRate,
        tax_total: parsePrice(shopifyOrder.total_tax),
        subtotal: shopifyOrder.subtotal_price,
        shipping_address: this.normalizeAddress(shopifyOrder.shipping_address),
        billing_address: this.normalizeAddress(shopifyOrder.billing_address),
        discount_total: shopifyOrder.total_discounts,
        fulfilment_status: this.normalizeOrderFulfilmentStatus(
          shopifyOrder.fulfilment_status
        ),
        payment_status: this.normalizeOrderPaymentStatus(
          shopifyOrder.financial_status
        ),
        items: await Promise.all(
          shopifyOrder.line_items.map(async (i) => {
            return this.normalizeLineItem(i, shopifyTaxRate)
          })
        ),
        external_id: shopifyOrder.id,
      }
    })
  }

  getOrderTotal(order) {
    const shippingTotal = order.shipping_lines.reduce(
      (total, i) => parsePrice(i.price) + total,
      0
    )

    const itemTotal = order.line_items.reduce(
      (total, i) => parsePrice(i.price) + total,
      0
    )

    return shippingTotal + itemTotal
  }

  async normalizeLineItem(lineItem, taxRate) {
    return this.atomicPhase_(async (manager) => {
      const productVariant = await this.productVariantService_
        .withTransaction(manager)
        .retrieveBySKU(lineItem.sku)

      return {
        title: lineItem.title,
        is_giftcard: lineItem.gift_card,
        unit_price: parsePrice(lineItem.price) * (1 - taxRate),
        quantity: lineItem.quantity,
        fulfilled_quantity:
          lineItem.fulfillment_status === "fulfilled"
            ? lineItem.fulfillable_quantity
            : 0,
        variant_id: productVariant.id,
      }
    })
  }

  normalizeOrderStatus() {
    return "completed"
  }

  normalizeOrderFulfilmentStatus(fulfilmentStatus) {
    switch (fulfilmentStatus) {
      case null:
        return "not_fulfilled"
      case "fulfilled":
        return "fulfilled"
      case "partial":
        return "partially_fulfilled"
      case "restocked":
        return "returned"
      case "pending":
        return "not_fulfilled"
      default:
        break
    }
  }

  normalizeOrderPaymentStatus(financial_status) {
    switch (financial_status) {
      case "refunded":
        return "refunded"
      case "voided":
        return "canceled"
      case "partially_refunded":
        return "partially_refunded"
      case "partially_paid":
        return "not_paid"
      case "pending":
        return "not_paid"
      case "authorized":
        return "awaiting"
      case "paid":
        return "captured"
      default:
        break
    }
  }

  normalizeProductOption(option) {
    return {
      title: option.name,
      values: option.values.map((v) => {
        return { value: v }
      }),
    }
  }

  normalizePrices(presentmentPrices) {
    return presentmentPrices.map((p) => {
      return {
        amount: parsePrice(p.price.amount),
        currency_code: p.price.currency_code.toLowerCase(),
      }
    })
  }

  normalizeVariantOptions(option1, option2, option3) {
    let opts = []
    if (option1) {
      opts.push({
        value: option1,
      })
    }

    if (option2) {
      opts.push({
        value: option2,
      })
    }

    if (option3) {
      opts.push({
        value: option3,
      })
    }

    return opts
  }

  normalizeTag(tag) {
    return {
      value: tag,
    }
  }

  normalizeVariant(variant) {
    return {
      title: variant.title,
      prices: this.normalizePrices(variant.presentment_prices),
      sku: variant.sku || null,
      barcode: variant.barcode || null,
      upc: variant.barcode || null,
      inventory_quantity: variant.inventory_quantity,
      variant_rank: variant.position,
      allow_backorder: variant.inventory_policy === "continue",
      manage_inventory: variant.inventory_management === "shopify", //if customer previously managed inventory through Shopify then true
      weight: variant.grams,
      options: this.normalizeVariantOptions(
        variant.option1,
        variant.option2,
        variant.option3
      ),
    }
  }

  normalizeProduct(product, collectionId) {
    return {
      title: product.title,
      handle: product.handle,
      description: product.body_html,
      product_type: {
        value: product.product_type,
      },
      is_giftcard: product.product_type === "Gift Cards",
      options:
        product.options.map((option) => this.normalizeProductOption(option)) ||
        [],
      variants:
        product.variants.map((variant) => this.normalizeVariant(variant)) || [],
      tags: product.tags.split(",").map((tag) => this.normalizeTag(tag)) || [],
      images: product.images.map((img) => img.src) || [],
      thumbnail: product.image?.src || null,
      collection_id: collectionId || null,
      external_id: product.id,
      status: "proposed", //products from Shopify should always be of status "proposed"
    }
  }

  normalizeCollection(shopifyCollection) {
    return {
      title: shopifyCollection.title,
      handle: shopifyCollection.handle,
      metadata: {
        sh_id: shopifyCollection.id,
        sh_body: shopifyCollection.body_html,
      },
    }
  }

  normalizeAddress(shopifyAddress) {
    return {
      first_name: shopifyAddress.first_name,
      last_name: shopifyAddress.last_name,
      phone: shopifyAddress.phone,
      company: shopifyAddress.company,
      address_1: shopifyAddress.address1,
      address_2: shopifyAddress.address2,
      city: shopifyAddress.city,
      postal_code: shopifyAddress.zip,
      country_code: shopifyAddress.country_code.toLowerCase(),
      province: shopifyAddress.province_code,
    }
  }

  normalizeCustomer(shopifyCustomer, shippingAddress, billingAddress) {
    return {
      first_name: shopifyCustomer.first_name,
      last_name: shopifyCustomer.last_name,
      email: shopifyCustomer.email,
      phone: shopifyCustomer.phone,
      shipping_address: this.normalizeAddress(shippingAddress),
      billing_address: this.normalizeAddress(billingAddress),
      metadata: {
        sh_id: shopifyCustomer.id,
      },
    }
  }
}

export default ShopifyService
