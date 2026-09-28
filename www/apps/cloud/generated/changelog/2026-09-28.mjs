/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-28",
  title: "Initial user removed from project creation",
  summary: "The project creation wizard no longer asks for an initial admin email and password for the Medusa Admin.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790601084/Cloud%20Changelog/september-28-2026-a3a7c0.png",
  content: `- The project creation wizard no longer has an **Initial user** section. Previously, when you created a project without a template that supports Cloud login, you could set the email and password of the initial Medusa Admin user during creation. Refer to [Projects](https://docs.medusajs.com/cloud/projects#configure-project-during-creation) for the current project creation steps.`,
}
