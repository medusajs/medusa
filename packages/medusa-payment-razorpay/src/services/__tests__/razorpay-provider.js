import { IdMap } from "medusa-test-utils"
import RazorpayProviderService from "../razorpay-provider"
import { CustomerServiceMock } from "../../__mocks__/customer"
import { carts } from "../../__mocks__/cart"
import { TotalsServiceMock } from "../../__mocks__/totals"
import _ from "lodash"

const _validateSignature = function (razorpay_payment_id,razorpay_order_id,secret_key)
  {
    
      let crypto = require("crypto");
      let body = razorpay_order_id + "|" + razorpay_payment_id
      let expectedSignature = crypto.createHmac('sha256', secret_key)
                                  .update(body.toString())
                                  .digest('hex');
     //                             console.log("sig received " ,razorpay_signature);
     //                             console.log("sig generated " ,expectedSignature);
     return expectedSignature 
  }

const RegionServiceMock = {
  retrieve: jest.fn().mockReturnValue(Promise.resolve({currency_code:"INR"})),
}
const api_key = "WWW"
const api_key_secret="XXX"
describe("RazorpayProviderService", () => {
  describe("createCustomer", () => {
    const test_customer = {
      id: IdMap.getId("vvd"),
      first_name: "Virgil",
      last_name: "Van Dijk",
      email: "virg@vvd.com",
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
        notes: {cart_id:expect.any(String),customer_id:expect.any(String)},
        created_at: expect.any(Number)})
      
    
    })
  })

  describe("retrievePayment", () => {
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
               id: "order_ABCD",
      })
    })

    it("returns razorpay payment intent", () => {
      expect(result).toMatchObject( { 
        id: "order_ABCD"
      })
    })
  })
  /**razorpay only allows you to update the payment order notes, nothing else */
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
          id: "order_ABCD",
        },
        {
          total: 1000,
        }
      )
    })

    it("returns updated razorpay payment intent", () => {
      expect(result).toMatchObject({
        id: expect.any(String),
        amount: expect.any(Number),
        notes:expect.any(Object),
      })
    })
  })

/*  describe("updatePaymentIntentCustomer", () => {
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
*/
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
          notes:{
            razorpay_payment_id:"pay_JFbzW5PV980gUH",
            razorpay_order_id:"order_JFapRWBCWCR3bx",
            razorpay_signature:_validateSignature("pay_JFbzW5PV980gUH","order_JFapRWBCWCR3bx",api_key_secret)
          },          
        },
      })
    })

    it("returns captured razorpay payment intent", () => {
      expect(result).toMatchObject({
        status: "captured",
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
            order_id: "order_JFapRWBCWCR3bx",
          },
        },
        1000
        ,"normal"
      )
    })

    it("returns refunded razorpay payment intent", () => {
      expect(result).toMatchObject({
        id:expect.any(String),
        payment_id:expect.any(String),
        entity: "refund",
        status: "processed",
      })
    })
  })

  /*describe("cancelPayment", () => {
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
