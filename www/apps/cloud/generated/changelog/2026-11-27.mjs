/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-27",
  title: "Manage payment methods",
  summary:
    "Medusa Payments accounts and test accounts can now choose the payment methods their storefronts offer at checkout.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795787910/Cloud%20Changelog/nov-27-6d1393.png",
  content: `- You can now turn payment methods, such as Apple Pay, Google Pay, iDEAL, and Klarna, on or off for your Medusa Payments account from the new **Payments** > **Payment methods** page in the sidebar. Refer to [Payment Accounts](/payments/accounts#manage-payment-methods) for more details.
- Environments' test accounts have a **Payment methods** tab on the environment's **Payments** page, so you can try out payment methods in test mode. Refer to [Set up Medusa Payments in Environments](/payments/environments#manage-test-payment-methods) for more details.
- Medusa registers the domains of storefronts deployed on Cloud with your payment accounts, so Apple Pay and Google Pay show at checkout. Refer to [Payment Accounts](/payments/accounts#payment-methods-in-your-storefront) for more details.`,
}
