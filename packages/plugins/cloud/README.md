<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/cloud
</h1>

<p align="center">
Adds Medusa Cloud features, such as in-app announcements, to the Medusa Admin.
</p>

## Usage

The plugin is added automatically to every Medusa project, whether it runs on [Medusa Cloud](https://docs.medusajs.com/cloud) or is self-hosted. You don't need to install or configure it.

It adds a "What's new" button to the Medusa Admin topbar that lists the latest Medusa Cloud announcements, and shows new announcements in a card at the bottom of the sidebar until you dismiss them. An announcement with more content opens in a details drawer. Some announcements target an admin page, such as a tip on the Orders page about what you can ask an AI tool connected to the [Medusa MCP server](https://docs.medusajs.com/cloud/medusa-mcp). Others can be shown on any page.

Choose the announcements your team sees in **Settings > Announcements**: security updates, feature announcements, and Cloud announcements.

If you use role-based access control (RBAC), add the `cloud_announcement:read` policy to a role to let its users see announcements, and `cloud_announcement:update` to let them change these settings.

## Options

| Option | Env variable | Description |
| --- | --- | --- |
| `apiUrl` | `MEDUSA_CLOUD_API_URL` | Base URL of the Medusa Cloud API. Defaults to `https://api.prod.medusajs.cloud`. |
| `organizationId` | `MEDUSA_CLOUD_ORGANIZATION_ID` | Medusa Cloud organization ID, used to link announcements to your organization's Cloud dashboard. |
| `planHandle` | `MEDUSA_CLOUD_PLAN_HANDLE` | Handle of your Medusa Cloud plan, used to include announcements targeted at the plan. |
| `disabled` | none | Set to `true` to disable the plugin. It isn't loaded, so no announcements, admin widgets, or settings page are added. |

## Resources

- [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins)
- [Medusa Cloud documentation](https://docs.medusajs.com/cloud)
