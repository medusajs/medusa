import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SwapServiceMock } from "../../../../../services/__mocks__/swap"

const defaultRelations = [
  "order",
  "additional_items",
  "return_order",
  "fulfillments",
  "payment",
  "shipping_address",
  "shipping_methods",
  "cart",
]

const defaultFields = [
  "id",
  "fulfillment_status",
  "payment_status",
  "order_id",
  "difference_due",
  "cart_id",
  "created_at",
  "updated_at",
  "metadata",
  "cart.subtotal",
  "cart.tax_total",
  "cart.shipping_total",
  "cart.discount_total",
  "cart.gift_card_total",
  "cart.total",
]

describe("GET /admin/swaps/:id", () => {
  describe("successfully gets a swap", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/swaps/${IdMap.getId("test-swap")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls swapService retrieve", () => {
      expect(SwapServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(SwapServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("test-swap"),
        {
          select: defaultFields,
          relations: defaultRelations,
        }
      )
    })

    it("returns swap", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.swap.id).toEqual("test-swap")
    })
  })
})
