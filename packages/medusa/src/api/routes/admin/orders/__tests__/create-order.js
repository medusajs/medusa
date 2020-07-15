import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import {
  orders,
  OrderServiceMock,
} from "../../../../../services/__mocks__/order"

describe("POST /admin/orders", () => {
  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/orders", {
        payload: {
          email: "virgil@vandijk.dk",
          billing_address: {
            first_name: "Virgil",
            last_name: "Van Dijk",
            address_1: "24 Dunks Drive",
            city: "Los Angeles",
            country_code: "US",
            province: "CA",
            postal_code: "93011",
            phone: "+1 (222) 333 4444",
          },
          shipping_address: {
            first_name: "Virgil",
            last_name: "Van Dijk",
            address_1: "24 Dunks Drive",
            city: "Los Angeles",
            country_code: "US",
            province: "CA",
            postal_code: "93011",
            phone: "+1 (222) 333 4444",
          },
          items: [
            {
              _id: IdMap.getId("existingLine"),
              title: "merge line",
              description: "This is a new line",
              thumbnail: "test-img-yeah.com/thumb",
              content: {
                unit_price: 123,
                variant: {
                  _id: IdMap.getId("can-cover"),
                },
                product: {
                  _id: IdMap.getId("validId"),
                },
                quantity: 1,
              },
              quantity: 10,
            },
          ],
          region: IdMap.getId("testRegion"),
          customer_id: IdMap.getId("testCustomer"),
          payment_method: {
            provider_id: "default_provider",
            data: {},
          },
          shipping_method: [
            {
              provider_id: "default_provider",
              profile_id: IdMap.getId("validId"),
              price: 123,
              data: {},
              items: [],
            },
          ],
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService create", () => {
      expect(OrderServiceMock.create).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.create).toHaveBeenCalledWith({
        email: "virgil@vandijk.dk",
        billing_address: {
          first_name: "Virgil",
          last_name: "Van Dijk",
          address_1: "24 Dunks Drive",
          city: "Los Angeles",
          country_code: "US",
          province: "CA",
          postal_code: "93011",
          phone: "+1 (222) 333 4444",
        },
        shipping_address: {
          first_name: "Virgil",
          last_name: "Van Dijk",
          address_1: "24 Dunks Drive",
          city: "Los Angeles",
          country_code: "US",
          province: "CA",
          postal_code: "93011",
          phone: "+1 (222) 333 4444",
        },
        items: [
          {
            _id: IdMap.getId("existingLine"),
            title: "merge line",
            description: "This is a new line",
            thumbnail: "test-img-yeah.com/thumb",
            content: {
              unit_price: 123,
              variant: {
                _id: IdMap.getId("can-cover"),
              },
              product: {
                _id: IdMap.getId("validId"),
              },
              quantity: 1,
            },
            quantity: 10,
          },
        ],
        region: IdMap.getId("testRegion"),
        customer_id: IdMap.getId("testCustomer"),
        payment_method: {
          provider_id: "default_provider",
          data: {},
        },
        shipping_method: [
          {
            provider_id: "default_provider",
            profile_id: IdMap.getId("validId"),
            price: 123,
            data: {},
            items: [],
          },
        ],
      })
    })
  })
})
