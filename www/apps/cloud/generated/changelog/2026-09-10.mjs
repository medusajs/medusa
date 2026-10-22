/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-10",
  title: "Redeploy disabled when build image is deleted",
  summary: "The Redeploy action is now disabled across the dashboard when a build's container image has been deleted.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1789042894/Cloud%20Changelog/september-10-2026-19ec2a.png",
  content: `- The **Redeploy** button and action are now disabled when a build's container image has been deleted. This affects the environment detail page, the [deployment details page](/deployments), the builds table, and environment cards and lists on the project overview. Previously, the action was only disabled when there was no active deployment.`,
}
