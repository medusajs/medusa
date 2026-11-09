/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-09",
  title: "Branch-aware root directories and CDN file URLs",
  summary:
    "Root directory browsers now respect the project's branch, and CDN settings can migrate stored file URLs while S3 storage shows a deprecation warning.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1794230199/Cloud%20Changelog/november-9-2026-5897fa.png",
  content: `- When you create a project, the root directory browser now has a branch selector if the repository has more than one branch. Changing the branch clears the selected path, and Medusa uses the chosen branch as the Production environment's branch. Refer to [Configure Project During Creation](/projects#configure-project-during-creation) for more details.
- When you select a repository during project creation, the form now pre-fills the branch with the repository's default branch. Refer to [Production Environment's Branch](/projects#production-environments-branch) for more details.
- The root directory browser in a project's general settings and in the **Add Storefront** form now shows the repository's files on the Production environment's branch. Previously, it always showed the default branch. Refer to [Edit Project Details](/projects#edit-project-details) for more details.
- A project's CDN settings now have a **Migrate File URLs** section with a button that starts migrating stored file URLs to the CDN after you confirm. If a migration pull request already exists on GitHub, the section also shows a link to open it.
- An environment's **Object storage** page now shows a warning that the S3 storage option is deprecated when CDN file URLs are configured, with a link to the project's CDN settings. Refer to [S3 Storage](/s3#access-s3-configurations-on-cloud) for more details.`,
}
