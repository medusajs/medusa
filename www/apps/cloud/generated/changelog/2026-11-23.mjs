/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-23",
  title: "Redesigned environment payments",
  summary: "An environment's payments section groups live and test Stripe accounts, and you switch between them by choosing which account the environment uses.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795458946/Cloud%20Changelog/november-23-2026-6ea091.png",
  content: `- An environment's payments section now shows live and test accounts in separate **Live accounts** and **Test account** groups. Each account appears as a card with its name, a copyable Stripe account ID, and its current status. Previously, all accounts appeared in a single combined list.
- You can now switch an environment's payment account by clicking **Use this account** on a ready account's card and confirming the prompt. After you confirm, the dashboard reminds you to redeploy, since your storefront only picks up the change after a redeployment. Previously, you switched between test and live mode with a toggle in the payments section's header, which is now removed along with the header's **Test**, **Live**, or **Off** status badge.
- Live accounts connected through Stripe now have an **Open in Stripe** button that opens the account in the Stripe Dashboard.
- Live accounts that aren't active yet now show a **Continue setup** button if their onboarding is incomplete, or a **View account** button otherwise. Both open the account's page in the organization's payments settings.`,
}
