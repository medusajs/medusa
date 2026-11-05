/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-05",
  title: "Vault for third-party service secrets",
  summary: "Organizations can store encrypted third-party secrets in Vault, rotate them, and control which projects and environments can access them.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793886257/Cloud%20Changelog/november-5-2026-432e3c.png",
  content: `- Organizations with Vault enabled now have a **Vault** section in their settings to store encrypted secrets for third-party services, grouped by the service's domain. You can add multiple secrets for a service at once and set an optional expiration for each. Refer to [Vault](/organizations/vault) for more details.
- From a secret's page, you can reveal and copy its value, rotate it to a new version, or delete it. Refer to [Rotate a Secret](/organizations/vault#rotate-a-secret) for more details.
- You can control which projects, and which of their environments, can access each secret. Refer to [Manage Project Access](/organizations/vault#manage-project-access) for more details.`,
}
