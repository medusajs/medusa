/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-19",
  title: "Medusa Payments review state and access updates",
  summary: "Medusa Payments onboarding shows when Stripe is reviewing an account, and the dashboard handles pages and actions you can't access more clearly.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795101735/Cloud%20Changelog/november-19-2026-89f3b2.png",
  content: `- After you complete the Stripe onboarding form for Medusa Payments, the payment account moves to an **In Review** state while Stripe verifies your details, and the Payments page shows a card explaining that no further action is needed. Previously, the account stayed in the **Onboarding** state.
- When Stripe activates your Medusa Payments account, the dashboard shows a notification confirming the activation without requiring a page reload.
- Connected Stripe accounts that are still onboarding now appear in the environment's payments activity section, so you can see what Stripe requires from you before the account is active.
- The **Delete Organization** section in the organization's settings now only appears for users who have permission to delete the organization. Refer to [Organizations](/organizations#delete-organization) for more details.
- Navigating to a part of the dashboard you don't have access to now shows a page explaining that you lack the required permissions, with a **Back to Dashboard** button that returns you to the dashboard's home.
- The **Reset Password** page now validates your new password against the same password requirements used elsewhere in the dashboard, rather than only checking that the field isn't empty.`,
}
