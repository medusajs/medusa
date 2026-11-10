/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-09",
  title: "Branch-aware root directories",
  summary:
    "Root directory browsers now respect the project's branch.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1794230199/Cloud%20Changelog/november-9-2026-5897fa.png",
  content: `- When you create a project, the root directory browser now has a branch selector if the repository has more than one branch. Changing the branch clears the selected path, and Medusa uses the chosen branch as the Production environment's branch. Refer to [Configure Project During Creation](/projects#configure-project-during-creation) for more details.
- When you select a repository during project creation, the form now pre-fills the branch with the repository's default branch. Refer to [Production Environment's Branch](/projects#production-environments-branch) for more details.
- The root directory browser in a project's general settings and in the **Add Storefront** form now shows the repository's files on the Production environment's branch. Previously, it always showed the default branch. Refer to [Edit Project Details](/projects#edit-project-details) for more details.`,
}
