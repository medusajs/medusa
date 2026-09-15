import { MedusaError } from "@medusajs/framework/utils"
import { throwIfCountryCodeChanged } from "../order-validation"

describe("throwIfCountryCodeChanged", () => {
  it("should not throw when existing address is undefined or has no country_code", () => {
    expect(() =>
      throwIfCountryCodeChanged({
        existingAddress: undefined,
        inputAddress: { country_code: "us" },
      })
    ).not.toThrow()

    expect(() =>
      throwIfCountryCodeChanged({
        existingAddress: { country_code: undefined },
        inputAddress: { country_code: "us" },
      })
    ).not.toThrow()
  })

  it("should not throw when input address has no country_code", () => {
    expect(() =>
      throwIfCountryCodeChanged({
        existingAddress: { country_code: "us" },
        inputAddress: undefined,
      })
    ).not.toThrow()

    expect(() =>
      throwIfCountryCodeChanged({
        existingAddress: { country_code: "us" },
        inputAddress: { country_code: undefined },
      })
    ).not.toThrow()
  })

  it("should not throw when existing and input country_codes match", () => {
    expect(() =>
      throwIfCountryCodeChanged({
        existingAddress: { country_code: "us" },
        inputAddress: { country_code: "us" },
      })
    ).not.toThrow()
  })

  it("should throw MedusaError INVALID_DATA when changing existing country_code to a different value", () => {
    expect(() =>
      throwIfCountryCodeChanged({
        existingAddress: { country_code: "us" },
        inputAddress: { country_code: "ca" },
      })
    ).toThrow(
      new MedusaError(MedusaError.Types.INVALID_DATA, "Country code cannot be changed")
    )
  })
})
