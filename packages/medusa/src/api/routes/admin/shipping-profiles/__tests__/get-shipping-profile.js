import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"

const defaultFields = [
  "id",
  "name",
  "type",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

const defaultRelations = ["products", "shipping_options"]

describe("GET /admin/shipping-profiles/:profile_id", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/shipping-profiles/${IdMap.getId("validId")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls service retrieve", () => {
      expect(ShippingProfileServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(ShippingProfileServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("validId"),
        {
          select: defaultFields,
          relations: defaultRelations,
        }
      )
    })
  })
})
