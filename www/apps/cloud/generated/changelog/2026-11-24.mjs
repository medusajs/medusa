/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-24",
  title: "Roles for members and access keys",
  summary:
    "Organization members and access keys have an Admin, Developer, or Billing role that controls what they can view and do.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795507714/Cloud%20Changelog/nov-24-188159.png",
  content: `- Organizations now support role-based access control. Each member has an **Admin**, **Developer**, or **Billing** role that determines the pages they can open and the actions they can perform. Previously, every member had full access to the organization. Existing members have the **Admin** role. Refer to [Roles and Permissions](https://docs.medusajs.com/cloud/organizations/roles) for more details.
- You now choose a role when inviting members, and you can change a member's role from the **Team** page.
- Organization access keys now require a role, which limits what requests authenticated with the key can do. Existing keys have the **Admin** role.`,
}
