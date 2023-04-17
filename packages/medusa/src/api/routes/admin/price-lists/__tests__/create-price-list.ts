import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { PriceListServiceMock } from "../../../../../services/__mocks__/price-list"

describe("POST /price-lists", () => {
  describe("successfully creates a price list", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/price-lists`, {
        payload: {
          name: "My Price List",
          description: "testing",
          ends_at: "2022-03-14T08:28:38.551Z",
          starts_at: "2022-03-14T08:28:38.551Z",
          customer_groups: [
            {
              id: "gc_123",
            },
          ],
          type: "sale",
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
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls PriceListService addPrices", () => {
      expect(PriceListServiceMock.create).toHaveBeenCalledTimes(1)
      expect(PriceListServiceMock.create).toHaveBeenCalledWith({
        name: "My Price List",
        description: "testing",
        ends_at: "2022-03-14T08:28:38.551Z",
        starts_at: "2022-03-14T08:28:38.551Z",
        customer_groups: [
          {
            id: "gc_123",
          },
        ],
        type: "sale",
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
      })
    })
  })

  describe("fails if required fields are missing", () => {
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/price-lists`, {
        payload: {
          description: "bad payload",
        },
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

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })

    it("returns descriptive error that several fields are missing", () => {
      expect(subject.body.type).toEqual("invalid_data")
      expect(subject.body.message).toEqual(
        "name must be a string, type must be one of the following values: sale, override, prices must be an array"
      )
    })
  })
})
