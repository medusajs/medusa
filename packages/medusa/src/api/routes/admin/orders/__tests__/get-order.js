import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"
import { defaultAdminOrdersFields, defaultAdminOrdersRelations } from "../index"

describe("GET /admin/orders", () => {
  describe("successfully gets an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/orders/${IdMap.getId("test-order")}`,
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

    it("calls orderService retrieve", () => {
      expect(OrderServiceMock.retrieveWithTotals).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieveWithTotals).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        {
          // TODO [MEDUSA_FF_SALES_CHANNELS]: Remove when sales channel flag is removed entirely
          select: [...defaultAdminOrdersFields, "sales_channel_id"].filter(
            (field) => {
              return ![
                "shipping_total",
                "discount_total",
                "tax_total",
                "refunded_total",
                "total",
                "subtotal",
                "refundable_amount",
                "gift_card_total",
                "gift_card_tax_total",
              ].includes(field)
            }
          ),
          // TODO [MEDUSA_FF_SALES_CHANNELS]: Remove when sales channel flag is removed entirely
          relations: [...defaultAdminOrdersRelations, "sales_channel"],
        },
        {
          includes: undefined,
        }
      )
    })

    it("returns order", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.order.id).toEqual(IdMap.getId("test-order"))
    })
  })
})
