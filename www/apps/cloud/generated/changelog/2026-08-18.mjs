/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-18",
  title: "GCP log drains and per-organization AI Assistant sessions",
  summary: "Log drains support Google Cloud Platform via a service account key, header value pasting strips key prefixes automatically, and the AI Assistant session is now scoped per organization.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787062190/Cloud%20Changelog/august-18-2026-306486.png",
  content: `- Log drains now support Google Cloud Platform (GCP) as a provider. When you select GCP, you paste a service account JSON key instead of entering an OTLP URL or HTTP headers, and authentication is handled via the service account. Refer to [Log Drains](/log-drains) for more details.
- The default resource attributes pre-populated when creating a log drain have been updated to include keys such as service name, service version, service instance ID, cloud region, Medusa version, project handle, project name, environment handle, environment name, and environment type. Previously, a different set of Cloud-specific attribute names was used.
- When entering HTTP header values in the log drain form, pasting a value that begins with the header key followed by \`=\` or \`:\` — for example, \`dd-api-key=abc123\` — now automatically strips the key prefix and inserts only the value.
- The AI Assistant's session key is now stored separately for each organization. Switching between organizations in the dashboard uses a distinct assistant session per organization, preventing a session from one organization from being presented to another.`,
}
