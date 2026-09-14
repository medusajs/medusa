/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-10",
  title: "Webhook management and reorganized environment navigation",
  image:
    "https://res.cloudinary.com/dza7lstvk/image/upload/v1786952781/Cloud%20Changelog/aug-10.png",
  summary:
    "Environments gain Domains and Variables tabs, organizations can manage webhook endpoints and review webhook event deliveries, and environment cards report failed provisioning.",
  content: `- An environment's **Domains** and **Variables** are now tabs in the environment's navigation, rather than pages under the environment's **Settings** tab. The **Settings** tab now holds the environment's configuration, linked branch, and deploy rules on one page, and a project's **Previews** page moved out of the project's settings. Refer to [Environment Variables](https://docs.medusajs.com/cloud/environments/environment-variables) and [Environment Custom Domains](https://docs.medusajs.com/cloud/environments/custom-domains) for more details.
- You can now manage webhook endpoints in your organization's settings. Create an HTTPS endpoint that receives Cloud events, enable or disable it, rotate its signing secret, and delete it. Refer to [Webhook Endpoints in Cloud](https://docs.medusajs.com/cloud/webhooks/endpoints) for more details.
- The new **Webhook Events** page shows the delivery history of your organization's webhook events, including each event's status, number of attempts, failure reason, and next automatic retry. You can also retry a delivery yourself and filter the events by project or environment. Refer to [Manage Webhook Events in Cloud](https://docs.medusajs.com/cloud/webhooks/events) for more details.
- An environment's card now shows a **Provisioning failed** state, along with how to recover from it, when Cloud fails to provision the environment. The card previously kept showing a loading preview.`,
}
