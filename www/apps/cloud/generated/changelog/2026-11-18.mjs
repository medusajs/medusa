/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-18",
  title: "License settings and redesigned payments",
  summary: "Organizations get a License settings page with their license key and features, and an environment's Payments settings get a test mode switch and new layout.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795020093/Cloud%20Changelog/november-18-2026-8fb7c1.png",
  content: `- Organizations now have a **License** settings page that shows whether the organization has an active license, its license key with a button to copy it, the licensed features it includes, and how to use the key in local development. Organizations without a license can contact sales from the page. Refer to [License](/organizations/license) for more details.
- An environment's **Payments** settings now have a **Test mode** switch that toggles the environment between test and live payment modes after you confirm the change, and a badge next to the section title that shows the current mode. You need at least one live payment account to switch to live mode, and you need to redeploy the environment for the change to take effect.
- An environment's **Payments** settings now group payment accounts into **Test account** and **Live accounts** sections, with an **In use** badge on the section that the current mode uses. The test account section links to Stripe's test card documentation once the test account is active.
- When an environment has no live payment accounts, the **Payments** settings now show the setup options as two cards: **Medusa Payments**, which is recommended, and **Stripe**. Previously, the settings showed a text message with two buttons.
- The onboarding flow of a new Medusa Payments account now shows below the main payments section of an environment's **Payments** settings whenever the account is onboarding, regardless of the current payment mode. Previously, it showed within the payments activity section.
- The account selector of the payments activity in an environment's **Payments** settings is now always shown, even when the environment has a single payment account. Previously, it only showed when the environment had more than one account.`,
}
