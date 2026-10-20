/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-19",
  title: "Project creation from the MCP consent page",
  summary: "The consent page lets you create a project when you have no environments, and onboarding returns you to the page you were trying to open.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1792412272/Cloud%20Changelog/october-19-2026-32bdc0.png",
  content: `- When you connect an AI tool to the Medusa MCP server and have no environments to select on the consent page, the page now shows a **Create Project** button that opens the project creation page in a new tab. Previously, the page only showed an empty message. Refer to [Medusa MCP](/medusa-mcp#approve-the-connection) for more details.
- After you complete the payment step of onboarding, the dashboard now takes you to the page you were trying to open before you logged in, if any. Previously, it always took you to the default page.`,
}
