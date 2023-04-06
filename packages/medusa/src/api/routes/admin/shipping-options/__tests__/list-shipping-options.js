import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingOptionServiceMock } from "../../../../../services/__mocks__/shipping-option"

const defaultFields = [
  "id",
  "name",
  "region_id",
  "profile_id",
  "provider_id",
  "price_type",
  "amount",
  "is_return",
  "admin_only",
  "data",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

const defaultRelations = ["region", "profile", "requirements"]

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
          select: defaultFields,
          relations: defaultRelations,
        }
      )
    })
  })
})
