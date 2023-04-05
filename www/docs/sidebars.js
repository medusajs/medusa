/**
 * Custom sidebar definitions:
 * - To declare a sidebar element as part of the homepage sidebar, add className: 'homepage-sidebar-item'
 * - To add an icon:
 *   - add the icon in www/docs/src/theme/Icon/<IconName>/index.js as a React SVG element if it doesn't exist, where `<IconName>` is the camel case name of the icon
 *   - add the mapping to the icon in www/docs/src/theme/Icon/index.js
 *   - add in customProps sidebar_icon: 'icon-name'
 * - To add a divider line, add in customProps sidebar_is_divider_line: true and set value/label to any value
 * - To add a group divider add in customProps sidebar_is_group_divider: true and set the label/value to the title that should appear in the divider.
 * - To add a back item, add in customProps:
 *   - sidebar_is_back_link: true
 *   - sidebar_icon: `back-arrow`
 * - To add a sidebar title, add in customProps sidebar_is_title: true
 * - To add a group headline, add in customProps sidebar_is_group_headline: true
 * - To add a coming soon link (with a badge), add in customProps sidebar_is_soon: true
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
      type: "doc",
      id: "admin/quickstart",
      label: "Admin Dashboard",
      customProps: {
        sidebar_icon: "computer-desktop",
      },
      className: "homepage-sidebar-item",
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
      label: "Next.js Storefront",
      customProps: {
        sidebar_icon: "nextjs",
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
      type: "category",
      label: "Deploy",
      customProps: {
        sidebar_icon: "cloud-arrow-up",
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
              id: "deployments/server/deploying-on-qovery",
              label: "Deploy on Qovery",
              customProps: {
                image:
                  "https://res.cloudinary.com/dza7lstvk/image/upload/v1669739955/Medusa%20Docs/Other/qOvY2dN_vogsxy.png",
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
          ],
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
          ],
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
              id: "deployments/storefront/deploying-gatsby-on-netlify",
              label: "Deploy Gatsby on Netlify",
              customProps: {
                image:
                  "https://res.cloudinary.com/dza7lstvk/image/upload/v1679574027/Medusa%20Docs/Other/gCbsCvX_h7nijn.png",
                badge: {
                  variant: "orange",
                  children: "Deprecated",
                },
              },
            },
          ],
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
      type: "category",
      label: "Troubleshooting",
      customProps: {
        sidebar_icon: "bug",
      },
      items: [
        {
          type: "category",
          label: "Installation Errors",
          items: [
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
          label: "Medusa Backend Errors",
          items: [
            {
              type: "doc",
              id: "troubleshooting/database-error",
              label: "Database SASL Error",
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
              id: "troubleshooting/transaction-error-in-checkout",
              label: "Error 409 in checkout",
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
          label: "Frontend Errors",
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
          label: "Admin Dashboard Errors",
          items: [
            {
              type: "doc",
              id: "troubleshooting/signing-in-to-admin",
              label: "Signing in to the Admin Dashboard",
            },
          ],
        },
        {
          type: "category",
          label: "Plugin Errors",
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
          label: "Other Errors",
          items: [
            {
              type: "doc",
              id: "troubleshooting/documentation-error",
              label: "Documentation Error",
            },
          ],
        },
      ],
      className: "homepage-sidebar-item",
    },
    {
      type: "doc",
      id: "contribution-guidelines",
      label: "Contribution Guidelines",
      customProps: {
        sidebar_icon: "document-text",
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
          type: "link",
          href: "#",
          label: "Currencies",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "link",
          href: "#",
          label: "Admin: Manage Currencies",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "link",
          href: "#",
          label: "Backend: Send SignUp Email",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "link",
          href: "#",
          label: "Products",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "doc",
          id: "modules/products/categories",
          label: "Categories",
        },
        {
          type: "link",
          href: "#",
          label: "Collections",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Products",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "doc",
          id: "modules/products/admin/manage-categories",
          label: "Admin: Manage Categories",
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Collections",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "doc",
          id: "modules/products/admin/import-products",
          label: "Admin: Import Products",
        },
        {
          type: "link",
          href: "#",
          label: "Storefront: Show Products",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "doc",
          id: "modules/products/store/use-categories",
          label: "Storefront: Use Categories",
        },
        {
          type: "link",
          href: "#",
          label: "Storefront: Show Collections",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "link",
          href: "#",
          label: "Cart",
          customProps: {
            sidebar_is_soon: true,
          },
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
          id: "modules/carts-and-checkout/backend/add-fulfillment-provider",
          label: "Backend: Create Fulfillment Provider",
        },
        {
          type: "doc",
          id: "modules/carts-and-checkout/backend/add-payment-provider",
          label: "Backend: Create Payment Provider",
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
          type: "link",
          href: "#",
          label: "Orders",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Swaps",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Returns",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Claims",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Draft Orders",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Fulfillment",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Backend: Send Confirmation Email",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "doc",
          id: "modules/orders/backend/handle-order-claim-event",
          label: "Backend: Send Order Claim Email",
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Orders",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "doc",
          id: "modules/orders/admin/edit-order",
          label: "Admin: Edit an Order",
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Swaps",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Returns",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Claims",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Draft Orders",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Return Reasons",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Storefront: Manage Customer Orders",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Storefront: Create a Swap",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Storefront: Create a Return",
          customProps: {
            sidebar_is_soon: true,
          },
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
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Stock Locations",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Inventory",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Allocations in Orders",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "link",
          href: "#",
          label: "Taxes",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "link",
          href: "#",
          label: "Backend: Create Tax Provider",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Taxes",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Tax Rates",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Tax Overrides",
          customProps: {
            sidebar_is_soon: true,
          },
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
          type: "doc",
          id: "modules/price-lists/price-selection-strategy",
          label: "Price Selection Strategy",
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
          id: "modules/price-lists/backend/override-price-selection-strategy",
          label: "Backend: Override Price Selection",
        },
        {
          type: "doc",
          id: "modules/price-lists/admin/manage-price-lists",
          label: "Admin: Manage Price Lists",
        },
        {
          type: "doc",
          id: "modules/price-lists/admin/import-prices",
          label: "Admin: Import Prices",
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
          type: "link",
          href: "#",
          label: "Users",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Invites",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "html",
          value: "How-to",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Backend: Send Invite",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Profile",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Users",
          customProps: {
            sidebar_is_soon: true,
          },
        },
        {
          type: "link",
          href: "#",
          label: "Admin: Manage Invites",
          customProps: {
            sidebar_is_soon: true,
          },
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
          id: "development/backend/install",
          label: "Backend Quickstart",
        },
        {
          type: "doc",
          id: "development/backend/prepare-environment",
          label: "Prepare Environment",
        },
        {
          type: "doc",
          id: "development/backend/configurations",
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
          label: "Entities",
          items: [
            {
              type: "doc",
              id: "development/entities/overview",
              label: "Overview",
            },
            {
              type: "doc",
              id: "development/entities/migrations/overview",
              label: "Migrations",
            },
            {
              type: "ref",
              id: "references/entities/classes/Address",
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
          label: "Endpoints",
          items: [
            {
              type: "doc",
              id: "development/endpoints/overview",
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
              id: "development/endpoints/create",
              label: "Create an Endpoint",
            },
            {
              type: "doc",
              id: "development/endpoints/add-middleware",
              label: "Middlewares",
            },
            {
              type: "doc",
              id: "development/endpoints/example-logged-in-user",
              label: "Example: Logged-In User",
            },
          ],
        },
        {
          type: "category",
          label: "Services",
          items: [
            {
              type: "doc",
              id: "development/services/overview",
              label: "Overview",
            },
            {
              type: "ref",
              id: "references/services/classes/AuthService",
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
          label: "Modules",
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
          label: "Events",
          items: [
            {
              type: "doc",
              id: "development/events/index",
              label: "Overview",
            },
            {
              type: "doc",
              id: "development/events/subscribers",
              label: "Subscribers",
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
              type: "doc",
              id: "development/events/create-subscriber",
              label: "Create a Subscriber",
            },
          ],
        },
        {
          type: "category",
          label: "Scheduled Jobs",
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
              type: "doc",
              id: "development/scheduled-jobs/create",
              label: "Create a Scheduled Job",
            },
          ],
        },
        {
          type: "category",
          label: "Plugins",
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
        {
          type: "category",
          label: "Publishable API Keys",
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
          label: "Notifications",
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
              id: "development/notification/create-notification-provider",
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
              type: "link",
              href: "#",
              label: "Create a File Service",
              customProps: {
                sidebar_is_soon: true,
              },
            },
          ],
        },
        {
          type: "category",
          label: "Batch Jobs",
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
          label: "Strategies",
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
              type: "link",
              href: "#",
              label: "Create a Strategy",
              customProps: {
                sidebar_is_soon: true,
              },
            },
            {
              type: "link",
              href: "#",
              label: "Override a Strategy",
              customProps: {
                sidebar_is_soon: true,
              },
            },
          ],
        },
        {
          type: "category",
          label: "Feature Flags",
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
            type: "category",
            label: "Contentful",
            link: {
              type: "doc",
              id: "plugins/cms/contentful/index",
            },
            customProps: {
              iconName: "bolt-solid",
              description:
                "Learn how to integrate Contentful with the Medusa backend.",
            },
            items: [
              {
                type: "doc",
                id: "plugins/cms/contentful/customize-contentful",
                label: "Customize Integration",
              },
            ],
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
      type: 'doc',
      id: 'js-client/overview',
      label: 'Medusa JS Client',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'javascript',
      }
    },
    {
      type: 'category',
      collapsed: false,
      label: "Resources",
      customProps: {
        sidebar_is_group_headline: true,
      },
      items: [
        {
          type: 'category',
          label: 'admin',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'references/js-client/classes/Admin',
          },
          items: [
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminAuthResource',
              label: 'auth',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminBatchJobsResource',
              label: 'batchJobs',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminCollectionsResource',
              label: 'collections',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminCurrenciesResource',
              label: 'currencies',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminCustomerGroupsResource',
              label: 'customerGroups',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminCustomersResource',
              label: 'customers',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminDiscountsResource',
              label: 'discounts',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminDraftOrdersResource',
              label: 'draftOrders',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminGiftCardsResource',
              label: 'giftCards',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminInvitesResource',
              label: 'invites',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminNotesResource',
              label: 'notes',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminNotificationsResource',
              label: 'notifications',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminOrdersResource',
              label: 'orders',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminOrderEditsResource',
              label: 'orderEdits',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminPriceListResource',
              label: 'priceLists',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminProductsResource',
              label: 'products',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminProductTagsResource',
              label: 'productTags',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminProductTypesResource',
              label: 'productTypes',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminRegionsResource',
              label: 'regions',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminReturnReasonsResource',
              label: 'returnReasons',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminReturnsResource',
              label: 'returns',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminSalesChannelsResource',
              label: 'salesChannels',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminShippingOptionsResource',
              label: 'shippingOptions',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminShippingProfilesResource',
              label: 'shippingProfiles',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminStoresResource',
              label: 'store',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminSwapsResource',
              label: 'swaps',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminTaxRatesResource',
              label: 'taxRates',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminUploadsResource',
              label: 'uploads',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminUsersResource',
              label: 'users',
            },
            {
              type: 'doc',
              id: 'references/js-client/classes/AdminVariantsResource',
              label: 'variants',
            },
          ],
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/AuthResource',
          label: 'auth',
        },
        {
          type: 'category',
          label: 'carts',
          link: {
            type: 'doc',
            id: 'references/js-client/classes/CartsResource',
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/LineItemsResource",
              label: "lineItems",
            },
          ],
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/CollectionsResource',
          label: 'collections',
        },
        {
          type: 'category',
          label: 'customers',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'references/js-client/classes/CustomerResource',
          },
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/AddressesResource",
              label: "addresses",
            },
            {
              type: "doc",
              id: "references/js-client/classes/PaymentMethodsResource",
              label: "paymentMethods",
            },
          ],
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/GiftCardsResource',
          label: 'giftCards',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/OrdersResource',
          label: 'orders',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/OrderEditsResource',
          label: 'orderEdits',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/PaymentMethodsResource',
          label: 'paymentMethods',
        },
        {
          type: 'category',
          label: 'products',
          link: {
            type: 'doc',
            id: 'references/js-client/classes/ProductsResource',
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/ProductVariantsResource",
              label: "variants",
            },
          ],
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/RegionsResource',
          label: 'regions',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/ReturnReasonsResource',
          label: 'returnReasons',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/ReturnsResource',
          label: 'returns',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/ShippingOptionsResource',
          label: 'shippingOptions',
        },
        {
          type: 'doc',
          id: 'references/js-client/classes/SwapsResource',
          label: 'swaps',
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
}
