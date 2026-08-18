/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-18",
  title: "Log drains and larger environment variables page",
  summary: "Projects can now forward logs to external providers via OTLP, and the environment variables table shows 15 entries per page instead of 5.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787041197/Cloud%20Changelog/august-18-2026-caf3c6.png",
  content: `- You can now configure a log drain for your project to forward backend and storefront logs to an external observability provider using the OpenTelemetry (OTLP) protocol. Supported providers include Sentry, Datadog, Grafana, GCP, and any generic OTLP endpoint. Refer to [Log Drains](/projects/log-drains) for more details.
- The environment variables table now displays 15 variables per page instead of 5, reducing the need to paginate through large variable sets. Refer to [Environment Variables](/environments/environment-variables) for more details.`,
}
