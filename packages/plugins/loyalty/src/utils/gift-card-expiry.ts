/**
 * A gift card is expired once its `expires_at` timestamp is in the past.
 * Cards with no `expires_at` never expire. An unparseable timestamp is treated
 * as "not expired" so bad data never silently voids a card.
 */
export function isGiftCardExpired(
  giftCard: { expires_at?: string | Date | null },
  now: Date = new Date()
): boolean {
  if (!giftCard.expires_at) {
    return false;
  }

  const expiry = new Date(giftCard.expires_at);
  if (Number.isNaN(expiry.getTime())) {
    return false;
  }

  return expiry.getTime() <= now.getTime();
}
