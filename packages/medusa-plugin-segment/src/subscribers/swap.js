class OrderSubscriber {
  constructor({
    segmentService,
    eventBusService,
    swapService,
    orderService,
    cartService,
    claimService,
    returnService,
    fulfillmentService,
  }) {
    this.orderService_ = orderService

    this.cartService_ = cartService

    this.returnService_ = returnService

    this.claimService_ = claimService

    this.fulfillmentService_ = fulfillmentService


    // Swaps 
    // order.swap_received <--- Will be deprecated
    // swap.created
    // swap.received
    // swap.shipment_created
    // swap.payment_completed
    // swap.payment_captured
    // swap.refund_processed

    eventBusService.subscribe("order.swap_received", async ({ id, swap_id }) => {
      const swap = await swapService
    })

  }
}

export default OrderSubscriber
