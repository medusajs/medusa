import EventBusService from "../services/event-bus"
import { CartService, PaymentProviderService } from "../services"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  eventBusService: EventBusService
  cartService: CartService
  paymentProviderService: PaymentProviderService
  manager: EntityManager
}

class CartSubscriber {
  protected readonly manager_: EntityManager
  protected readonly cartService_: CartService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly eventBus_: EventBusService

  constructor({
    manager,
    cartService,
    paymentProviderService,
    eventBusService,
  }: InjectedDependencies) {
    this.cartService_ = cartService
    this.paymentProviderService_ = paymentProviderService
    this.eventBus_ = eventBusService
    this.manager_ = manager

    this.eventBus_.subscribe(
      CartService.Events.CUSTOMER_UPDATED,
      async (cartId) => {
        await this.onCustomerUpdated(cartId)
      }
    )
  }

  async onCustomerUpdated(cartId) {
    await this.manager_.transaction(
      "SERIALIZABLE",
      async (transactionManager) => {
        const cart = await this.cartService_
          .withTransaction(transactionManager)
          .retrieveWithTotals(cartId, {
            relations: [
              "billing_address",
              "region",
              "region.payment_providers",
              "payment_sessions",
              "customer",
            ],
          })

        if (!cart.payment_sessions?.length) {
          return
        }

        const paymentProviderServiceTx =
          this.paymentProviderService_.withTransaction(transactionManager)

        return await Promise.all(
          cart.payment_sessions.map(async (paymentSession) => {
            return paymentProviderServiceTx.updateSession(paymentSession, cart)
          })
        )
      }
    )
  }
}

export default CartSubscriber
