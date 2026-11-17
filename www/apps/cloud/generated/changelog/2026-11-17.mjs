/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-17",
  title: "Redesigned environment payments with test mode",
  summary: "An environment's Payments page shows test and live accounts in one layout, with a toggle to switch the environment between test and live mode.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1794927600/Cloud%20Changelog/november-17-2026-893db1.png",
  content: `- An environment's **Payments** page now shows a single layout with **Test Account** and **Live Accounts** sections, whether your organization uses Medusa Payments or connected Stripe accounts. Previously, the page showed a different view for each. Each live account shows its name, a copyable ID, its status, and a toggle to link it to the environment. When multiple active Stripe accounts are linked, the one used as the default provider shows a **Default** badge. If you have no live accounts, the page shows buttons to create a Medusa Payments account or connect a Stripe account.
- You can now switch an environment between test mode and live mode with the **Test Mode** toggle on its **Payments** page, when the environment has a sandbox account. A confirmation explains the impact of the switch, and your store and storefront follow the new mode on their next deployment. While in test mode, you can't link or unlink live accounts.
- The **Payments** page now has an activity section showing balances, onboarding status, payments, payouts, and disputes for the sandbox account in test mode, or for your live accounts in live mode. When multiple accounts are active, you can switch between them from a dropdown.
- In test mode, the storefront setup section on the **Payments** page now shows the sandbox publishable key instead of the live one.
- The **Payments** page of a preview template environment no longer shows a button linking to the production environment's payments page.`,
}
