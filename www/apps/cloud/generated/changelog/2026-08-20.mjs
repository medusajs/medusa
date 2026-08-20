/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-20",
  title: "Cloud Assistant and log drains",
  summary: "A new Cloud Assistant answers questions from any page, projects can forward logs to an observability provider, and environment variable pages show 15 rows.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787225508/Cloud%20Changelog/aug-20-5d9729.png",
  content: `- You can now open the Cloud Assistant from the **Agent** button in the top bar to ask about Medusa or your projects from any page. The Cloud Assistant can help you learn how to manage your projects and organizations, troubleshoot build and deployment issues, and remember information about your projects to help you better in the future. Previously, Cloud offered separate documentation and troubleshooting assistants. Refer to [Cloud Assistant](https://docs.medusajs.com/cloud/assistant) for more details.
- The assistant uses the page you're on as context, shown in a badge in the message input, so you can ask about the project, environment, or build you're viewing without naming it.
- The assistant now remembers details you share, such as your project's stack, and uses them in later chats. Memories are scoped to you within an organization.
- When a chat gets long, the assistant shows a notice suggesting that you start a new chat for your next task.
- Clicking **Fix with AI** on a build now opens the Cloud Assistant and reopens the chat you already had about that build, instead of starting a new one each time. Refer to [Fix with AI](https://docs.medusajs.com/cloud/deployments/fix-with-ai) for more details.
- Cloud no longer copies the generated instructions for your local agent automatically. Click **Get instructions for local agent** and copy them yourself.
- You can now create a log drain for a project to forward its backend and storefront logs to an external observability provider over the OpenTelemetry (OTLP) protocol. Supported providers are Sentry, Datadog, Grafana, Google Cloud, and any generic OTLP-compatible endpoint. Refer to [Log Drains](https://docs.medusajs.com/cloud/projects/log-drains) for more details.
- The environment variables table now displays 15 variables per page instead of 5, reducing the need to paginate through large variable sets. Refer to [Environment Variables](https://docs.medusajs.com/cloud/environments/environment-variables) for more details.`,
}
