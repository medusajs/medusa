import { MedusaPaymentsProvider } from "../medusa-payments"

describe("MedusaPaymentsProvider#handleStripeError", () => {
  // handleStripeError does not touch instance state for the abort/timeout path, so we can exercise
  // it without constructing the provider (which would require valid options + a Stripe client).
  const provider = Object.create(
    MedusaPaymentsProvider.prototype
  ) as MedusaPaymentsProvider

  it("retries a request that timed out via AbortSignal.timeout()", () => {
    const timeoutError = new DOMException("The operation timed out.", "TimeoutError")
    expect(provider.handleStripeError(timeoutError as any)).toEqual({ retry: true })
  })

  it("retries a request that was aborted", () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError")
    expect(provider.handleStripeError(abortError as any)).toEqual({ retry: true })
  })
})
