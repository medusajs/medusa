import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"
import {
  shippingOptionsDefaultFields,
  shippingOptionsDefaultRelations,
} from "../index"

describe("GET /admin/shipping-options", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/shipping-options`, {
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

    it("calls service retrieve", () => {
      expect(ShippingOptionServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(ShippingOptionServiceMock.listAndCount).toHaveBeenCalledWith(
        {},
        {
          order: { created_at: "DESC" },
          select: shippingOptionsDefaultFields,
          relations: shippingOptionsDefaultRelations,
          skip: 0,
          take: 50,
        }
      )
    })
  })
})
