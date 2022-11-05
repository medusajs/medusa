import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductTypeServiceMock } from "../../../../../services/__mocks__/product-type"

describe("GET /admin/product-types", () => {
  describe("successful retrieval", () => {
    let subject

    beforeAll(async () => {
      jest.clearAllMocks()
      subject = await request("GET", `/admin/product-types`, {
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

    it("calls product type service list", () => {
      expect(ProductTypeServiceMock.listAndCount).toHaveBeenCalledTimes(1)
    })
  })
})
