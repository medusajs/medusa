import EventBusService from "../services/event-bus"
import { CartService } from "../services"
import { EntityManager } from "typeorm"

type InjectedDependencies = {
  eventBusService: EventBusService
  cartService: CartService
  manager: EntityManager
}

class CartSubscriber {
  protected readonly manager_: EntityManager
  protected readonly cartService_: CartService
  protected readonly eventBus_: EventBusService

  constructor({ manager, cartService, eventBusService }: InjectedDependencies) {
    this.cartService_ = cartService
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
        const cartServiceTx =
          this.cartService_.withTransaction(transactionManager)

        const cart = await cartServiceTx.retrieve(cartId, {
          relations: ["payment_sessions"],
        })

        if (!cart.payment_sessions?.length) {
          return
        }

        return await cartServiceTx.setPaymentSessions(cart.id)
      }
    )
  }
}

export default CartSubscriber
