import { IdMap } from "medusa-test-utils"
import RazorpayProviderService from "../razorpay-provider"
import { CustomerServiceMock } from "../../__mocks__/customer"
import { carts } from "../../__mocks__/cart"
import { TotalsServiceMock } from "../../__mocks__/totals"
import _ from "lodash"

const RegionServiceMock = {
  retrieve: jest.fn().mockReturnValue(Promise.resolve({})),
}
const api_key = "rzp_test_7Hu0soLWS2QJo7"
const api_key_secret="WODzfTDhSkEbagTzKnwH0W85"
describe("RazorpayProviderService", () => {
  describe("createCustomer", () => {
    const test_customer = {
      id: IdMap.getId("vvd"),
      first_name: "Virgil",
      last_name: "Van Dijk",
      email: "virg12@vvd12345687.com",
      password_hash: "1234",
      contact:"9876543210",
      notes: {},
      gstin:"37AADCS0472N1Z1"
    }
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const razorpayProviderService = new RazorpayProviderService(
        {
          customerService: CustomerServiceMock,
          regionService: RegionServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: api_key,
          api_key_secret:api_key_secret,


        }
      )
      result = await razorpayProviderService.createCustomer(_.cloneDeep(test_customer))
     // result = await razorpayProviderService.retrieveCustomer(test_customer._id)
      
    })

    it("returns created razorpay customer", () => {
      expect(result).toHaveProperty('created_at')
      expect(result).toMatchObject({ name: test_customer.name?.substring(0,50)??(((test_customer.first_name??"")+" "+(test_customer.last_name??"")).substring(0,50)),
      email: test_customer.email,
      contact:test_customer.contact,
      notes: {customer_id:expect.any(String),
        fullname:test_customer.name??((test_customer.first_name??"")+" "+(test_customer.last_name??""))},
      gstin:test_customer.gstin})
    })
    
  })

  describe("createOrder", () => {
    let result
    const razorpayProviderService = new RazorpayProviderService(
      {
        customerService: CustomerServiceMock,
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: api_key,
        api_key_secret:api_key_secret,
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("returns created razorpay payment intent for cart with existing customer", async () => {
      result = await razorpayProviderService.createOrder(carts.frCart)
      expect(result).toHaveProperty('created_at')
      expect(result).toHaveProperty('id')
      var attempts = result.attempts
      expect(attempts).toBeGreaterThanOrEqual(0)
      expect(result.offer_id===null||result.offer_id?.length>0).toBe(true)
      expect(result).toMatchObject( { 
        id: expect.any(String),
        entity: "order",
        amount: TotalsServiceMock.getTotal(carts.frCart),
        amount_paid: 0,
        amount_due:TotalsServiceMock.getTotal(carts.frCart),
        currency: "INR",
        receipt: carts.frCart.order_number,
        //offer_id: expect.toBe(null),
        status: "created",
        //attempts: expect.toBeGreaterThanOrEqual(0),
        notes: {cart_id:expect.any(String)},
        created_at: expect.any(Number)})
      
    })
  })

  describe("createPayment", () => {
    let result
    const razorpayProviderService = new RazorpayProviderService(
      {
        customerService: CustomerServiceMock,
        regionService: RegionServiceMock,
        totalsService: TotalsServiceMock,
      },
      {
        api_key: api_key,
          api_key_secret:api_key_secret,
      }
    )

    beforeEach(async () => {
      jest.clearAllMocks()
    })

  it("returns created razorpay payment intent for cart with no customer", async () => {
      carts.frCart.customer_id = ""
      result = await razorpayProviderService.createPayment(carts.frCart)
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 100,
      })
    })
  })

 /* describe("retrievePayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const razorpayProviderService = new RazorpayProviderService(
        {
          customerService: CustomerServiceMock,
          regionService: RegionServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: api_key,
          api_key_secret:api_key_secret,

        }
      )

      result = await razorpayProviderService.retrievePayment({
        payment_method: {
          data: {
            id: "pi_lebron",
          },
        },
      })
    })

    it("returns razorpay payment intent", () => {
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
      const razorpayProviderService = new RazorpayProviderService(
        {
          customerService: CustomerServiceMock,
          regionService: RegionServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: api_key,
          api_key_secret:api_key_secret,

        }
      )

      result = await razorpayProviderService.updatePayment(
        {
          id: "pi_lebron",
          amount: 800,
        },
        {
          total: 1000,
        }
      )
    })

    it("returns updated razorpay payment intent", () => {
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
      const razorpayProviderService = new RazorpayProviderService(
        {
          customerService: CustomerServiceMock,
          regionService: RegionServiceMock,
          totalsService: TotalsServiceMock,
        },
        {
          api_key: api_key,
          api_key_secret:api_key_secret,

        }
      )

      result = await razorpayProviderService.updatePaymentIntentCustomer(
        "pi_lebron",
        "cus_lebron_2"
      )
    })

    it("returns update razorpay payment intent", () => {
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron_2",
        amount: 1000,
      })
    })
  })

  describe("capturePayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const razorpayProviderService = new RazorpayProviderService(
        {},
        {
          api_key: api_key,
          api_key_secret:api_key_secret,

        }
      )

      result = await razorpayProviderService.capturePayment({
        data: {
          id: "pi_lebron",
          customer: "cus_lebron",
          amount: 1000,
        },
      })
    })

    it("returns captured razorpay payment intent", () => {
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron",
        amount: 1000,
        status: "succeeded",
      })
    })
  })

  describe("refundPayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const razorpayProviderService = new RazorpayProviderService(
        {},
        {
          api_key: api_key,
          api_key_secret:api_key_secret,

        }
      )

      result = await razorpayProviderService.refundPayment(
        {
          data: {
            id: "re_123",
            payment_intent: "pi_lebron",
            amount: 1000,
            status: "succeeded",
          },
        },
        1000
      )
    })

    it("returns refunded razorpay payment intent", () => {
      expect(result).toEqual({
        id: "re_123",
        payment_intent: "pi_lebron",
        amount: 1000,
        status: "succeeded",
      })
    })
  })

  describe("cancelPayment", () => {
    let result
    beforeAll(async () => {
      jest.clearAllMocks()
      const razorpayProviderService = new RazorpayProviderService(
        {},
        {
          api_key: api_key,
          api_key_secret:api_key_secret,

        }
      )

      result = await razorpayProviderService.cancelPayment({
        data: {
          id: "pi_lebron",
          customer: "cus_lebron",
          status: "cancelled",
        },
      })
    })

    it("returns cancelled razorpay payment intent", () => {
      expect(result).toEqual({
        id: "pi_lebron",
        customer: "cus_lebron",
        status: "cancelled",
      })
    })
  })*/
 
})
