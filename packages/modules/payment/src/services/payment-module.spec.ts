import PaymentModuleService from "./payment-module"

class TestPaymentModuleService extends PaymentModuleService {
  public testRoundToCurrencyPrecision(amount: any, currencyCode: string) {
    return this.roundToCurrencyPrecision(amount, currencyCode)
  }
}

describe("roundToCurrencyPrecision", () => {
  it("handles zero-decimal currencies correctly", () => {
    const service = Object.create(
      TestPaymentModuleService.prototype
    ) as TestPaymentModuleService

    const result = service.testRoundToCurrencyPrecision(123.45, "JPY")

    expect(result.toString()).toBe("123")
  })
})