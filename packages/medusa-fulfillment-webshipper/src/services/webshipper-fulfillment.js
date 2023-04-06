import { humanizeAmount } from "medusa-core-utils"
import { FulfillmentService } from "medusa-interfaces"
import Webshipper from "../utils/webshipper"

class WebshipperFulfillmentService extends FulfillmentService {
  static identifier = "webshipper"

  constructor(
    { logger, totalsService, claimService, swapService, orderService },
    options
  ) {
    super()

    this.options_ = options

    if (!options.coo_countries) {
      this.options_.coo_countries = ["all"]
    } else if (Array.isArray(options.coo_countries)) {
      this.options_.coo_countries = options.coo_countries.map((c) =>
        c.toLowerCase()
      )
    } else if (typeof options.coo_countries === "string") {
      this.options_.coo_countries = [options.coo_countries]
    }

    /** @private @const {logger} */
    this.logger_ = logger

    /** @private @const {OrderService} */
    this.orderService_ = orderService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {SwapService} */
    this.swapService_ = swapService

    /** @private @const {SwapService} */
    this.claimService_ = claimService

    /** @private @const {AxiosClient} */
    this.client_ = new Webshipper({
      account: this.options_.account,
      token: this.options_.api_token,
    })
  }

  registerInvoiceGenerator(service) {
    if (typeof service.createInvoice === "function") {
      this.invoiceGenerator_ = service
    }
  }

  async getFulfillmentOptions() {
    const rates = await this.client_.shippingRates.list({
      order_channel_id: this.options_.order_channel_id,
    })

    return rates.data.map((r) => ({
      id: r.attributes.name,
      webshipper_id: r.id,
      name: r.attributes.name,
      require_drop_point: r.attributes.require_drop_point,
      carrier_id: r.attributes.carrier_id,
      is_return: r.attributes.is_return,
    }))
  }

  async validateFulfillmentData(optionData, data, _) {
    if (optionData.require_drop_point) {
      if (!data.drop_point_id) {
        throw new Error("Must have drop point id")
      } else {
        // TODO: validate that the drop point exists
      }
    }

    return {
      ...optionData,
      ...data,
    }
  }

  async validateOption(data) {
    const rate = await this.client_.shippingRates
      .retrieve(data.webshipper_id)
      .catch(() => undefined)
    return !!rate
  }

  canCalculate() {
    // Return whether or not we are able to calculate dynamically
    return false
  }

  calculatePrice() {
    // Calculate prices
  }

  /**
   * Creates a return shipment in webshipper using the given method data, and
   * return lines.
   */
  async createReturn(returnOrder) {
    let orderId
    if (returnOrder.order_id) {
      orderId = returnOrder.order_id
    } else if (returnOrder.swap) {
      orderId = returnOrder.swap.order_id
    } else if (returnOrder.claim_order) {
      orderId = returnOrder.claim_order.order_id
    }

    const fromOrder = await this.orderService_.retrieve(orderId, {
      select: ["total"],
      relations: ["discounts", "discounts.rule", "shipping_address", "returns"],
    })

    const methodData = returnOrder.shipping_method.data

    const relationships = {
      shipping_rate: {
        data: {
          type: "shipping_rates",
          id: methodData.webshipper_id,
        },
      },
    }

    const existing =
      fromOrder.metadata && fromOrder.metadata.webshipper_order_id
    if (existing) {
      relationships.order = {
        data: {
          type: "orders",
          id: existing,
        },
      }
    }

    const docs = []
    if (this.invoiceGenerator_) {
      const base64Invoice = await this.invoiceGenerator_.createReturnInvoice(
        fromOrder,
        returnOrder.items
      )

      docs.push({
        document_size: "A4",
        document_format: "PDF",
        base64: base64Invoice,
        document_type: "invoice",
      })
    }

    const { shipping_address } = fromOrder
    const returnShipment = {
      type: "shipments",
      attributes: {
        reference: `R${fromOrder.display_id}-${fromOrder.returns.length + 1}`,
        ext_ref: `${fromOrder.id}.${returnOrder.id}`,
        is_return: true,
        included_documents: docs,
        packages: [
          {
            weight: 500,
            weight_unit: "g",
            dimensions: {
              unit: "cm",
              height: 15,
              width: 15,
              length: 15,
            },
            customs_lines: await Promise.all(
              returnOrder.items.map(async ({ item, quantity }) => {
                const totals = await this.totalsService_.getLineItemTotals(
                  item,
                  fromOrder,
                  {
                    include_tax: true,
                    use_tax_lines: true,
                  }
                )
                return {
                  ext_ref: item.id,
                  sku: item.variant.sku,
                  description: item.title,
                  quantity: quantity,
                  country_of_origin:
                    item.variant.origin_country ||
                    item.variant.product.origin_country,
                  tarif_number:
                    item.variant.hs_code || item.variant.product.hs_code,
                  unit_price: humanizeAmount(
                    totals.unit_price,
                    fromOrder.currency_code
                  ),
                  vat_percent: totals.tax_lines.reduce(
                    (acc, next) => acc + next.rate,
                    0
                  ),
                  currency: fromOrder.currency_code.toUpperCase(),
                }
              })
            ),
          },
        ],
        sender_address: {
          att_contact: `${shipping_address.first_name} ${shipping_address.last_name}`,
          // Some carriers require a company_name
          company_name: `${shipping_address.first_name} ${shipping_address.last_name}`,
          address_1: shipping_address.address_1,
          address_2: shipping_address.address_2,
          zip: shipping_address.postal_code,
          city: shipping_address.city,
          country_code: shipping_address.country_code.toUpperCase(),
          state: shipping_address.province,
          phone: shipping_address.phone,
          email: fromOrder.email,
        },
        delivery_address: this.options_.return_address,
      },
      relationships,
    }

    return this.client_.shipments
      .create(returnShipment)
      .then((result) => {
        return result.data
      })
      .catch((err) => {
        this.logger_.warn(err.response)
        throw err
      })
  }

  async getReturnDocuments(data) {
    const shipment = await this.client_.shipments.retrieve(data.id)
    const labels = await this.retrieveRelationship(
      shipment.data.relationships.labels
    ).then((res) => res.data)
    const docs = await this.retrieveRelationship(
      shipment.data.relationships.documents
    ).then((res) => res.data)
    const toReturn = []
    for (const d of labels) {
      toReturn.push({
        name: "Return label",
        base_64: d.attributes.base64,
        type: "pdf",
      })
    }
    for (const d of docs) {
      toReturn.push({
        name: d.attributes.document_type,
        base_64: d.attributes.base64,
        type: "pdf",
      })
    }

    return toReturn
  }

  async createFulfillment(
    methodData,
    fulfillmentItems,
    fromOrder,
    fulfillment
  ) {
    const existing =
      fromOrder.metadata && fromOrder.metadata.webshipper_order_id

    let webshipperOrder
    if (existing) {
      webshipperOrder = await this.client_.orders.retrieve(existing)
    }

    const { shipping_address } = fromOrder

    if (!webshipperOrder) {
      let invoice
      let certificateOfOrigin

      if (this.invoiceGenerator_) {
        const base64Invoice = await this.invoiceGenerator_.createInvoice(
          fromOrder,
          fulfillmentItems
        )

        if (base64Invoice) {
          invoice = await this.client_.documents
            .create({
              type: "documents",
              attributes: {
                document_size: this.options_.document_size || "A4",
                document_format: "PDF",
                base64: base64Invoice,
                document_type: "invoice",
              },
            })
            .catch((err) => {
              throw err
            })
        }

        const cooCountries = this.options_.coo_countries
        if (
          (cooCountries.includes("all") ||
            cooCountries.includes(
              shipping_address.country_code.toLowerCase()
            )) &&
          this.invoiceGenerator_.createCertificateOfOrigin
        ) {
          const base64Coo =
            await this.invoiceGenerator_.createCertificateOfOrigin(
              fromOrder,
              fulfillmentItems
            )

          certificateOfOrigin = await this.client_.documents
            .create({
              type: "documents",
              attributes: {
                document_size: this.options_.document_size || "A4",
                document_format: "PDF",
                base64: base64Coo,
                document_type: "certificate",
              },
            })
            .catch((err) => {
              throw err
            })
        }
      }

      const id = fulfillment.id
      let visible_ref = `${fromOrder.display_id}-${id.substr(id.length - 4)}`
      let ext_ref = `${fromOrder.id}.${fulfillment.id}`

      if (fromOrder.is_swap) {
        ext_ref = `${fromOrder.id}.${fulfillment.id}`
        visible_ref = `S-${fromOrder.display_id}`
      }

      const newOrder = {
        type: "orders",
        attributes: {
          status: "pending",
          ext_ref,
          visible_ref,
          order_lines: await Promise.all(
            fulfillmentItems.map(async (item) => {
              const totals = await this.totalsService_.getLineItemTotals(
                item,
                fromOrder,
                {
                  include_tax: true,
                  use_tax_lines: true,
                }
              )

              return {
                ext_ref: item.id,
                sku: item.variant.sku,
                description: item.title,
                quantity: item.quantity,
                country_of_origin:
                  item.variant.origin_country ||
                  item.variant.product.origin_country,
                tarif_number:
                  item.variant.hs_code || item.variant.product.hs_code,
                unit_price: humanizeAmount(
                  totals.unit_price,
                  fromOrder.currency_code
                ),
                vat_percent: totals.tax_lines.reduce(
                  (acc, next) => acc + next.rate,
                  0
                ),
              }
            })
          ),
          delivery_address: {
            att_contact: `${shipping_address.first_name} ${shipping_address.last_name}`,
            address_1: shipping_address.address_1,
            address_2: shipping_address.address_2,
            zip: shipping_address.postal_code,
            city: shipping_address.city,
            country_code: shipping_address.country_code.toUpperCase(),
            state: shipping_address.province,
            phone: shipping_address.phone,
            email: fromOrder.email,
            personal_customs_no:
              shipping_address.metadata?.personal_customs_no || null,
          },
          currency: fromOrder.currency_code.toUpperCase(),
        },
        relationships: {
          order_channel: {
            data: {
              id: this.options_.order_channel_id,
              type: "order_channels",
            },
          },
          shipping_rate: {
            data: {
              id: methodData.webshipper_id,
              type: "shipping_rates",
            },
          },
        },
      }

      if (methodData.require_drop_point) {
        newOrder.attributes.drop_point = {
          drop_point_id: methodData.drop_point_id,
          name: methodData.drop_point_name,
          zip: methodData.drop_point_zip,
          address_1: methodData.drop_point_address_1,
          city: methodData.drop_point_city,
          country_code: methodData.drop_point_country_code.toUpperCase(),
        }
      }

      if (invoice || certificateOfOrigin) {
        const docData = []
        if (invoice) {
          docData.push({
            id: invoice.data.id,
            type: invoice.data.type,
          })
        }

        if (certificateOfOrigin) {
          docData.push({
            id: certificateOfOrigin.data.id,
            type: certificateOfOrigin.data.type,
          })
        }

        newOrder.relationships.documents = {
          data: docData,
        }
      }

      return this.client_.orders
        .create(newOrder)
        .then((result) => {
          return result.data
        })
        .catch((err) => {
          this.logger_.warn(err.response)
          throw err
        })
    }
  }

  async handleWebhook(_, body) {
    const wsOrder = await this.retrieveRelationship(
      body.data.relationships.order
    )
    if (wsOrder.data && wsOrder.data.attributes.ext_ref) {
      const trackingLinks = body.data.attributes.tracking_links.map((l) => ({
        url: l.url,
        tracking_number: l.number,
      }))
      const [orderId, fulfillmentIndex] =
        wsOrder.data.attributes.ext_ref.split(".")

      if (orderId.charAt(0).toLowerCase() === "s") {
        if (fulfillmentIndex.startsWith("ful")) {
          return this.swapService_.createShipment(
            orderId,
            fulfillmentIndex,
            trackingLinks
          )
        } else {
          const swap = await this.swapService_.retrieve(orderId.substring(1), {
            relations: ["fulfillments"],
          })
          const fulfillment = swap.fulfillments[fulfillmentIndex]
          return this.swapService_.createShipment(
            swap.id,
            fulfillment.id,
            trackingLinks
          )
        }
      } else if (orderId.charAt(0).toLowerCase() === "c") {
        return this.claimService_.createShipment(
          orderId,
          fulfillmentIndex,
          trackingLinks
        )
      } else {
        if (fulfillmentIndex.startsWith("ful")) {
          return this.orderService_.createShipment(
            orderId,
            fulfillmentIndex,
            trackingLinks
          )
        } else {
          const order = await this.orderService_.retrieve(orderId, {
            relations: ["fulfillments"],
          })

          const fulfillment = order.fulfillments[fulfillmentIndex]
          if (fulfillment) {
            return this.orderService_.createShipment(
              order.id,
              fulfillment.id,
              trackingLinks
            )
          }
        }
      }
    }
  }

  /**
   * This plugin doesn't support shipment documents.
   */
  async retrieveDocuments(fulfillmentData, documentType) {
    switch (documentType) {
      case "label":
        const labelRelation = fulfillmentData?.relationships?.labels
        if (labelRelation) {
          const docs = await this.retrieveRelationship(labelRelation)
            .then(({ data }) => data)
            .catch((_) => [])

          return docs.map((d) => ({
            name: d.attributes.document_type,
            base_64: d.attributes.base64,
            type: "application/pdf",
          }))
        }
        return []

      case "invoice":
        const docRelation = fulfillmentData?.relationships?.documents
        if (docRelation) {
          const docs = await this.retrieveRelationship(docRelation)
            .then(({ data }) => data)
            .catch((_) => [])

          return docs.map((d) => ({
            name: d.attributes.document_type,
            base_64: d.attributes.base64,
            type: "application/pdf",
          }))
        }
        return []

      default:
        return []
    }
  }

  /**
   * Retrieves the documents associated with an order.
   * @return {Promise<Array<_>>} an array of document objects to store in the
   *   database.
   */
  async getFulfillmentDocuments(data) {
    const order = await this.client_.orders.retrieve(data.id)
    const docs = await this.retrieveRelationship(
      order.data.relationships.documents
    ).then((res) => res.data)
    return docs.map((d) => ({
      name: d.attributes.document_type,
      base_64: d.attributes.base64,
      type: "pdf",
    }))
  }

  async retrieveDropPoints(id, zip, countryCode, address1) {
    const points = await this.client_
      .request({
        method: "POST",
        url: `/v2/drop_point_locators`,
        data: {
          data: {
            type: "drop_point_locators",
            attributes: {
              shipping_rate_id: id,
              delivery_address: {
                zip,
                country_code: countryCode.toUpperCase(),
                address_1: address1,
              },
            },
          },
        },
      })
      .then(({ data }) => data)

    return points.attributes.drop_points
  }

  retrieveRelationship(relation) {
    const link = relation.links.related
    return this.client_.request({
      method: "GET",
      url: link,
    })
  }

  /**
   * Cancels a fulfillment. If the fulfillment has already been canceled this
   * is idemptotent. Can only cancel pending orders.
   * @param {object} data - the fulfilment data
   * @return {Promise<object>} the result of the cancellation
   */
  async cancelFulfillment(data) {
    if (Array.isArray(data)) {
      data = data[0]
    }

    const order = await this.client_.orders
      .retrieve(data.id)
      .catch(() => undefined)

    // if order does not exist, we resolve gracefully
    if (!order) {
      return Promise.resolve()
    }

    if (this.options_.delete_on_cancel) {
      return await this.client_.orders.delete(data.id)
    }

    return await this.client_.orders.update(data.id, {
      id: data.id,
      type: "orders",
      attributes: {
        status: "cancelled",
      },
    })
  }
}

export default WebshipperFulfillmentService
