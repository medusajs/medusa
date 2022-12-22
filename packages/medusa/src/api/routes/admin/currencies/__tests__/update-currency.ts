import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { currency, CurrencyServiceMock } from "../../../../../services/__mocks__/currency";
import TaxInclusivePricingFeatureFlag from "../../../../../loaders/feature-flags/tax-inclusive-pricing";

describe("POST /admin/currencies/:code", () => {
  let subject
  const code = IdMap.getId("currency-1")

  beforeAll(async () => {
    subject = await request(
        "POST",
        `/admin/currencies/${code}`,
        {
          payload: {
            includes_tax: true,
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
          flags: [TaxInclusivePricingFeatureFlag],
        }
      )
  })

  it("returns 200", () => {
    expect(subject.status).toEqual(200)
  })

  it("returns updated currency", () => {
    expect(subject.body.currency).toEqual({
      ...currency,
      includes_tax: true,
    })
  })

  it("calls service update", () => {
    expect(CurrencyServiceMock.update).toHaveBeenCalledTimes(1)
    expect(CurrencyServiceMock.update).toHaveBeenCalledWith(
      code,
      {
        includes_tax: true,
      }
    )
  })
})
