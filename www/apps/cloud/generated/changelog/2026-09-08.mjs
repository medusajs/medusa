/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-08",
  title: "Log Drains, database backups, and monitoring charts",
  summary: "Projects now support log drains and database backups, the monitoring dashboard has new Network I/O and per-instance CPU charts, and the logs viewer supports ascending sort order.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1788854995/Cloud%20Changelog/september-8-2026-93dd8a.png",
  content: `- You can now create [log drains](https://docs.medusajs.com/cloud/projects/log-drains) to route your project's application logs to an external observability provider such as Sentry, Datadog, Grafana, Google Cloud, or a generic OTLP endpoint. Log drains support log level filtering, source toggles (backend and storefront), environment scoping, custom headers, and resource attribute key-value pairs. Log drains are available on Scale and Enterprise plans.
- The [database page](https://docs.medusajs.com/cloud/database) now includes a **Database Backups** table showing each backup's generation time, source type (scheduled or manual), and file size, with actions to download or restore a backup. Database backups are available on Launch, Scale, and Enterprise plans.
- Two new monitoring charts are available on the [Servers monitoring page](https://docs.medusajs.com/cloud/monitoring/servers): a **Network I/O** chart showing bytes sent and received over time, and a **Per-Instance CPU** chart showing minimum, average, and maximum CPU utilization across server instances.
- The [runtime logs viewer](https://docs.medusajs.com/cloud/logs) now supports toggling between ascending and descending timestamp order using the sort button in the **Timestamp** column header.
- Environment cards on the project overview now show a clear error state when an environment fails to provision, displaying an error icon and a descriptive message. Previously, the card kept showing a loading animation.
- The project overview now shows custom domains on environment cards, with a "+N more" toggle for additional domains after the primary one.
- Long-lived environments now have a **Promote to Production** action available in their action menu when the environment is in a ready state.
- [Preview environment settings](https://docs.medusajs.com/cloud/environments/preview) now consolidate environment variables, provisioning rules, deploy rules, and the DB base branch selection onto a single page accessible directly from the project.
- [Environment variables](https://docs.medusajs.com/cloud/environments/environment-variables) are now accessible as a dedicated page directly from the environment's navigation. Non-secret variable values are now shown directly in the table; secret values have a show/hide eye toggle.`,
}
