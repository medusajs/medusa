import { describe, expect, it } from "vitest"
import { FetchError } from "@medusajs/js-sdk"

/**
 * Tests for the location error classification logic used in the
 * Fulfillment component to distinguish deleted stock locations (404)
 * from other errors (network, 500, 403, etc.).
 *
 * The component uses:
 *   const isLocationDeleted = isError && (error as FetchError)?.status === 404
 *
 * - When isLocationDeleted is true, it renders t("orders.fulfillment.locationDeleted")
 * - When isError is true but not 404, it renders t("orders.fulfillment.locationUnavailable")
 * - When stock_location exists, it renders the location name as a link
 * - Otherwise, it renders a loading skeleton
 */

// Extract the same logic from the component for direct unit testing
const isLocationDeleted = (isError: boolean, error: unknown): boolean => {
  return isError && (error as FetchError)?.status === 404
}

describe("Order Fulfillment Section - Location Error Handling", () => {
  it("should identify a 404 error as a deleted location", () => {
    const error = new FetchError("Not Found", "Not Found", 404)
    expect(isLocationDeleted(true, error)).toBe(true)
  })

  it("should not treat a 500 error as a deleted location", () => {
    const error = new FetchError("Internal Server Error", "Internal Server Error", 500)
    expect(isLocationDeleted(true, error)).toBe(false)
  })

  it("should not treat a 403 error as a deleted location", () => {
    const error = new FetchError("Forbidden", "Forbidden", 403)
    expect(isLocationDeleted(true, error)).toBe(false)
  })

  it("should not treat a network error as a deleted location", () => {
    const error = new Error("Network Error")
    expect(isLocationDeleted(true, error)).toBe(false)
  })

  it("should return false when isError is false", () => {
    const error = new FetchError("Not Found", "Not Found", 404)
    expect(isLocationDeleted(false, error)).toBe(false)
  })

  it("should return false when error is null", () => {
    expect(isLocationDeleted(true, null)).toBe(false)
  })

  it("should return false when error is undefined", () => {
    expect(isLocationDeleted(true, undefined)).toBe(false)
  })

  it("should return false when error has no status property", () => {
    const error = { message: "something went wrong" }
    expect(isLocationDeleted(true, error)).toBe(false)
  })
})
