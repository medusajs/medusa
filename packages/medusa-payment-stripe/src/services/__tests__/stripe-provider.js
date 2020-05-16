import { IdMap } from "medusa-test-utils"
import StripeProviderService from "../stripe-provider"
import { CustomerServiceMock } from "../../__mocks__/customer"
import { carts } from "../../__mocks__/cart"
import { TotalsServiceMock } from "../../__mocks__/totals"

describe("StripeProviderService", () => {
  describe("createCustomer", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const stripeProviderService = new StripeProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: "test",
        }
      )

      result = await stripeProviderService.createCustomer({
        _id: IdMap.getId("vvd"),
        first_name: "Virgil",
        last_name: "Van Dijk",
        email: "virg@vvd.com",
        password_hash: "1234",
        metadata: {},
      })
    })

    it("returns created stripe customer", () => {
      expect(result).toEqual({
        id: "cus_vvd",
        email: "virg@vvd.com",
      })
    })
  })

  describe("createPayment", () => {
    let result
    const stripeProviderService = new StripeProviderService(
      {
        customerService: CustomerServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: "test",
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("returns created stripe payment intent for cart with existing customer", async () => {
      result = await stripeProviderService.createPayment(carts.frCart)
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_123456789_new",
        amount: 100,
      })
    })

    it("returns created stripe payment intent for cart with no customer", async () => {
      carts.frCart.customer_id = ""
      result = await stripeProviderService.createPayment(carts.frCart)
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 100,
      })
    })
  })

  describe("retrievePayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const stripeProviderService = new StripeProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: "test",
        }
      )

      result = await stripeProviderService.retrievePayment({
        payment_method: {
          data: {
            id: "pi_lebron",
          },
        },
      })
    })

    it("returns created stripe customer", () => {
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron",
      })
    })
  })

  describe("updatePayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const stripeProviderService = new StripeProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: "test",
        }
      )

      result = await stripeProviderService.updatePayment(
        {
          payment_method: {
            data: {
              id: "pi_lebron",
            },
          },
        },
        {
          amount: 1000,
        }
      )
    })

    it("returns updated payment intent", () => {
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000,
      })
    })
  })

  describe("updatePaymentIntentCustomer", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const stripeProviderService = new StripeProviderService(
        {
          customerService: CustomerServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: "test",
        }
      )

      result = await stripeProviderService.updatePaymentIntentCustomer(
        "pi_lebron",
        "cus_lebron_2"
      )
    })

    it("returns created stripe customer", () => {
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron_2",
        amount: 1000,
      })
    })
  })
})
