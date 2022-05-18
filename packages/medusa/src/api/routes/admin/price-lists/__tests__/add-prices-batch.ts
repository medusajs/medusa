import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("POST /price-lists/:id/prices/batch", () => {
  describe("successfully adds several new prices to a price list", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/price-lists/pl_1234/prices/batch`,
        {
          payload: {
            prices: [
              {
                currency_code: "usd",
                amount: 500,
                min_quantity: 10,
                max_quantity: 20,
                variant_id: "variant_12",
              },
              {
                currency_code: "usd",
                amount: 430,
                min_quantity: 21,
                max_quantity: 40,
                variant_id: "variant_12",
              },
            ],
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
      expect(PriceListServiceMock.addPrices).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.addPrices).toHaveBeenCalledWith(
        "pl_1234",
        [
          {
            currency_code: "usd",
            amount: 500,
            min_quantity: 10,
            max_quantity: 20,
            variant_id: "variant_12",
          },
          {
            currency_code: "usd",
            amount: 430,
            min_quantity: 21,
            max_quantity: 40,
            variant_id: "variant_12",
          },
        ],
        undefined
      )
    })
  })

  describe("fails if no prices were provided", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
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

    it("returns descriptive error that name is missing", () => {
      expect(subject.body.type).toEqual("invalid_data")
      expect(subject.body.message).toEqual("prices must be an array")
    })
  })
})
