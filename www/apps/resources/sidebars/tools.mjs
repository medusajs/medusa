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
      {
        type: "link",
        path: "/medusa-oas-cli",
        title: "medusa-oas-cli",
      },
    ],
  },
  {
    type: "category",
    title: "Developer Tools",
    initialOpen: true,
    description:
      "Developer tools facilitate the development of your Medusa application by providing utilities for linting and other uses.",
    children: [
      {
        type: "sidebar",
        sidebar_id: "lint",
        title: "ESLint Plugin",
        childSidebarTitle: "ESLint Plugin Reference",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "/lint",
            title: "Overview",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "Rules",
            autogenerate_path: "lint/rules",
            initialOpen: true,
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
      {
        type: "sidebar",
        sidebar_id: "admin-components",
        title: "Medusa Admin Components",
        childSidebarTitle: "Admin Components Reference",
        children: [
          {
            type: "link",
            path: "/admin-components",
            title: "Overview",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "Components",
            children: [
              {
                type: "link",
                path: "/admin-components/components",
                title: "Overview",
              },
              {
                type: "link",
                path: "/admin-components/components/action-menu",
                title: "Action Menu",
              },
              {
                type: "link",
                path: "/admin-components/components/combobox",
                title: "Combobox",
              },
              {
                type: "link",
                path: "/admin-components/components/conditional-tooltip",
                title: "Conditional Tooltip",
              },
              {
                type: "link",
                path: "/admin-components/components/configurable-data-table",
                title: "Configurable Data Table",
              },
              {
                type: "link",
                path: "/admin-components/components/country-select",
                title: "Country Select",
              },
              {
                type: "link",
                path: "/admin-components/components/data-grid",
                title: "Data Grid",
              },
              {
                type: "link",
                path: "/admin-components/components/display-id",
                title: "Display ID",
              },
              {
                type: "link",
                path: "/admin-components/components/empty-states",
                title: "Empty States",
              },
              {
                type: "link",
                path: "/admin-components/components/handle-input",
                title: "Handle Input",
              },
              {
                type: "link",
                path: "/admin-components/components/icon-avatar",
                title: "Icon Avatar",
              },
              {
                type: "link",
                path: "/admin-components/components/json-view-section",
                title: "JSON View Section",
              },
              {
                type: "link",
                path: "/admin-components/components/keybound-form",
                title: "Keybound Form",
              },
              {
                type: "link",
                path: "/admin-components/components/listicle",
                title: "Listicle",
              },
              {
                type: "link",
                path: "/admin-components/components/product-table-cells",
                title: "Product Table Cells",
              },
              {
                type: "link",
                path: "/admin-components/components/route-drawer",
                title: "Route Drawer",
              },
              {
                type: "link",
                path: "/admin-components/components/route-focus-modal",
                title: "Route Focus Modal",
              },
              {
                type: "link",
                path: "/admin-components/components/section-row",
                title: "Section Row",
              },
              {
                type: "link",
                path: "/admin-components/components/stacked-drawer",
                title: "Stacked Drawer",
              },
              {
                type: "link",
                path: "/admin-components/components/stacked-focus-modal",
                title: "Stacked Focus Modal",
              },
              {
                type: "link",
                path: "/admin-components/components/thumbnail",
                title: "Thumbnail",
              },
            ],
          },
          {
            type: "category",
            title: "Layouts",
            autogenerate_path: "/admin-components/layouts",
          },
          {
            type: "category",
            title: "Hooks",
            children: [
              {
                type: "link",
                path: "/admin-components/hooks",
                title: "Overview",
              },
              {
                type: "link",
                path: "/admin-components/hooks/customers",
                title: "Customers",
              },
              {
                type: "link",
                path: "/admin-components/hooks/data-table-helpers",
                title: "Data Table Hooks",
              },
              {
                type: "link",
                path: "/admin-components/hooks/orders",
                title: "Orders",
              },
              {
                type: "link",
                path: "/admin-components/hooks/price-preferences",
                title: "Price Preferences",
              },
              {
                type: "link",
                path: "/admin-components/hooks/product-variants",
                title: "Product Variants",
              },
              {
                type: "link",
                path: "/admin-components/hooks/products",
                title: "Products",
              },
              {
                type: "link",
                path: "/admin-components/hooks/promotions",
                title: "Promotions",
              },
              {
                type: "link",
                path: "/admin-components/hooks/regions",
                title: "Regions",
              },
              {
                type: "link",
                path: "/admin-components/hooks/sales-channels",
                title: "Sales Channels",
              },
              {
                type: "link",
                path: "/admin-components/hooks/shipping-options",
                title: "Shipping Options",
              },
              {
                type: "link",
                path: "/admin-components/hooks/store",
                title: "Store",
              },
              {
                type: "link",
                path: "/admin-components/hooks/use-combobox-data",
                title: "useComboboxData",
              },
              {
                type: "link",
                path: "/admin-components/hooks/use-date",
                title: "useDate",
              },
              {
                type: "link",
                path: "/admin-components/hooks/use-debounced-search",
                title: "useDebouncedSearch",
              },
              {
                type: "link",
                path: "/admin-components/hooks/use-query-params",
                title: "useQueryParams",
              },
              {
                type: "link",
                path: "/admin-components/hooks/users",
                title: "Users",
              },
            ],
          },
          {
            type: "category",
            title: "Utilities",
            children: [
              {
                type: "link",
                path: "/admin-components/utilities",
                title: "Overview",
              },
              {
                type: "link",
                path: "/admin-components/utilities/addresses",
                title: "Addresses",
              },
              {
                type: "link",
                path: "/admin-components/utilities/form-validation",
                title: "Form Validation",
              },
              {
                type: "link",
                path: "/admin-components/utilities/money-and-currency",
                title: "Money & Currency",
              },
              {
                type: "link",
                path: "/admin-components/utilities/search",
                title: "Search Entities",
              },
              {
                type: "link",
                path: "/admin-components/utilities/table",
                title: "Table Utilities",
              },
            ],
          },
          {
            type: "category",
            title: "Guides",
            autogenerate_path: "/admin-components/guides",
          },
          {
            type: "category",
            title: "Archive",
            children: [
              {
                type: "link",
                path: "/admin-components/archive",
                title: "Overview",
              },
              {
                type: "link",
                path: "/admin-components/archive/action-menu",
                title: "Action Menu",
              },
              {
                type: "link",
                path: "/admin-components/archive/json-view-section",
                title: "JSON View",
              },
              {
                type: "link",
                path: "/admin-components/archive/section-row",
                title: "Section Row",
              },
              {
                type: "link",
                path: "/admin-components/archive/single-column-layout",
                title: "Single Column Layout",
              },
              {
                type: "link",
                path: "/admin-components/archive/two-column-layout",
                title: "Two Column Layout",
              },
            ],
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
