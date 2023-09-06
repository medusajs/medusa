import { CartService, OrderService, SwapService } from '@medusajs/medusa'

import { PaypalWebhookEvents } from "../../core";

class WebhookEventHandler {
  handle(event_type, req, res) {
    switch(event_type) {
      case PaypalWebhookEvents.PAYMENT_AUTHORIZATION_CREATED:
        return this.handlePaymentAuthorizationCreated(req, res);
      case PaypalWebhookEvents.PAYMENT_CAPTURE_COMPLETED:
        return this.handlePaymentCaptureCompleted(req, res);
      default:
        console.log(`Unhandled event type: ${event_type}`);
        res.sendStatus(501)
        return res
    }
  }

  async handlePaymentAuthorizationCreated(req, res) {
    return this.handlePayment(req, res, false)
  }

  async handlePaymentCaptureCompleted(req, res) {
    return this.handlePayment(req, res, true)
  }

  async handlePayment(req, res, capture) {
    const { custom_id } = req.body.resource  
    try {
      if (custom_id.startsWith("paycol")) {
        await this.authorizePaymentCollection(req, custom_id)
      } else {
        await this.authorizeCart(req, res, custom_id, capture)
      }
  
      res.sendStatus(200)
    } catch (err) {
      console.error(err)
      res.sendStatus(409)
    }
    return res
  }

  async authorizeCart(req, res, cartId, capture) {
    const manager = req.scope.resolve("manager")
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
            await orderService.withTransaction(m).createFromCart(cartId)
            order = await orderService
              .withTransaction(m)
              .retrieveByCartId(cartId)
              .catch((_) => undefined)
          }
          if (!order?.id) {
            res.sendStatus(404)
            return res
          } 
          await cartService
            .withTransaction(m)
            .setPaymentSession(cartId, "paypal")
          await cartService.withTransaction(m).authorizePayment(cartId)
          if (capture) {
            await orderService.withTransaction(m).capturePayment(order.id)
          }
          break
        }
      }
    })
  }

  async authorizePaymentCollection(req, id) {
    const manager = req.scope.resolve("manager")
    const paymentCollectionService = req.scope.resolve(
      "paymentCollectionService"
    )

    await manager.transaction(async (manager) => {
      await paymentCollectionService.withTransaction(manager).authorize(id)
    })
  }

}

export const webhookEventHandler = new WebhookEventHandler();