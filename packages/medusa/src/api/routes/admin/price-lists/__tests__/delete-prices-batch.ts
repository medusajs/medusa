import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("DELETE /price-lists/:id/prices/batch", () => {
  describe("successfully adds several new prices to a price list", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/price-lists/pl_1234/prices/batch`,
        {
          payload: {
            price_ids: ["price_1234", "price_1235", "price_1236", "price_1237"],
          },
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

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls PriceListService addPrices", () => {
      expect(PriceListServiceMock.deletePrices).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.deletePrices).toHaveBeenCalledWith(
        "pl_1234",
        ["price_1234", "price_1235", "price_1236", "price_1237"]
      )
    })
  })

  describe("fails if no prices were provided", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/price-lists/pl_1234/prices/batch`,
        {
          payload: {},
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

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns descriptive error that price_ids is missing", () => {
      expect(subject.body.type).toEqual("invalid_data")
      expect(subject.body.message).toEqual(
        "each value in price_ids must be a string, price_ids should not be empty"
      )
    })
  })
})
