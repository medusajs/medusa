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

## Options

| Option | Env variable | Description |
| --- | --- | --- |
| `apiUrl` | `MEDUSA_CLOUD_API_URL` | Base URL of the Medusa Cloud API. Defaults to `https://api.prod.medusajs.cloud`. |
| `organizationId` | `MEDUSA_CLOUD_ORGANIZATION_ID` | Medusa Cloud organization ID, used to include announcements targeted at the organization's plan. |
| `apiKey` | `MEDUSA_CLOUD_API_KEY` | Medusa Cloud API key of the environment, set automatically on Medusa Cloud. Used to show the announcements available to your plan. |
| `environmentHandle` | `MEDUSA_CLOUD_ENVIRONMENT_HANDLE` | Handle of the Medusa Cloud environment, set automatically on Medusa Cloud. |
| `disabled` | none | Set to `true` to disable the plugin. It isn't loaded, so no announcements, admin widgets, or settings page are added. |

## Resources

- [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins)
- [Medusa Cloud documentation](https://docs.medusajs.com/cloud)
