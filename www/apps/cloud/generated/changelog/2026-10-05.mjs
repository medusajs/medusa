/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-05",
  title: "Manage OAuth connections in organization settings",
  summary: "A new organization settings page lists the apps you've authorized, such as AI tools, and lets you change their environments or revoke them.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1791216121/Cloud%20Changelog/october-5-2026-04e389.png",
  content: `- A new **Connections** page in the organization's settings lists the OAuth connections that you approved for third-party applications, such as AI tools connected to the Medusa MCP server. The page shows each connection's accessible environments and organizations, its status, and when it was last used. Refer to [Connections](/organizations/connections) for more details.
- You can now open a connection to view its details, such as its connection and expiry dates and client ID, and change the environments it can access. A connection must keep access to at least one environment. Previously, you had to re-authenticate the application to change its environments. Refer to [Connections](/organizations/connections#manage-a-connection) for more details.
- You can now revoke a connection from the **Connections** page, which removes the application's access to the connection's environments. Refer to [Connections](/organizations/connections#revoke-a-connection) for more details.`,
}
