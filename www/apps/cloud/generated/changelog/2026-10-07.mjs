/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-07",
  title: "Redesigned project creation and Stripe payments",
  summary: "Onboarding now leads to the projects list and a redesigned starters page, and payments settings show Stripe account balances.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1791388924/Cloud%20Changelog/october-7-2026-3a2c1e.png",
  content: `- After you sign up or create a new organization, the dashboard now takes you directly to the projects list. Previously, it took you to a **Get started** onboarding page, which is now removed. Refer to [Create your First Project](/first-project) for more details.
- When your organization has no projects, the projects list now shows a **Browse starters** card that opens the starter templates page, and an **Import repository** card that opens the new project form. Previously, it showed a list of featured templates. Refer to [Create your First Project](/first-project) for more details.
- The starter templates page is redesigned. You can now filter starters by the **DTC** or **B2B** category, open a starter's details with its **Preview** button, and create a project from it with its **Deploy** button, which shows the deployment's current phase. The page also has an **Import repository** button to create a project from your own GitHub repository instead. Refer to [Create Projects](/projects#1-create-project-from-a-starter) for more details.
- In a project's security settings, changing the environments of a security feature, such as DDoS or bot protection, now saves the change immediately. Previously, you had to click a **Save** button. The advanced Cloudflare managed ruleset and OWASP ruleset options are no longer shown.
- The organization's payments settings now show your connected Stripe accounts directly on the main payments page. Each account shows its available and pending balance and its latest payout, an **Open in Stripe** button to view the account's payments in the Stripe Dashboard, and a **Disconnect** action in its actions menu. A warning appears if the account is disabled or has outstanding information requirements.
- You can now connect another Stripe account from the payments settings with the **Connect another Stripe account** button.
- When you have an active Stripe account connected, the payments settings show a **Storefront integration** section with a snippet for adding the Medusa Payments publishable key to your storefront, with tabs for Next.js and Vite.`,
}
