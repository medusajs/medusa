import { FulfillmentService } from "medusa-interfaces"
import Shipbob from "../utils/shipbob"

class ShipbobFulfillmentService extends FulfillmentService {
  static identifier = "shipbob"

  constructor({ logger, claimService, swapService, orderService }, options) {
    super()

    this.options_ = options

    /** @private @const {logger} */
    this.logger_ = logger

    /** @private @const {OrderService} */
    this.orderService_ = orderService

    /** @private @const {SwapService} */
    this.swapService_ = swapService

    /** @private @const {SwapService} */
    this.claimService_ = claimService

    /** @private @const {AxiosClient} */
    this.client_ = new Shipbob({
      account: this.options_.account,
      token: this.options_.api_token,
      channelId: this.options_.order_channel_id,
    })
  }

  async getFulfillmentOptions() {
    const shippingMethods = await this.client_.shippingMethods.list()

    return shippingMethods.data.map((shippingMethod) => ({
      ...shippingMethod,
      id: shippingMethod.name,
      shipbob_id: shippingMethod.id,
    }))
  }

  async validateFulfillmentData(_, data) {
    return data
  }

  async validateOption(data) {
    // ShipBob does not have an API to retrieve a Shipping Method by id,
    // therefore we have to query all Shipping Methods and filter manually
    const shippingMethods = await this.client_.shippingMethods
      .list()
      .catch(() => [])
    const shippingMethod = shippingMethods.data.find((shippingMethod) => shippingMethod.id === data.shipbob_id)
    return !!shippingMethod
  }

  canCalculate() {
    // Return whether or not we are able to calculate dynamically
    return false
  }

  calculatePrice() {
    // ShipBob can estimate prices, however it returns an array (for different Fulfillment Centers) instead of a single value.
    // The Create Orders API takes in a location_id field in the request body to select the Fulfillment Center to fulfill the order.
    // If not specified, ShipBob will determine the Fulfillment Center that fulfills this order.
  }

  async createFulfillment(
    methodData,
    fulfillmentItems,
    fromOrder,
    fulfillment,
  ) {
    const existing =
      fromOrder.metadata && fromOrder.metadata.shipbob_order_id
    if (existing) {
      const shipbobOrder = await this.client_.orders.retrieve(existing)
      if (shipbobOrder) {
        return undefined
      }
    }

    const { shipping_address } = fromOrder

    const id = fulfillment.id
    const order_number = fromOrder.is_swap ? `S-${fromOrder.display_id}` : `${fromOrder.display_id}-${id.substr(id.length - 4)}`
    const reference_id = fromOrder.is_swap ? `${fromOrder.id}.${fulfillment.id}` : `${fromOrder.id}.${fulfillment.id}`

    // mandatory field, supports "Parcel" | "Freight"
    // TODO: automatically determine by item length/height/weight?
    const carrier_type = 'Parcel'

    const newOrder = {
      shipping_method: methodData.id,
      recipient: {
        name: `${shipping_address.first_name} ${shipping_address.last_name}`,
        address: {
          type: 'MarkFor',
          address1: shipping_address.address_1,
          address2: shipping_address.address_2,
          company_name: shipping_address.company,
          city: shipping_address.city,
          state: shipping_address.province,
          country: shipping_address.country_code,
          zip_code: shipping_address.postal_code,
        },
        email: fromOrder.email,
        phone_number: shipping_address.phone,
      },
      products: fulfillmentItems.map((item) => {
        return {
          reference_id: item.id,
          name: item.title,
          quantity: item.quantity,
        }
      }),
      reference_id,
      order_number,
      purchase_date: fromOrder.created_at,
      shipping_terms: {
        carrier_type,
        payment_term: 'Prepaid',
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
      relations: [
        'fulfillments',
        'returns',
      ],
    })

    return fromOrder.fulfillments.flatMap((fulfillment) => {
      fulfillment.metadata.shipbob_shipments.map((shipbob_shipment) => {
        const returnShipment = {
          fulfillment_center: shipbob_shipment.location,
          // ShipBob has a one-to-many relationship between Orders and Shipments
          // A ShipBob Return is mapped to a Shipment, not an Order,
          // therefore the ID of the original Shipment is appended to the reference_id/tracking_number so that it is unique
          reference_id: `${fromOrder.id}.${returnOrder.id}.${shipbob_shipment.id}`,
          tracking_number: `R${fromOrder.display_id}-${fromOrder.returns.length + 1}-${shipbob_shipment.id}`,
          inventory: shipbob_shipment.products.flatMap((product) => product.inventory_items.map((inventory_item) => ({
            id: inventory_item.id,
            quantity: inventory_item.quantity,
          }))),
          original_shipment_id: shipbob_shipment.id,
        }
  
        return this.client_.returns
          .create(returnShipment)
          .then((result) => {
            return result.data
          })
          .catch((err) => {
            this.logger_.warn(err.response)
            throw err
          })
      })
    })
  }

  async cancelFulfillment(fulfillment) {
    const orderId = fulfillment.data.id
    const order = await this.client_.orders
      .retrieve(orderId)
      .catch(() => undefined)

    // if order does not exist, we resolve gracefully
    if (!order) {
      return Promise.resolve()
    }

    if (order.data.status === 'Cancelled') {
      return Promise.resolve(order)
    }

    return this.client_.orders.cancel(orderId)
  }

  async orderShipped(shipbobOrder) {
    const [orderId, fulfillmentIndex] = shipbobOrder.reference_id.split('.')
    const orderIdPrefix = orderId.charAt(0).toLowerCase()

    let createShipmentFn
    switch (orderIdPrefix) {
      case 's':
        if (fulfillmentIndex.startsWith('ful')) {
          createShipmentFn = (trackingLinks, config) => this.swapService_.createShipment(
            orderId,
            fulfillmentIndex,
            trackingLinks,
            config,
          )
        } else {
          const swap = await this.swapService_.retrieve(orderId.substring(1), {
            relations: ['fulfillments'],
          })
          const fulfillment = swap.fulfillments[fulfillmentIndex]
          createShipmentFn = (trackingLinks, config) => this.swapService_.createShipment(
            swap.id,
            fulfillment.id,
            trackingLinks,
            config,
          )
        }
        break
      case 'c':
        createShipmentFn = (trackingLinks, config) => this.claimService_.createShipment(
          orderId,
          fulfillmentIndex,
          trackingLinks,
          config,
        )
        break
      default:
        if (fulfillmentIndex.startsWith('ful')) {
          createShipmentFn = (trackingLinks, config) => this.orderService_.createShipment(
            orderId,
            fulfillmentIndex,
            trackingLinks,
            config,
          )
        } else {
          const order = await this.orderService_.retrieve(orderId, {
            relations: ['fulfillments'],
          })
          const fulfillment = order.fulfillments[fulfillmentIndex]
          if (fulfillment) {
            createShipmentFn = (trackingLinks, config) => this.orderService_.createShipment(
              order.id,
              fulfillment.id,
              trackingLinks,
              config,
            )
          } else {
            createShipmentFn = () => {}
          }
        }
        break
    }

    const trackingLinks = shipbobOrder.shipments.map((shipment) => {
      const tracking = shipment.tracking
      return {
        url: tracking.tracking_url,
        tracking_number: tracking.tracking_number,
        metadata: {
          ...tracking,
        },
      }
    })

    return createShipmentFn(trackingLinks, {
      metadata: {
        shipbob_shipments: shipbobOrder.shipments,  // required to return an order
      }
    })
  }
}

export default ShipbobFulfillmentService
