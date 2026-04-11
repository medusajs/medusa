/** @type {import('types').Sidebar.SidebarItem[]} */
export const toolsSidebar = [
  {
    type: "link",
    title: "Overview",
    path: "/tools",
  },
  {
    type: "category",
    title: "CLI Tools",
    initialOpen: true,
    description:
      "CLI tools help you setup Medusa, manage the database, and more.",
    children: [
      {
        type: "link",
        path: "/create-medusa-app",
        title: "create-medusa-app",
      },
      {
        type: "sidebar",
        sidebar_id: "medusa-cli",
        title: "Medusa CLI",
        childSidebarTitle: "Medusa CLI Reference",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "/medusa-cli",
            title: "Overview",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "Commands",
            autogenerate_path: "medusa-cli/commands",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "SDKs",
    initialOpen: true,
    description:
      "SDKs help you build client applications, such as storefronts or admin dashboards, with Medusa. They're also useful when extending the Medusa Admin with widgets and UI routes.",
    children: [
      {
        type: "sidebar",
        sidebar_id: "js-sdk",
        title: "JS SDK",
        childSidebarTitle: "JS SDK Reference",
        children: [
          {
            type: "link",
            path: "/js-sdk",
            title: "Overview",
          },
          {
            type: "link",
            path: "/js-sdk/auth/overview",
            title: "Authentication",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "auth Methods",
            autogenerate_path: "/references/js_sdk/auth/Auth/methods",
          },
          {
            type: "category",
            title: "store Methods",
            autogenerate_path: "/references/js_sdk/store/Store/properties",
          },
          {
            type: "category",
            title: "admin Methods",
            autogenerate_path: "/references/js_sdk/admin/Admin/properties",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Storefront Starters",
    initialOpen: true,
    description:
      "A storefront starter is a storefront with the basic commerce features that you can use with your Medusa application. You can use it as-is or build on top of it. Learn more about building a storefront in the [Storefront Development](/storefront-development) documentation.",
    children: [
      {
        type: "sidebar",
        sidebar_id: "nextjs-starter",
        title: "Next.js Starter Storefront",
        children: [
          {
            type: "link",
            path: "/nextjs-starter",
            title: "Overview",
          },
          {
            type: "category",
            title: "How-to Guides",
            initialOpen: true,
            children: [
              {
                type: "link",
                path: "/nextjs-starter/guides/revalidate-cache",
                title: "Revalidate Cache",
              },
              {
                type: "link",
                path: "/nextjs-starter/guides/remove-country-code",
                title: "Remove Country Code from URLs",
              },
            ],
          },
          {
            type: "category",
            title: "Tutorials",
            autogenerate_tags: "nextjs+tutorial",
            autogenerate_as_ref: true,
            sort_sidebar: "alphabetize",
            children: [
              {
                type: "link",
                path: "/nextjs-starter/guides/customize-stripe",
                title: "Use Stripe's Payment Element",
              },
              {
                type: "link",
                path: "/nextjs-starter/guides/storefront-returns",
                title: "Create Order Returns",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "external",
    title: "Medusa UI",
    path: "https://docs.medusajs.com/ui",
  },
]
