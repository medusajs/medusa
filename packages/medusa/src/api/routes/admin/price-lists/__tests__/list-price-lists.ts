import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("GET /price-lists", () => {
  describe("successfully lists price lists", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/price-lists`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls PriceListService listAndCount", () => {
      expect(PriceListServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.listAndCount).toHaveBeenCalledWith(
        {
          created_at: undefined,
          deleted_at: undefined,
          description: undefined,
          id: undefined,
          name: undefined,
          q: undefined,
          status: undefined,
          type: undefined,
          updated_at: undefined,
        },
        { order: { created_at: "DESC" }, relations: [], skip: 0, take: 10 }
      )
    })
  })
})
