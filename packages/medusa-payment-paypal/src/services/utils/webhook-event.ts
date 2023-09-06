import { CartService, OrderService, SwapService } from '@medusajs/medusa'

import { PaypalWebhookEvents } from "../../core";

class WebhookEventHandler {
  handle(event_type, req, res) {
    switch(event_type) {
      case PaypalWebhookEvents.PAYMENT_CAPTURE_COMPLETED:
        return this.handlePaymentCaptureCompleted(req, res);
      default:
        res.sendStatus(501)
        console.log(`Unhandled event type: ${event_type}`);
    }
    return res
  }

  async handlePaymentCaptureCompleted(req, res) {
    const { resource_type, resource } = req.body
    const { final_capture, status, custom_id } = resource
    const shouldCapturePayment =
      final_capture &&
      resource_type === "capture" &&
      status === "COMPLETED" &&
      custom_id
    if (!shouldCapturePayment) {
      res.sendStatus(304)
      return res
    }
  
    const manager = req.scope.resolve("manager")

    async function authorizeCart(req, res, cartId) {
      const cartService: CartService = req.scope.resolve("cartService")
      const swapService: SwapService = req.scope.resolve("swapService")
      const orderService: OrderService = req.scope.resolve("orderService")
  
      await manager.transaction(async (m) => {
        const cart = await cartService.withTransaction(m).retrieve(cartId)
  
        switch (cart.type) {
          case "swap": {
            const swap = await swapService
              .withTransaction(m)
              .retrieveByCartId(cartId)
              .catch((_) => undefined)
  
            if (swap && swap.confirmed_at === null) {
              await cartService
                .withTransaction(m)
                .setPaymentSession(cartId, "paypal")
              await cartService.withTransaction(m).authorizePayment(cartId)
              await swapService.withTransaction(m).registerCartCompletion(swap.id)
            }
            break
          }
  
          default: {
            let order = await orderService
              .withTransaction(m)
              .retrieveByCartId(cartId)
              .catch((_) => undefined)
            if (!order) {
              await cartService.withTransaction(m).authorizePayment(cartId)
              await orderService.withTransaction(m).createFromCart(cartId)
              order = await orderService
                .withTransaction(m)
                .retrieveByCartId(cartId)
                .catch((_) => undefined)
            }
            if (!order?.id) {
              res.sendStatus(404)
            } else {
              await cartService
                .withTransaction(m)
                .setPaymentSession(cartId, "paypal")
              await orderService.withTransaction(m).capturePayment(order.id)
            }
            break
          }
        }
      })
    }
  
    async function authorizePaymentCollection(req, id) {
      const paymentCollectionService = req.scope.resolve(
        "paymentCollectionService"
      )
  
      await manager.transaction(async (manager) => {
        await paymentCollectionService.withTransaction(manager).authorize(id)
      })
    }
  
    try {
      if (custom_id.startsWith("paycol")) {
        await authorizePaymentCollection(req, custom_id)
      } else {
        await authorizeCart(req, res, custom_id)
      }
  
      res.sendStatus(200)
    } catch (err) {
      console.error(err)
      res.sendStatus(409)
    }
    return res
  }
}

export const webhookEventHandler = new WebhookEventHandler();