/** @type {import('types').Sidebar.SidebarItem[]} */
export const translationSidebar = [
  {
    type: "sidebar",
    sidebar_id: "translation",
    title: "Translation Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/translation",
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
            path: "/commerce-modules/translation/concepts",
            title: "Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/translation/custom-data-models",
            title: "Translate Custom Models",
          },
          {
            type: "link",
            path: "/commerce-modules/translation/storefront",
            title: "Translation in Storefront",
          },
          {
            type: "link",
            path: "/commerce-modules/translation/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+translation",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Translation Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+translation,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Translation Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+translation,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administrative features of the Translation Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+translation",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Translation features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Translation Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/translation/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+translation",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+translation",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/translation/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+translation",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Translation Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+translation",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Translation Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "translation-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Translation Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/translation",
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
                  "/references/translation/ITranslationModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "translation-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Translation Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/translation/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/translation_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
