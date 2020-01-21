import IdMap from "../../../../../helpers/id-map"
import { request } from "../../../../../helpers/test-request"

describe("POST /admin/products", () => {
  describe("successful creation", () => {
    it("calls mock function", async () => {
      const res = await request("POST", "/admin/products", {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
      expect(res.status).toEqual(200)
    })
  })
})
