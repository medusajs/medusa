class VariantSubscriber {
  constructor({
    eventBusService,
    restockNotificationService,
    productVariantService,
  }) {
    this.restockNotificationService_ = restockNotificationService

    eventBusService.subscribe("product_variant.updated", this.handleVariantUpdate)
  }

  registerClaim = async (data) => {
    const { id } = data
    const fromClaim = await this.claimService_.retrieve(id, {
      relations: [
        "order",
        "order.payments",
        "order.region",
        "order.claims",
        "order.discounts",
        "claim_items",
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
        "additional_items",
        "shipping_address",
        "shipping_methods",
      ],
    })

    const fromOrder = fromClaim.order

    if (fromClaim.type === "replace") {
      await this.brightpearlService_.createClaim(fromOrder, fromClaim)
    } else if (fromClaim.type === "refund") {
      await this.brightpearlService_.createClaimCredit(fromOrder, fromClaim)
    }
  }

  registerShipment = async (data) => {
    const { fulfillment_id } = data
    const shipment = await this.fulfillmentService_.retrieve(fulfillment_id)
    const noteId = shipment.metadata.goods_out_note
    if (noteId) {
      await this.brightpearlService_.registerGoodsOutTrackingNumber(
        noteId,
        shipment
      )
      await this.brightpearlService_.registerGoodsOutShipped(noteId, shipment)
    }
  }

  registerReturn = async (data) => {
    const { id, return_id } = data

    const order = await this.orderService_.retrieve(id, {
      relations: ["region", "payments"],
    })

    const fromReturn = await this.returnService_.retrieve(return_id, {
      relations: ["items"],
    })

    return this.brightpearlService_
      .createSalesCredit(order, fromReturn)
      .catch((err) => console.log(err))
  }

  registerRefund = async (data) => {
    const { id, refund_id } = data
    const order = await this.orderService_.retrieve(id, {
      relations: ["region", "payments"],
    })
    const refund = await this.paymentProviderService_.retrieveRefund(refund_id)
    return this.brightpearlService_
      .createRefundCredit(order, refund)
      .catch((err) => console.log(err))
  }
}

export default OrderSubscriber
