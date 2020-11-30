import { IdMap } from "medusa-test-utils"
import { carts, CartServiceMock } from "../../__mocks__/cart"
import { CustomerServiceMock } from "../../__mocks__/customer"
import { StripeProviderServiceMock } from "../../services/__mocks__/stripe-provider"
import { EventBusServiceMock } from "../../__mocks__/eventbus"
import CartSubscriber from "../cart"

describe("CartSubscriber", () => {
  describe("onCustomerUpdated", () => {
    let cartSubcriber = new CartSubscriber({
      eventBusService: EventBusServiceMock,
      cartService: CartServiceMock,
      stripeProviderService: StripeProviderServiceMock,
      customerService: CustomerServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("resolves on non-existing payment data", async () => {
      await cartSubcriber.onCustomerUpdated(carts.emptyCart)

      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(0)
    })

    it("cancels old and creates new payment intent with the updated existing customer", async () => {
      await cartSubcriber.onCustomerUpdated(carts.frCart)

      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("lebron")
      )

      expect(StripeProviderServiceMock.retrievePayment).toHaveBeenCalledTimes(1)
      expect(StripeProviderServiceMock.retrievePayment).toHaveBeenCalledWith(
        carts.frCart.payment_sessions[0].data
      )

      expect(StripeProviderServiceMock.cancelPayment).toHaveBeenCalledTimes(1)
      expect(StripeProviderServiceMock.cancelPayment).toHaveBeenCalledWith({
        id: "pi",
        customer: "cus_123456789",
      })

      expect(StripeProviderServiceMock.createPayment).toHaveBeenCalledTimes(1)
      expect(StripeProviderServiceMock.createPayment).toHaveBeenCalledWith(
        carts.frCart
      )

      expect(CartServiceMock.updatePaymentSession).toHaveBeenCalledTimes(1)
      expect(CartServiceMock.updatePaymentSession).toHaveBeenCalledWith(
        IdMap.getId("fr-cart"),
        "stripe",
        {
          id: "pi_new",
          customer: "cus_123456789_new",
        }
      )
    })

    it("cancels old and creates new payment intent and creates new stripe customer", async () => {
      await cartSubcriber.onCustomerUpdated(carts.frCartNoStripeCustomer)

      expect(CustomerServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(CustomerServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("vvd")
      )

      expect(StripeProviderServiceMock.retrievePayment).toHaveBeenCalledTimes(1)
      expect(StripeProviderServiceMock.retrievePayment).toHaveBeenCalledWith(
        carts.frCartNoStripeCustomer.payment_sessions[0].data
      )

      expect(StripeProviderServiceMock.createCustomer).toHaveBeenCalledTimes(1)
      expect(StripeProviderServiceMock.createCustomer).toHaveBeenCalledWith({
        _id: IdMap.getId("vvd"),
        first_name: "Virgil",
        last_name: "Van Dijk",
        email: "virg@vvd.com",
        password_hash: "1234",
        metadata: {},
      })

      expect(
        StripeProviderServiceMock.updatePaymentIntentCustomer
      ).toHaveBeenCalledTimes(1)
      expect(
        StripeProviderServiceMock.updatePaymentIntentCustomer
      ).toHaveBeenCalledWith("cus_123456789_new_vvd")
    })
  })
})
