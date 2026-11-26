/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-26",
  title: "Payments version warning and audit log actions",
  summary:
    "Environments with an outdated Medusa version see a warning on their Payments page, and audit log details show each entry's action.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795687743/Cloud%20Changelog/november-26-2026-3ee268.png",
  content: `- An environment's **Payments** page now shows a warning when its active deployment uses a Medusa version older than v2.23.0, the minimum version that payments require. Refer to [Set up Medusa Payments in Environments](/payments/environments#set-up-payments-in-an-environment) for more details.
- The details of an audit log entry in your organization's settings now show the entry's **Action** at the top, before the actor's information.`,
}
