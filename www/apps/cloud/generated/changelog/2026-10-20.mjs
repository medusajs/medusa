/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-20",
  title: "Cloud tools in the Medusa MCP server",
  summary:
    "AI tools connected to the Medusa MCP server can now read your organizations, projects, deployments, logs, environment variables, and Cloud status.",
  content: `- AI tools connected to the Medusa MCP server can now retrieve your Cloud data, such as your organizations, projects, and an environment's deployments. Previously, the server only provided access to your stores' commerce data. Refer to [Medusa MCP](https://docs.medusajs.com/cloud/medusa-mcp#cloud-tools) for the list of tools.
- AI tools can now read an environment's build and runtime logs for its backend or storefront, so you can ask them why a deployment failed or which errors your backend logged.
- AI tools can now list and retrieve an environment's variables. They never receive the values of secret variables.
- AI tools can now check whether Cloud is operational or has an ongoing incident.`,
}
