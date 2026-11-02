/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-02",
  title: "Medusa Payments managed accounts",
  summary:
    "An environment's payments settings can set up a Stripe account that Medusa manages, alongside connecting your own Stripe account.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793622654/Cloud%20Changelog/november-2-2026-51bfee.png",
  content: `- An environment's payments settings now offer two setup options side by side: **Medusa Payments**, where Medusa manages a Stripe account on your organization's behalf, and **Connect Stripe**, where you connect your own Stripe account. Each option shows a badge for its approach. Previously, you could only connect your own Stripe account.
- When a Medusa-managed account exists, the payments settings show its email, status, and account ID, an account overview, and a toggle to link or unlink the account from the current environment. You can close the account from its actions menu after confirming the action.
- If a Medusa-managed account hasn't finished onboarding, the payments settings show an embedded Stripe onboarding form below the account card, and the page updates automatically after you complete it.
- Accounts you close now appear in a closing state while their payouts settle. The payments settings show an alert for each closing account, along with its **Payments**, **Payouts**, **Disputes**, and **Account** tabs, so you can still handle refunds, disputes, and payout requirements during that period.
- Payment account activity is now shown in a tabbed panel with **Payments**, **Payouts**, **Disputes**, **Account**, and **Documents** tabs, depending on the account. Managed accounts also show a banner for outstanding Stripe requirements, and sandbox environments use the same panel with the **Payments**, **Payouts**, and **Disputes** tabs.
- The separate account, money, and onboarding pages under the payments settings are removed, and their functionality is now on the main payments page.`,
}
