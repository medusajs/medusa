class OrderSubscriber {
  constructor({
    eventBusService,
    orderService,
    swapService,
    returnService,
    paymentProviderService,
    brightpearlService,
    claimService,
    fulfillmentService,
  }) {
    this.orderService_ = orderService
    this.brightpearlService_ = brightpearlService
    this.swapService_ = swapService
    this.returnService_ = returnService
    this.paymentProviderService_ = paymentProviderService
    this.fulfillmentService_ = fulfillmentService
    this.claimService_ = claimService

    eventBusService.subscribe("order.placed", this.sendToBrightpearl)

    eventBusService.subscribe(
      "brightpearl.goods_out_note",
      this.createFulfillmentFromGoodsOut
    )

    eventBusService.subscribe("claim.created", this.registerClaim)

    eventBusService.subscribe("order.refund_created", this.registerRefund)

    eventBusService.subscribe("order.items_returned", this.registerReturn)

    eventBusService.subscribe(
      "order.payment_captured",
      this.registerCapturedPayment
    )

    eventBusService.subscribe("order.shipment_created", this.registerShipment)
    eventBusService.subscribe("swap.shipment_created", this.registerShipment)
    eventBusService.subscribe("claim.shipment_created", this.registerShipment)

    // Before we initiate a swap we wait for the payment and the return
    eventBusService.subscribe(
      "swap.payment_completed",
      this.registerSwapPayment
    )
    eventBusService.subscribe("swap.received", this.registerSwap)
  }

  sendToBrightpearl = (data) => {
    return this.brightpearlService_.createSalesOrder(data.id)
  }

  registerCapturedPayment = ({ id }) => {
    return this.brightpearlService_.createPayment(id)
  }

  createFulfillmentFromGoodsOut = ({ id }) => {
    return this.brightpearlService_.createFulfillmentFromGoodsOut(id)
  }

  registerSwapPayment = async (data) => {
    return this.registerSwap({ id: data.id, swap_id: data.id })
  }

  registerSwap = async (data) => {
    const { id } = data

    if (!id) {
      return
    }

    const fromSwap = await this.swapService_.retrieve(id, {
      relations: [
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
        "return_order.shipping_method.tax_lines",
        "additional_items",
        "additional_items.tax_lines",
        "shipping_address",
        "shipping_methods",
        "shipping_methods.tax_lines",
      ],
    })
    const fromOrder = await this.orderService_.retrieve(fromSwap.order_id, {
      relations: ["payments", "region", "swaps", "discounts", "discounts.rule"],
    })

    if (
      !(
        fromSwap.confirmed_at !== null &&
        fromSwap.return_order.status === "received"
      )
    ) {
      return
    }

    await this.brightpearlService_.createSwapCredit(fromOrder, fromSwap)
    await this.brightpearlService_.createSwapOrder(fromOrder, fromSwap)
  }

  registerClaim = async (data) => {
    const { id } = data
    const fromClaim = await this.claimService_.retrieve(id, {
      relations: [
        "claim_items",
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
        "return_order.shipping_method.tax_lines",
        "additional_items",
        "additional_items.tax_lines",
        "shipping_address",
        "shipping_methods",
      ],
    })

    const fromOrder = await this.orderService_.retrieve(fromClaim.order_id, {
      relations: [
        "payments",
        "region",
        "claims",
        "discounts",
        "discounts.rule",
      ],
    })

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
      relations: ["discounts", "region", "swaps", "payments"],
    })

    const fromReturn = await this.returnService_.retrieve(return_id, {
      relations: ["items", "shipping_method", "shipping_method.tax_lines"],
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
