/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-24",
  title: "Roles in Cloud and RBAC on Scale",
  summary:
    "Members and access keys get Cloud roles, and Scale and Enterprise organizations get an RBAC license by default.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795507714/Cloud%20Changelog/nov-24-188159.png",
  content: `- Organizations now support role-based access control. Each member has an **Admin**, **Developer**, or **Billing** role that determines the pages they can open and the actions they can perform. Previously, every member had full access to the organization. Existing members have the **Admin** role. Refer to [Roles and Permissions](https://docs.medusajs.com/cloud/organizations/roles) for more details.
- You now choose a role when inviting members, and you can change a member's role from the **Team** page.
- Organization access keys now require a role, which limits what requests authenticated with the key can do. Existing keys have the **Admin** role.
- Organizations on the **Scale** and **Enterprise** plans now get an Enterprise license that includes the RBAC feature by default, so you can use roles in your Medusa application without contacting sales. Previously, you had to contact the Medusa team to get a license. Refer to [Enterprise License](https://docs.medusajs.com/cloud/organizations/license) for more details.`,
}
