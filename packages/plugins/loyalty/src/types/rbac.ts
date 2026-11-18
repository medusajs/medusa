export const LOYALTY_POLICY_RESOURCES = [
  "gift_card",
  "store_credit_account",
] as const

declare module "@medusajs/types" {
  interface PolicyResourceRegistry {
    gift_card: "gift_card"
    store_credit_account: "store_credit_account"
  }
}
