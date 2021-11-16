import { request } from "../../../../../helpers/test-request"
import { SearchServiceMock } from "../../../../../services/__mocks__/search"

describe("GET /store/products/search", () => {
  describe("searches for products", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })

    it("validates the request", async () => {
      const response = await request("POST", "/store/products/search", {
        payload: {
          q: "test",
          limit: 10,
          offset: 0,
          filter: { type: "shirts" },
          wildcard: "whuhuu",
        },
      })
      expect(SearchServiceMock.search).toHaveBeenCalledTimes(1)
      expect(response.status).toEqual(200)
    })

    it("fails to validates the request", async () => {
      const response = await request("POST", "/store/products/search", {
        payload: {
          q: 423,
          limit: "10 pieces",
          offset: "from the start",
          filter: { type: "shirts" },
          wildcard: "whuhuu",
        },
      })

      expect(response.body.type).toEqual("invalid_data")
      expect(response.body.message).toEqual(
        "q must be a string, offset must be a number conforming to the specified constraints, limit must be a number conforming to the specified constraints"
      )
      expect(response.status).toEqual(400)
    })
  })
})
