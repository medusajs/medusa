/** @type {import('types').Sidebar.SidebarItem[]} */
export const loyaltySidebar = [
  {
    type: "sidebar",
    sidebar_id: "loyalty",
    title: "Loyalty Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/loyalty",
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
            path: "/commerce-modules/loyalty/gift-cards",
            title: "Gift Cards",
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+loyalty",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Loyalty Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+loyalty,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Loyalty Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+loyalty,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administrative features of the Loyalty Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+loyalty",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Loyalty features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Loyalty Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/loyalty/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+loyalty",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+loyalty",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "loyalty-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Loyalty Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/loyalty",
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
                  "/references/loyalty/ILoyaltyModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "loyalty-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Loyalty Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/loyalty/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/loyalty_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
