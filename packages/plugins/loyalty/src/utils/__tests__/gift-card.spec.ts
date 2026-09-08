import { isGiftCardExpired } from "../gift-card";

describe("isGiftCardExpired", () => {
  it("returns false when the gift card has no expiration date", () => {
    expect(isGiftCardExpired({ expires_at: null })).toBe(false);
  });

  it("returns false when the expiration date is in the future", () => {
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    expect(isGiftCardExpired({ expires_at })).toBe(false);
  });

  it("returns true when the expiration date is in the past", () => {
    const expires_at = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    expect(isGiftCardExpired({ expires_at })).toBe(true);
  });

  it("compares expiration dates in UTC regardless of the input's offset", () => {
    const past = new Date(Date.now() - 60 * 60 * 1000);
    // same instant, expressed with a non-UTC offset
    const expires_at = past.toISOString().replace("Z", "+00:00");

    expect(isGiftCardExpired({ expires_at })).toBe(true);
  });
});
