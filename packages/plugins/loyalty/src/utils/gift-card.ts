import { ModuleGiftCard } from "../types/loyalty";

/**
 * Checks whether a gift card has expired.
 *
 * A gift card with a `null` expiration date never expires. Otherwise, the
 * expiration date is compared against the current time. Both dates are
 * compared as UTC timestamps.
 *
 * @param giftCard - The gift card to check.
 * @returns Whether the gift card is expired.
 *
 * @example
 * if (isGiftCardExpired(giftCard)) {
 *   // the gift card can no longer be redeemed
 * }
 */
export function isGiftCardExpired(
  giftCard: Pick<ModuleGiftCard, "expires_at">
): boolean {
  if (!giftCard.expires_at) {
    return false;
  }

  return new Date(giftCard.expires_at).getTime() <= Date.now();
}
