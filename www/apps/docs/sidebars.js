/**
 * Custom sidebar definitions:
 * - To declare a sidebar element as part of the homepage sidebar, add className: 'homepage-sidebar-item'
 * - To add an icon:
 *   - add the icon in www/docs/src/theme/Icon/<IconName>/index.ts as a React SVG element if it doesn't exist, where `<IconName>` is the camel case name of the icon
 *   - add the mapping to the icon in www/docs/src/theme/Icon/index.js
 *   - add in customProps sidebar_icon: 'icon-name'
 * - To add a group divider add in customProps sidebar_is_group_divider: true and set the label/value to the title that should appear in the divider.
 * - To add a back item, add in customProps:
 *   - sidebar_is_back_link: true
 *   - sidebar_icon: `back-arrow`
 * - To add a sidebar title, add in customProps sidebar_is_title: true
 * - To add a group headline, add in customProps sidebar_is_group_headline: true
 * - To add a coming soon link (with a badge), add in customProps sidebar_is_soon: true
 * - To add a badge, add in customProps sidebar_badge with its value being the props to pass to the Badge component.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  homepage: [
    {
      type: "doc",
      id: "homepage",
      label: "Overview",
      customProps: {
        sidebar_icon: "book-open",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "create-medusa-app",
      label: "Create Medusa App",
      customProps: {
        sidebar_icon: "rocket-launch",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "category",
      label: "Recipes",
      link: {
        type: "doc",
        id: "recipes/index",
      },
      customProps: {
        sidebar_icon: "newspaper",
      },
      className: "homepage-sidebar-item",
      items: [
        {
          type: "doc",
          id: "recipes/ecommerce",
          label: "Ecommerce",
          customProps: {
            iconName: "shopping-cart",
            exclude_from_doc_list: true,
          },
        },
        {
          type: "doc",
          id: "recipes/marketplace",
          label: "Marketplace",
          customProps: {
            iconName: "building-storefront",
          },
        },
        {
          type: "doc",
          id: "recipes/subscriptions",
          label: "Subscriptions",
          customProps: {
            iconName: "credit-card-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/integrate-ecommerce-stack",
          label: "Integrate Ecommerce Stack",
          customProps: {
            iconName: "puzzle-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/commerce-automation",
          label: "Commerce Automation",
          customProps: {
            iconName: "clock-solid-mini",
          },
        },
        {
          type: "doc",
          id: "recipes/oms",
          label: "Order Management System",
          customProps: {
            iconName: "check-circle-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/pos",
          label: "POS",
          customProps: {
            iconName: "computer-desktop-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/digital-products",
          label: "Digital Products",
          customProps: {
            iconName: "photo-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/personalized-products",
          label: "Personalized Products",
          customProps: {
            iconName: "swatch-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/b2b",
          label: "B2B",
          customProps: {
            iconName: "building-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/multi-region",
          label: "Multi-Region Store",
          customProps: {
            iconName: "globe-europe-solid",
          },
        },
        {
          type: "doc",
          id: "recipes/omnichannel",
          label: "Omnichannel Store",
          customProps: {
            iconName: "channels-solid",
          },
        },
      ],
    },
    {
      type: "html",
      value: "Browse Docs",
      customProps: {
        sidebar_is_group_divider: true,
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "ref",
      id: "modules/overview",
      label: "Commerce Modules",
      customProps: {
        sidebar_icon: "puzzle",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "ref",
      id: "development/overview",
      label: "Medusa Development",
      customProps: {
        sidebar_icon: "server-stack",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "category",
      label: "Admin Dashboard",
      link: {
        type: "doc",
        id: "admin/quickstart",
      },
      customProps: {
        sidebar_icon: "computer-desktop",
      },
      className: "homepage-sidebar-item",
      items: [
        {
          type: "doc",
          label: "Admin Configuration",
          id: "admin/configuration",
        },
        {
          type: "doc",
          label: "Admin Widgets",
          id: "admin/widgets",
        },
        {
          type: "doc",
          label: "Admin UI Routes",
          id: "admin/routes",
        },
        {
          type: "doc",
          label: "Admin Setting Pages",
          id: "admin/setting-pages",
        },
        {
          type: "doc",
          label: "Example: Create Onboarding",
          id: "admin/onboarding",
        },
      ],
    },
    {
      type: "ref",
      id: "plugins/overview",
      label: "Plugins",
      customProps: {
        sidebar_icon: "squares-plus",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "html",
      value: "Frontend Storefronts",
      customProps: {
        sidebar_is_group_divider: true,
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "starters/nextjs-medusa-starter",
      label: "Next.js Starter Template",
      customProps: {
        sidebar_icon: "nextjs",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "storefront/roadmap",
      label: "Build a Storefront",
      customProps: {
        sidebar_icon: "building-storefront",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "html",
      value: "SDKs",
      customProps: {
        sidebar_is_group_divider: true,
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "ref",
      id: "js-client/overview",
      label: "JavaScript Client",
      customProps: {
        sidebar_icon: "javascript",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "medusa-react/overview",
      label: "Medusa React",
      customProps: {
        sidebar_icon: "react",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "html",
      value: "CLI Tools",
      customProps: {
        sidebar_is_group_divider: true,
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "cli/reference",
      label: "Medusa CLI",
      customProps: {
        sidebar_icon: "command-line",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "development/fundamentals/local-development",
      label: "Medusa Dev CLI",
      customProps: {
        sidebar_icon: "tools",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "html",
      value: "Additional Resources",
      customProps: {
        sidebar_is_group_divider: true,
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "beta",
      label: "Beta Features",
      customProps: {
        sidebar_icon: "adjustments",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "category",
      label: "Deploy",
      customProps: {
        sidebar_icon: "cloud-arrow-up",
      },
      link: {
        type: "doc",
        id: "deployments/index",
      },
      items: [
        {
          type: "category",
          label: "Backend",
          link: {
            type: "doc",
            id: "deployments/server/index",
          },
          items: [
            {
              type: "doc",
              id: "deployments/server/deploying-on-heroku",
              label: "Deploy on Heroku",
              customProps: {
                image:
                  "https://res.cloudinary.com/dza7lstvk/image/upload/v1669739927/Medusa%20Docs/Other/xNvxSkf_l230wq.png",
              },
            },
            {
              type: "doc",
              id: "deployments/server/deploying-on-digital-ocean",
              label: "Deploy on DigitalOcean",
              customProps: {
                image:
                  "https://res.cloudinary.com/dza7lstvk/image/upload/v1669739945/Medusa%20Docs/Other/aahqJp4_lbtfdz.png",
              },
            },
            {
              type: "doc",
              id: "deployments/server/deploying-on-railway",
              label: "Deploy on Railway",
              customProps: {
                themedImage: {
                  light:
                    "https://res.cloudinary.com/dza7lstvk/image/upload/v1669741520/Medusa%20Docs/Other/railway-light_fzuyeo.png",
                  dark: "https://res.cloudinary.com/dza7lstvk/image/upload/v1669741520/Medusa%20Docs/Other/railway-dark_kkzuwh.png",
                },
              },
            },
            {
              type: "doc",
              id: "deployments/server/deploying-on-microtica",
              label: "Deploy on Microtica",
              customProps: {
                themedImage: {
                  light:
                    "https://res.cloudinary.com/dza7lstvk/image/upload/v1681296578/Medusa%20Docs/Other/aF4ZuDS_t11rcu.png",
                  dark: "https://res.cloudinary.com/dza7lstvk/image/upload/v1681296612/Medusa%20Docs/Other/Lg7NHQk_qo6oax.png",
                },
                badge: {
                  variant: "blue",
                  children: "Community",
                },
              },
            },
            {
              type: "doc",
              id: "deployments/server/general-guide",
              label: "General Deployment",
              customProps: {
                iconName: "academic-cap-solid",
              },
            },
          ],
          customProps: {
            category_id: "deploy_backend",
          },
        },
        {
          type: "category",
          label: "Admin",
          link: {
            type: "doc",
            id: "deployments/admin/index",
          },
          items: [
            {
              type: "doc",
              id: "deployments/admin/deploying-on-vercel",
              label: "Deploy on Vercel",
              customProps: {
                themedImage: {
                  light:
                    "https://res.cloudinary.com/dza7lstvk/image/upload/v1679574115/Medusa%20Docs/Other/vercel-icon-dark_llkb7l.png",
                  dark: "https://res.cloudinary.com/dza7lstvk/image/upload/v1679574132/Medusa%20Docs/Other/vercel-icon-light_obvtno.png",
                },
              },
            },
            {
              type: "doc",
              id: "deployments/admin/general-guide",
              label: "General Deployment",
              customProps: {
                iconName: "academic-cap-solid",
              },
            },
          ],
          customProps: {
            category_id: "deploy_admin",
          },
        },
        {
          type: "category",
          label: "Storefront",
          link: {
            type: "doc",
            id: "deployments/storefront/index",
          },
          items: [
            {
              type: "doc",
              id: "deployments/storefront/deploying-next-on-vercel",
              label: "Deploy Next.js on Vercel",
              customProps: {
                themedImage: {
                  light:
                    "https://res.cloudinary.com/dza7lstvk/image/upload/v1679574115/Medusa%20Docs/Other/vercel-icon-dark_llkb7l.png",
                  dark: "https://res.cloudinary.com/dza7lstvk/image/upload/v1679574132/Medusa%20Docs/Other/vercel-icon-light_obvtno.png",
                },
              },
            },
            {
              type: "doc",
              id: "deployments/storefront/general-guide",
              label: "General Deployment",
              customProps: {
                iconName: "academic-cap-solid",
              },
            },
          ],
          customProps: {
            category_id: "deploy_storefront",
          },
        },
      ],
      className: "homepage-sidebar-item",
    },
    {
      type: "ref",
      id: "upgrade-guides/index",
      label: "Upgrade Guides",
      customProps: {
        sidebar_icon: "cog-six-tooth",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "ref",
      id: "troubleshooting/create-medusa-app-errors",
      label: "Troubleshooting",
      customProps: {
        sidebar_icon: "bug",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "category",
      link: {
        type: "doc",
        id: "contribution/docs",
      },
      label: "Contribution Guidelines",
      customProps: {
        sidebar_icon: "document-text",
      },
      className: "homepage-sidebar-item",
      items: [
        {
          type: "autogenerated",
          dirName: "contribution",
        },
      ],
    },
    {
      type: "doc",
      id: "glossary",
      label: "Glossary",
      customProps: {
        sidebar_icon: "book-open",
      },
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "usage",
      label: "Usage",
      customProps: {
        sidebar_icon: "light-bulb",
      },
      className: "homepage-sidebar-item",
    },
  ],
  modules: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "modules/overview",
      label: "Commerce Modules",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "puzzle",
      },
    },
    {
      type: "category",
      label: "Regions and Currencies",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/regions-and-currencies/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/regions-and-currencies/regions",
          label: "Regions",
        },
        {
          type: "doc",
          id: "modules/regions-and-currencies/currencies",
          label: "Currencies",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/regions-and-currencies/admin/manage-regions",
          label: "Admin: Manage Regions",
        },
        {
          type: "doc",
          id: "modules/regions-and-currencies/admin/manage-currencies",
          label: "Admin: Manage Currencies",
        },
        {
          type: "doc",
          id: "modules/regions-and-currencies/storefront/use-regions",
          label: "Storefront: Use Regions",
        },
      ],
    },
    {
      type: "category",
      label: "Customers",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/customers/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/customers/customers",
          label: "Customers",
        },
        {
          type: "doc",
          id: "modules/customers/customer-groups",
          label: "Customer Groups",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/customers/backend/send-confirmation",
          label: "Backend: Send SignUp Email",
        },
        {
          type: "doc",
          id: "modules/customers/admin/manage-customers",
          label: "Admin: Manage Customers",
        },
        {
          type: "doc",
          id: "modules/customers/admin/manage-customer-groups",
          label: "Admin: Manage Customer Groups",
        },
        {
          type: "doc",
          id: "modules/customers/storefront/implement-customer-profiles",
          label: "Storefront: Add Customer Profiles",
        },
      ],
    },
    {
      type: "category",
      label: "Products",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/products/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/products/products",
          label: "Products",
        },
        {
          type: "doc",
          id: "modules/products/categories",
          label: "Categories",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/products/admin/manage-products",
          label: "Admin: Manage Products",
        },
        {
          type: "doc",
          id: "modules/products/admin/manage-categories",
          label: "Admin: Manage Categories",
        },
        {
          type: "doc",
          id: "modules/products/admin/import-products",
          label: "Admin: Import Products",
        },
        {
          type: "doc",
          id: "modules/products/storefront/show-products",
          label: "Storefront: Show Products",
        },
        {
          type: "doc",
          id: "modules/products/storefront/use-categories",
          label: "Storefront: Use Categories",
        },
      ],
    },
    {
      type: "category",
      label: "Carts and Checkout",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/carts-and-checkout/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/cart",
          label: "Cart",
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/shipping",
          label: "Shipping",
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/payment",
          label: "Payment",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "references/fulfillment/classes/fulfillment.AbstractFulfillmentService",
          label: "Backend: Create Fulfillment Provider",
        },
        {
          type: "doc",
          id: "references/payment/classes/payment.AbstractPaymentProcessor",
          label: "Backend: Create Payment Processor",
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/backend/cart-completion-strategy",
          label: "Backend: Override Cart Completion",
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/storefront/implement-cart",
          label: "Storefront: Implement Cart",
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/storefront/implement-checkout-flow",
          label: "Storefront: Implement Checkout",
        },
      ],
    },
    {
      type: "category",
      label: "Orders",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/orders/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/orders/orders",
          label: "Orders",
        },
        {
          type: "doc",
          id: "modules/orders/swaps",
          label: "Swaps",
        },
        {
          type: "doc",
          id: "modules/orders/returns",
          label: "Returns",
        },
        {
          type: "doc",
          id: "modules/orders/claims",
          label: "Claims",
        },
        {
          type: "doc",
          id: "modules/orders/draft-orders",
          label: "Draft Orders",
        },
        {
          type: "doc",
          id: "modules/orders/fulfillments",
          label: "Fulfillment",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/orders/backend/send-order-confirmation",
          label: "Backend: Send Confirmation Email",
        },
        {
          type: "doc",
          id: "modules/orders/backend/handle-order-claim-event",
          label: "Backend: Send Order Claim Email",
        },
        {
          type: "doc",
          id: "modules/orders/admin/manage-orders",
          label: "Admin: Manage Orders",
        },
        {
          type: "doc",
          id: "modules/orders/admin/edit-order",
          label: "Admin: Edit an Order",
        },
        {
          type: "doc",
          id: "modules/orders/admin/manage-swaps",
          label: "Admin: Manage Swaps",
        },
        {
          type: "doc",
          id: "modules/orders/admin/manage-returns",
          label: "Admin: Manage Returns",
        },
        {
          type: "doc",
          id: "modules/orders/admin/manage-claims",
          label: "Admin: Manage Claims",
        },
        {
          type: "doc",
          id: "modules/orders/admin/manage-draft-orders",
          label: "Admin: Manage Draft Orders",
        },
        {
          type: "doc",
          id: "modules/orders/storefront/retrieve-order-details",
          label: "Storefront: Retrieve Order Details",
        },
        {
          type: "doc",
          id: "modules/orders/storefront/create-return",
          label: "Storefront: Create a Return",
        },
        {
          type: "doc",
          id: "modules/orders/storefront/create-swap",
          label: "Storefront: Create a Swap",
        },
        {
          type: "doc",
          id: "modules/orders/storefront/handle-order-edits",
          label: "Storefront: Handle Order Edits",
        },
        {
          type: "doc",
          id: "modules/orders/storefront/implement-claim-order",
          label: "Storefront: Implement Claim Order",
        },
      ],
    },
    {
      type: "category",
      label: "Multi-Warehouse",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/multiwarehouse/overview",
          label: "Overview",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/install-modules",
          label: "Install Modules",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/inventory-module",
          label: "Inventory Module",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/stock-location-module",
          label: "Stock Location Module",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/inventory/interfaces/inventory.IInventoryService",
          label: "Inventory Module Interface Reference",
        },
        {
          type: "ref",
          id: "references/stock_location/interfaces/stock_location.IStockLocationService",
          label: "Stock Location Module Interface Reference",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/backend/create-inventory-service",
          label: "Backend: Create Inventory Service",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/backend/create-stock-location-service",
          label: "Backend: Create Stock Location Service",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/admin/manage-stock-locations",
          label: "Admin: Manage Stock Locations",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/admin/manage-inventory-items",
          label: "Admin: Manage Inventory Items",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/admin/manage-reservations",
          label: "Admin: Manage Custom Reservations",
        },
        {
          type: "doc",
          id: "modules/multiwarehouse/admin/manage-item-allocations-in-orders",
          label: "Admin: Manage Allocations in Orders",
        },
      ],
    },
    {
      type: "category",
      label: "Taxes",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/taxes/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/taxes/taxes",
          label: "Taxes",
        },
        {
          type: "doc",
          id: "modules/taxes/inclusive-pricing",
          label: "Tax Inclusive Pricing",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "references/tax/classes/tax.AbstractTaxService",
          label: "Backend: Create Tax Provider",
        },
        {
          type: "doc",
          id: "references/tax_calculation/classes/tax_calculation.AbstractTaxCalculationStrategy",
          label: "Backend: Override Tax Calculation",
        },
        {
          type: "doc",
          id: "modules/taxes/admin/manage-tax-settings",
          label: "Admin: Manage Taxes",
        },
        {
          type: "doc",
          id: "modules/taxes/admin/manage-tax-rates",
          label: "Admin: Manage Tax Rates",
        },
        {
          type: "doc",
          id: "modules/taxes/storefront/manual-calculation",
          label: "Storefront: Calculate Taxes",
        },
      ],
    },
    {
      type: "category",
      label: "Discounts",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/discounts/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/discounts/discounts",
          label: "Discounts",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/discounts/admin/manage-discounts",
          label: "Admin: Manage Discounts",
        },
        {
          type: "doc",
          id: "modules/discounts/storefront/use-discounts-in-checkout",
          label: "Storefront: Discounts in Checkout",
        },
      ],
    },
    {
      type: "category",
      label: "Gift Cards",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/gift-cards/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/gift-cards/gift-cards",
          label: "Gift Cards",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/gift-cards/backend/send-gift-card-to-customer",
          label: "Backend: Send Gift Card Code",
        },
        {
          type: "doc",
          id: "modules/gift-cards/admin/manage-gift-cards",
          label: "Admin: Manage Gift Cards",
        },
        {
          type: "doc",
          id: "modules/gift-cards/storefront/use-gift-cards",
          label: "Storefront: Use Gift Cards",
        },
      ],
    },
    {
      type: "category",
      label: "Price Lists",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/price-lists/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/price-lists/price-lists",
          label: "Price Lists",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "references/price_selection/classes/price_selection.AbstractPriceSelectionStrategy",
          label: "Backend: Override Price Selection",
        },
        {
          type: "doc",
          id: "modules/price-lists/admin/manage-price-lists",
          label: "Admin: Manage Price Lists",
        },
      ],
    },
    {
      type: "category",
      label: "Sales Channels",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/sales-channels/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/sales-channels/sales-channels",
          label: "Sales Channels",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/sales-channels/admin/manage",
          label: "Admin: Manage Sales Channels",
        },
        {
          type: "doc",
          id: "modules/sales-channels/storefront/use-sales-channels",
          label: "Storefront: Use Sales Channels",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "modules/users/overview",
          label: "Overview",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/users/users",
          label: "Users and Invites",
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "modules/users/backend/send-invite",
          label: "Backend: Send Invite",
        },
        {
          type: "doc",
          id: "modules/users/backend/rbac",
          label: "Backend: Implement RBAC",
        },
        {
          type: "doc",
          id: "modules/users/admin/manage-profile",
          label: "Admin: Implement Profiles",
        },
        {
          type: "doc",
          id: "modules/users/admin/manage-users",
          label: "Admin: Manage Users",
        },
        {
          type: "doc",
          id: "modules/users/admin/manage-invites",
          label: "Admin: Manage Invites",
        },
      ],
    },
  ],
  core: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "development/overview",
      label: "Medusa Development",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "server-stack",
      },
    },
    {
      type: "category",
      label: "Backend Setup",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "development/backend/prepare-environment",
          label: "Prepare Environment",
        },
        {
          type: "doc",
          id: "development/backend/install",
          label: "Backend Quickstart",
        },
        {
          type: "doc",
          id: "development/backend/directory-structure",
          label: "Directory Structure",
        },
        {
          type: "doc",
          id: "references/medusa_config/interfaces/medusa_config.ConfigModule",
          label: "Configurations",
        },
      ],
    },
    {
      type: "category",
      label: "Architectural Concepts",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "doc",
          id: "development/fundamentals/architecture-overview",
          label: "Medusa Architecture",
        },
        {
          type: "doc",
          id: "development/fundamentals/dependency-injection",
          label: "Dependency Injection",
        },
        {
          type: "doc",
          id: "development/fundamentals/local-development",
          label: "Local Development",
        },
      ],
    },
    {
      type: "category",
      label: "Basics",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: false,
      items: [
        {
          type: "category",
          label: "Workflows",
          items: [
            {
              type: "doc",
              id: "development/workflows/index",
              label: "Introduction",
            },
            {
              type: "html",
              value: "References",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "ref",
              id: "references/modules/workflows",
              label: "API Reference",
            },
          ],
        },
        {
          type: "category",
          label: "Entity",
          items: [
            {
              type: "doc",
              id: "development/entities/overview",
              label: "Overview",
            },
            {
              type: "doc",
              id: "development/entities/migrations/overview",
              label: "Migration",
            },
            {
              type: "ref",
              id: "references/entities/classes/entities.Address",
              label: "Entities Reference",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/entities/create",
              label: "Create an Entity",
            },
            {
              type: "doc",
              id: "development/entities/repositories",
              label: "Use a Repository",
            },
            {
              type: "doc",
              id: "development/entities/extend-entity",
              label: "Extend an Entity",
            },
            {
              type: "doc",
              id: "development/entities/migrations/create",
              label: "Create a Migration",
            },
            {
              type: "doc",
              id: "development/entities/extend-repository",
              label: "Extend a Repository",
            },
          ],
        },
        {
          type: "category",
          label: "API Routes",
          items: [
            {
              type: "doc",
              id: "development/api-routes/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "category",
              label: "Create an API Route",
              link: {
                type: "doc",
                id: "development/api-routes/create",
              },
              collapsed: true,
              items: [
                {
                  type: "doc",
                  id: "development/api-routes/create-express-route",
                  label: "Express-Router Approach",
                },
              ],
            },
            {
              type: "category",
              label: "Create a Middleware",
              link: {
                type: "doc",
                id: "development/api-routes/add-middleware",
              },
              collapsed: true,
              items: [
                {
                  type: "doc",
                  id: "development/api-routes/add-middleware-express-route",
                  label: "Express-Router Approach",
                },
              ],
            },
            {
              type: "doc",
              id: "development/api-routes/extend-validator",
              label: "Extend Validator",
            },
            {
              type: "doc",
              id: "development/api-routes/example-logged-in-user",
              label: "Example: Logged-In User",
            },
          ],
        },
        {
          type: "category",
          label: "Service",
          items: [
            {
              type: "doc",
              id: "development/services/overview",
              label: "Overview",
            },
            {
              type: "ref",
              id: "references/services/classes/services.AnalyticsConfigService",
              label: "Services Reference",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/services/create-service",
              label: "Create a Service",
            },
            {
              type: "doc",
              id: "development/services/extend-service",
              label: "Extend a Service",
            },
          ],
        },
        {
          type: "category",
          label: "Subscribers and Events",
          items: [
            {
              type: "doc",
              id: "development/events/index",
              label: "Overview",
            },
            {
              type: "doc",
              id: "development/events/subscribers",
              label: "Subscriber",
            },
            {
              type: "doc",
              id: "development/events/events-list",
              label: "Events Reference",
            },
            {
              type: "html",
              value: "Available Modules",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/events/modules/redis",
              label: "Redis",
            },
            {
              type: "doc",
              id: "development/events/modules/local",
              label: "Local",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/events/create-module",
              label: "Create an Event Module",
            },
            {
              type: "category",
              link: {
                type: "doc",
                id: "development/events/create-subscriber",
              },
              label: "Create a Subscriber",
              items: [
                {
                  type: "doc",
                  id: "development/events/create-subscriber-deprecated",
                  label: "Create a Subscriber",
                  customProps: {
                    sidebar_badge: {
                      variant: "orange",
                      children: "Deprecated",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Loader",
          items: [
            {
              type: "doc",
              id: "development/loaders/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/loaders/create",
              label: "Create a Loader",
            },
          ],
        },
        {
          type: "category",
          label: "Scheduled Job",
          items: [
            {
              type: "doc",
              id: "development/scheduled-jobs/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "category",
              link: {
                type: "doc",
                id: "development/scheduled-jobs/create",
              },
              label: "Create a Scheduled Job",
              items: [
                {
                  type: "doc",
                  id: "development/scheduled-jobs/create-deprecated",
                  label: "Create a Scheduled Job",
                  customProps: {
                    sidebar_badge: {
                      variant: "orange",
                      children: "Deprecated",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: "doc",
          id: "development/logging/index",
          label: "Logging",
        },
        {
          type: "category",
          label: "Module",
          items: [
            {
              type: "doc",
              id: "development/modules/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/modules/create",
              label: "Create a Module",
            },
            {
              type: "doc",
              id: "development/modules/publish",
              label: "Publish a Module",
            },
          ],
        },
        {
          type: "category",
          label: "Plugin",
          items: [
            {
              type: "doc",
              id: "development/plugins/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/plugins/create",
              label: "Create a Plugin",
            },
            {
              type: "doc",
              id: "development/plugins/publish",
              label: "Publish a Plugin",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Advanced Concepts",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: false,
      items: [
        {
          type: "category",
          label: "Cache",
          items: [
            {
              type: "doc",
              id: "development/cache/overview",
              label: "Cache",
            },
            {
              type: "html",
              value: "Available Modules",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/cache/modules/redis",
              label: "Redis",
            },
            {
              type: "doc",
              id: "development/cache/modules/in-memory",
              label: "In-Memory",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/cache/create",
              label: "Create a Cache Module",
            },
          ],
        },
        {
          type: "category",
          label: "Publishable API Key",
          items: [
            {
              type: "doc",
              id: "development/publishable-api-keys/index",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/publishable-api-keys/admin/manage-publishable-api-keys",
              label: "Admin: Manage Publishable API Keys",
            },
            {
              type: "doc",
              id: "development/publishable-api-keys/storefront/use-in-requests",
              label: "Storefront: Use in Requests",
            },
          ],
        },
        {
          type: "category",
          label: "Notification",
          items: [
            {
              type: "doc",
              id: "development/notification/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "references/notification/classes/notification.AbstractNotificationService",
              label: "Create a Notification Provider",
            },
          ],
        },
        {
          type: "category",
          label: "File Service",
          items: [
            {
              type: "doc",
              id: "development/file-service/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "references/file/classes/file.AbstractFileService",
              label: "Create a File Service",
            },
          ],
        },
        {
          type: "category",
          label: "Search Service",
          items: [
            {
              type: "doc",
              id: "development/search/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "references/search/classes/search.AbstractSearchService",
              label: "Create a Search Service",
            },
          ],
        },
        {
          type: "category",
          label: "Idempotency Key",
          items: [
            {
              type: "doc",
              id: "development/idempotency-key/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/idempotency-key/use-service",
              label: "Use IdempotencyKeyService",
            },
          ],
        },
        {
          type: "category",
          label: "Batch Job",
          items: [
            {
              type: "doc",
              id: "development/batch-jobs/index",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/batch-jobs/create",
              label: "Create Batch Job Strategy",
            },
            {
              type: "doc",
              id: "development/batch-jobs/customize-import",
              label: "Customize Import Strategy",
            },
          ],
        },
        {
          type: "category",
          label: "Strategy",
          items: [
            {
              type: "doc",
              id: "development/strategies/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/strategies/override-strategy",
              label: "Override a Strategy",
            },
          ],
        },
        {
          type: "doc",
          id: "development/worker-mode/index",
          label: "Worker Mode",
        },
        {
          type: "category",
          label: "Feature Flag",
          items: [
            {
              type: "doc",
              id: "development/feature-flags/overview",
              label: "Overview",
            },
            {
              type: "html",
              value: "How-to",
              customProps: {
                sidebar_is_group_divider: true,
              },
            },
            {
              type: "doc",
              id: "development/feature-flags/toggle",
              label: "Toggle Feature Flags",
            },
          ],
        },
        {
          type: "doc",
          id: "development/fundamentals/transaction-orchestrator",
          label: "Transaction Orchestrator",
        },
      ],
    },
    {
      type: "ref",
      label: "Experimental Features",
      id: "experimental/index",
      customProps: {
        sidebar_is_group_headline: true,
      },
    },
  ],
  upgradeGuides: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "upgrade-guides/index",
      label: "Upgrade Guides",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "cog-six-tooth",
      },
    },
    {
      type: "category",
      label: "Backend",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "upgrade-guides/medusa-core",
          customProps: {
            reverse: true,
          },
        },
      ],
    },
    {
      type: "category",
      label: "Medusa React",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "upgrade-guides/medusa-react",
          customProps: {
            reverse: true,
          },
        },
      ],
    },
    {
      type: "category",
      label: "Admin Dashboard",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "upgrade-guides/admin",
          customProps: {
            reverse: true,
          },
        },
      ],
    },
    {
      type: "category",
      label: "Medusa UI",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      link: {
        type: "doc",
        id: "upgrade-guides/medusa-ui/index",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "upgrade-guides/medusa-ui",
          customProps: {
            reverse: true,
          },
        },
      ],
    },
    {
      type: "category",
      label: "Modules",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "upgrade-guides/modules",
        },
      ],
    },
    {
      type: "category",
      label: "Plugins",
      collapsed: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "upgrade-guides/plugins",
        },
      ],
    },
  ],
  troubleshooting: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "html",
      value: "Troubleshooting",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "bug",
      },
    },
    {
      type: "category",
      label: "Installation",
      items: [
        {
          type: "doc",
          id: "troubleshooting/create-medusa-app-errors",
          label: "Create Medusa App Errors",
        },
        {
          type: "doc",
          id: "troubleshooting/cli-installation-errors",
          label: "Errors Installing CLI",
        },
        {
          type: "doc",
          id: "troubleshooting/common-installation-errors",
          label: "General Errors",
        },
        {
          type: "doc",
          id: "troubleshooting/errors-after-update",
          label: "Errors After Update",
        },
      ],
    },
    {
      type: "category",
      label: "Medusa Backend",
      items: [
        {
          type: "doc",
          id: "troubleshooting/mime-error",
          label: "Mime Error",
        },
        {
          type: "doc",
          id: "troubleshooting/eaddrinuse",
          label: "EADDRINUSE Error",
        },
        {
          type: "doc",
          id: "troubleshooting/database-error",
          label: "Database Errors",
        },
        {
          type: "doc",
          id: "troubleshooting/promise-all-rollback",
          label: "Database Transactions and Promise.all",
        },
        {
          type: "doc",
          id: "troubleshooting/redis-events",
          label: "Redis not emitting events",
        },
        {
          type: "doc",
          id: "troubleshooting/awilix-resolution-error",
          label: "Handling AwilixResolutionError",
        },
        {
          type: "doc",
          id: "troubleshooting/missing-payment-providers",
          label: "Payment provider missing",
        },
      ],
    },
    {
      type: "category",
      label: "Upgrade",
      items: [
        {
          type: "doc",
          id: "troubleshooting/upgrade-beta",
          label: "Upgrading Beta Versions",
        },
      ],
    },
    {
      type: "category",
      label: "Frontend",
      items: [
        {
          type: "doc",
          id: "troubleshooting/cors-issues",
          label: "CORS issues",
        },
      ],
    },
    {
      type: "category",
      label: "Admin Dashboard",
      items: [
        {
          type: "doc",
          id: "troubleshooting/signing-in-to-admin",
          label: "Signing in to the Admin Dashboard",
        },
        {
          type: "doc",
          id: "troubleshooting/custom-hooks-error",
          label: "Custom Hooks Error",
        },
        {
          type: "doc",
          id: "troubleshooting/admin-webpack-build-types",
          label: "Webpack Build Error",
        },
      ],
    },
    {
      type: "category",
      label: "Plugin",
      items: [
        {
          type: "doc",
          id: "troubleshooting/s3-acl-error",
          label: "S3 Plugin ACL Error",
        },
      ],
    },
    {
      type: "category",
      label: "Other",
      items: [
        {
          type: "doc",
          id: "troubleshooting/documentation-error",
          label: "Documentation Error",
        },
      ],
    },
  ],
  plugins: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "plugins/overview",
      label: "Plugins",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "squares-plus-solid",
      },
    },
    [
      {
        type: "category",
        label: "Analytics",
        link: {
          type: "doc",
          id: "plugins/analytics/index",
        },
        collapsible: false,
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/analytics/segment",
            label: "Segment",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Segment with the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "CMS",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/cms/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            label: "Contentful",
            id: "plugins/cms/contentful",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Contentful with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/cms/strapi",
            label: "Strapi",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Strapi with the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "Notifications",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/notifications/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/notifications/sendgrid",
            label: "SendGrid",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate SendGrid with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/notifications/mailchimp",
            label: "Mailchimp",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Mailchimp with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/notifications/twilio-sms",
            label: "Twilio SMS",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Twilio SMS with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/notifications/slack",
            label: "Slack",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Slack with the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "Payment",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/payment/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/payment/klarna",
            label: "Klarna",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Klarna with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/payment/paypal",
            label: "PayPal",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate PayPal with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/payment/stripe",
            label: "Stripe",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Stripe with the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "Fulfillment",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/fulfillment/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/fulfillment/webshipper",
            label: "Webshipper",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Webshipper with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/fulfillment/manual",
            label: "Manual Fulfillment",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate manual fulfillment in the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "Search",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/search/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/search/algolia",
            label: "Algolia",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Algolia with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/search/meilisearch",
            label: "MeiliSearch",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate MeiliSearch with the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "File Service",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/file-service/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/file-service/minio",
            label: "MinIO",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate MinIO with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/file-service/s3",
            label: "S3",
            customProps: {
              iconName: "bolt-solid",
              description: "Learn how to integrate S3 with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/file-service/spaces",
            label: "Spaces",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Spaces with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/file-service/local",
            label: "Local File Storage",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to use local file storage in your Medusa backend",
            },
          },
        ],
      },
      {
        type: "category",
        label: "ERP",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/erp/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/erp/brightpearl",
            label: "Brightpearl",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Brightpearl with the Medusa backend.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "Source",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/source/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/source/shopify",
            label: "Shopify",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to install this plugin to migrate data from Shopify.",
            },
          },
        ],
      },
      {
        type: "category",
        label: "Other",
        collapsible: false,
        link: {
          type: "doc",
          id: "plugins/other/index",
        },
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          {
            type: "doc",
            id: "plugins/other/ip-lookup",
            label: "IP Lookup",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate ipstack to access the user's region.",
            },
          },
          {
            type: "doc",
            id: "plugins/other/restock-notifications",
            label: "Restock Notifications",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate restock notifications with the Medusa backend.",
            },
          },
          {
            type: "doc",
            id: "plugins/other/discount-generator",
            label: "Discount Generator",
            customProps: {
              iconName: "bolt-solid",
              description: "Learn how to add a discount generator in Medusa.",
            },
          },
          {
            type: "doc",
            id: "plugins/other/wishlist",
            label: "Wishlist",
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to add wishlists for customers in Medusa.",
            },
          },
        ],
      },
    ],
  ],
  userGuideSidebar: [
    {
      type: "doc",
      id: "user-guide",
      label: "User Guide",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "user",
      },
    },
    {
      type: "autogenerated",
      dirName: "user-guide",
    },
  ],
  experimentalSidebar: [
    {
      type: "ref",
      id: "development/overview",
      label: "Back to Medusa Development",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "experimental/index",
      label: "Experimental",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "beaker",
      },
    },
    {
      type: "category",
      label: "Pricing Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/pricing/overview",
        },
        {
          type: "doc",
          label: "Install in Medusa",
          id: "experimental/pricing/install-medusa",
        },
        {
          type: "doc",
          label: "Install in Node.js",
          id: "experimental/pricing/install-nodejs",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/pricing/examples",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Pricing Concepts",
          id: "experimental/pricing/concepts",
        },
        {
          type: "doc",
          label: "Prices Calculation",
          id: "experimental/pricing/prices-calculation",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/pricing/interfaces/pricing.IPricingModuleService",
          label: "Interface Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Product Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/product/overview",
        },
        {
          type: "doc",
          label: "Install in Medusa",
          id: "experimental/product/install-medusa",
        },
        {
          type: "doc",
          label: "Install in Node.js",
          id: "experimental/product/install-nodejs",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/product/examples",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/product/interfaces/product.IProductModuleService",
          label: "Interface Reference",
        },
      ],
    },
  ],
  servicesSidebar: [
    {
      type: "ref",
      id: "development/overview",
      label: "Back to Medusa Development",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "html",
      value: "Services Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "autogenerated",
      dirName: "references/services/classes",
    },
  ],
  jsClientSidebar: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "js-client/overview",
      label: "Medusa JS Client",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "javascript",
      },
    },
    {
      type: "category",
      collapsed: false,
      label: "Resources",
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "category",
          label: "admin",
          collapsed: true,
          link: {
            type: "doc",
            id: "references/js_client/classes/js_client.Admin",
          },
          items: [
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminAuthResource",
              label: "auth",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminBatchJobsResource",
              label: "batchJobs",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminCollectionsResource",
              label: "collections",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminCurrenciesResource",
              label: "currencies",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminCustomResource",
              label: "custom",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminCustomerGroupsResource",
              label: "customerGroups",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminCustomersResource",
              label: "customers",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminDiscountsResource",
              label: "discounts",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminDraftOrdersResource",
              label: "draftOrders",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminGiftCardsResource",
              label: "giftCards",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminInventoryItemsResource",
              label: "inventoryItems",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminInvitesResource",
              label: "invites",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminNotesResource",
              label: "notes",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminNotificationsResource",
              label: "notifications",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminOrderEditsResource",
              label: "orderEdits",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminOrdersResource",
              label: "orders",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminPaymentCollectionsResource",
              label: "paymentCollections",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminPaymentsResource",
              label: "payments",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminPriceListResource",
              label: "priceLists",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminProductCategoriesResource",
              label: "productCategories",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminProductTagsResource",
              label: "productTags",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminProductTypesResource",
              label: "productTypes",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminProductsResource",
              label: "products",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminPublishableApiKeyResource",
              label: "publishableApiKeys",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminRegionsResource",
              label: "regions",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminReservationsResource",
              label: "reservations",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminReturnReasonsResource",
              label: "returnReasons",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminReturnsResource",
              label: "returns",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminSalesChannelsResource",
              label: "salesChannels",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminShippingOptionsResource",
              label: "shippingOptions",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminShippingProfilesResource",
              label: "shippingProfiles",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminStockLocationsResource",
              label: "stockLocations",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminStoresResource",
              label: "store",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminSwapsResource",
              label: "swaps",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminTaxRatesResource",
              label: "taxRates",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminUploadsResource",
              label: "uploads",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminUsersResource",
              label: "users",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AdminVariantsResource",
              label: "variants",
            },
          ],
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.AuthResource",
          label: "auth",
        },
        {
          type: "category",
          label: "carts",
          link: {
            type: "doc",
            id: "references/js_client/classes/js_client.CartsResource",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "references/js_client/classes/js_client.LineItemsResource",
              label: "lineItems",
            },
          ],
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.CollectionsResource",
          label: "collections",
        },
        {
          type: "category",
          label: "customers",
          collapsed: true,
          link: {
            type: "doc",
            id: "references/js_client/classes/js_client.CustomersResource",
          },
          items: [
            {
              type: "doc",
              id: "references/js_client/classes/js_client.AddressesResource",
              label: "addresses",
            },
            {
              type: "doc",
              id: "references/js_client/classes/js_client.PaymentMethodsResource",
              label: "paymentMethods",
            },
          ],
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.GiftCardsResource",
          label: "giftCards",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.OrderEditsResource",
          label: "orderEdits",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.OrdersResource",
          label: "orders",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.PaymentCollectionsResource",
          label: "paymentCollections",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.PaymentMethodsResource",
          label: "paymentMethods",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ProductCategoriesResource",
          label: "productCategories",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ProductTagsResource",
          label: "productTags",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ProductTypesResource",
          label: "productTypes",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ProductTypesResource",
          label: "productTypes",
        },
        {
          type: "category",
          label: "products",
          link: {
            type: "doc",
            id: "references/js_client/classes/js_client.ProductsResource",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "references/js_client/classes/js_client.ProductVariantsResource",
              label: "variants",
            },
          ],
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.RegionsResource",
          label: "regions",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ReturnReasonsResource",
          label: "returnReasons",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ReturnsResource",
          label: "returns",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.ShippingOptionsResource",
          label: "shippingOptions",
        },
        {
          type: "doc",
          id: "references/js_client/classes/js_client.SwapsResource",
          label: "swaps",
        },
      ],
    },
  ],
  entitiesSidebar: [
    {
      type: "ref",
      id: "development/overview",
      label: "Back to Medusa Development",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "html",
      value: "Entities Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "autogenerated",
      dirName: "references/entities/classes",
    },
  ],
  pricingReference: [
    {
      type: "ref",
      id: "experimental/index",
      label: "Back to Experimental Features",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "references/pricing/interfaces/pricing.IPricingModuleService",
      label: "Pricing Module Interface Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "category",
      label: "Methods",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/pricing/IPricingModuleService/methods",
        },
      ],
    },
  ],
  productReference: [
    {
      type: "ref",
      id: "experimental/index",
      label: "Back to Experimental Features",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "references/product/interfaces/product.IProductModuleService",
      label: "Product Module Interface Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "category",
      label: "Methods",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/product/IProductModuleService/methods",
        },
      ],
    },
  ],
  inventoryReference: [
    {
      type: "ref",
      id: "modules/overview",
      label: "Back to Commerce Modules",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "references/inventory/interfaces/inventory.IInventoryService",
      label: "Inventory Module Interface Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "category",
      label: "Methods",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/inventory/IInventoryService/methods",
        },
      ],
    },
  ],
  stockLocationReference: [
    {
      type: "ref",
      id: "modules/overview",
      label: "Back to Commerce Modules",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "references/stock_location/interfaces/stock_location.IStockLocationService",
      label: "Stock Location Module Interface Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "category",
      label: "Methods",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/stock_location/IStockLocationService/methods",
        },
      ],
    },
  ],
  workflowsSidebar: [
    {
      type: "ref",
      id: "development/overview",
      label: "Back to Medusa Development",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "references/modules/workflows",
      label: "Workflows API Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "category",
      label: "Functions",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/workflows/functions",
        },
      ],
    },
  ],
  medusaReactSidebar: [
    {
      type: "ref",
      id: "homepage",
      label: "Back to home",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "medusa-react/overview",
      label: "Medusa React Reference",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "folder-open",
      },
    },
    {
      type: "category",
      label: "Hooks",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      link: {
        type: "doc",
        id: "references/medusa_react/medusa_react.Hooks",
      },
      items: [
        {
          type: "category",
          label: "Admin",
          collapsible: true,
          link: {
            type: "doc",
            id: "references/medusa_react/Hooks/medusa_react.Hooks.Admin",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "references/medusa_react/Hooks/Admin",
            },
          ],
        },
        {
          type: "category",
          label: "Store",
          collapsible: true,
          link: {
            type: "doc",
            id: "references/medusa_react/Hooks/medusa_react.Hooks.Store",
          },
          items: [
            {
              type: "autogenerated",
              dirName: "references/medusa_react/Hooks/Store",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Providers",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      link: {
        type: "doc",
        id: "references/medusa_react/medusa_react.Providers",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/medusa_react/Providers",
        },
      ],
    },
    {
      type: "category",
      label: "Utilities",
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true,
      },
      link: {
        type: "doc",
        id: "references/medusa_react/medusa_react.Utilities",
      },
      items: [
        {
          type: "autogenerated",
          dirName: "references/medusa_react/Utilities/functions",
        },
      ],
    },
  ],
}
