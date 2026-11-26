/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-26",
  title: "Audit logs and write-only vault secrets",
  summary:
    "Scale and Enterprise organizations can turn on audit logs to record Cloud and commerce activity, and vault secret values can no longer be read back.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795712837/Cloud%20Changelog/november-26-2026-b8ee7f.png",
  content: `- Organizations on the **Scale** and **Enterprise** plans can now turn on audit logs from the new **Audit log** page in the sidebar. Audit logs record the actions that members, access keys, and Medusa support take in the organization through the dashboard, CLI, and API. Refer to [Audit Logs](https://docs.medusajs.com/cloud/organizations/audit-logs) for more details.
- After turning on audit logs, environments running Medusa v2.23.0 or later record their commerce activity after their next deployment. You can view it in the Medusa Admin under **Settings** > **Audit logs**. Refer to [Audit Logs](https://docs.medusajs.com/cloud/organizations/audit-logs#view-commerce-audit-logs) for more details.
- You can search and filter Cloud audit logs by project, outcome, time range, actor, and resource, and expand a log to view its request details. Refer to [Audit Logs](https://docs.medusajs.com/cloud/organizations/audit-logs#view-cloud-audit-logs) for more details.
- The Usage page now includes an **Audit logs** metric with the number of recorded audit logs. Refer to [Usage](https://docs.medusajs.com/cloud/usage#usage-metrics-definitions) for more details.
- You can no longer reveal or copy a vault secret's value from the dashboard. A secret's details page now shows only a masked value with a note that the value can't be read back, and the service secrets table shows the masked value without a partial hint. Previously, you could click **Reveal** to view and copy the secret's value.`,
}
