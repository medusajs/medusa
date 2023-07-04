import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { currency, CurrencyServiceMock } from "../../../../../services/__mocks__/currency";
import TaxInclusivePricingFeatureFlag from "../../../../../loaders/feature-flags/tax-inclusive-pricing";

describe("GET /admin/currencies/", () => {
  describe("successfully list the currency", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/admin/currencies`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          flags: [TaxInclusivePricingFeatureFlag],
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls the listAndCount method from the currency service", () => {
      expect(CurrencyServiceMock.listAndCount).toHaveBeenCalledTimes(1)
      expect(CurrencyServiceMock.listAndCount).toHaveBeenCalledWith(
          {},
          {
            order: {},
            select: undefined,
            relations: [],
            skip: 0,
            take: 20
          }
      )
    })

    it("returns the expected currencies", () => {
      expect(subject.body).toEqual({
        currencies: [currency],
        offset: 0,
        limit: 20,
        count: 1,
      })
    })
  })
})
