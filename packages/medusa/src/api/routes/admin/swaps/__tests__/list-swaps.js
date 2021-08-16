import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { SwapServiceMock } from "../../../../../services/__mocks__/swap"

const defaultListOptions = {
  take: 50,
  skip: 0,
  order: { created_at: "DESC" },
}

describe("GET /admin/swaps/", () => {
  describe("successfully lists swaps", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/admin/swaps/`, {
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

    it("calls swapService list with default pagination and sorting options", () => {
      expect(SwapServiceMock.list).toHaveBeenCalledTimes(1)
      expect(SwapServiceMock.list).toHaveBeenCalledWith(
        {},
        {
          ...defaultListOptions,
        }
      )
    })

    it("returns swaps", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body.count).toBe(2)
      expect(subject.body.swaps).toEqual([
        { id: IdMap.getId("test-swap") },
        { id: IdMap.getId("test-swap-1") },
      ])
    })
  })
})
