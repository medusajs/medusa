/** @type {import('types').Sidebar.SidebarItem[]} */
export const settingsSidebar = [
  {
    type: "sidebar",
    sidebar_id: "settings",
    title: "Settings Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/settings",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        children: [
          {
            type: "link",
            path: "/commerce-modules/settings/concepts",
            title: "Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/settings/view-configurations",
            title: "View Configurations",
          },
          {
            type: "link",
            path: "/commerce-modules/settings/layout-configurations",
            title: "Layout Configurations",
          },
          {
            type: "link",
            path: "/commerce-modules/settings/property-labels",
            title: "Property Labels",
          },
          {
            type: "link",
            path: "/commerce-modules/settings/user-preferences",
            title: "User Preferences",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+settings",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Settings Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+settings,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administrative features of the Settings Module.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/settings/configure-view-configurations",
            title: "Configure View Configurations",
          },
        ],
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+settings",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Settings features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Settings Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/settings/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+settings",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+settings",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/settings/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+settings,jsSdk+admin+views",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Settings Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/settings/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "settings-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Settings Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/settings",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                hasTitleStyling: true,
                autogenerate_path:
                  "/references/settings/ISettingsModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "settings-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Settings Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/settings/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/settings_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
