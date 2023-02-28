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
      type: 'doc',
      id: 'homepage',
      label: 'Overview',
      customProps: {
        sidebar_icon: 'book-open',
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'usage/create-medusa-app',
      label: 'Create Medusa App',
      customProps: {
        sidebar_icon: 'rocket-launch',
      },
      className: 'homepage-sidebar-item',
    },
    {
      type: 'html',
      value: ' ',
      customProps: {
        sidebar_is_divider_line: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'ref',
      id: 'modules/overview',
      label: 'Modules',
      customProps: {
        sidebar_icon: 'sparkles'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'ref',
      id: 'core/overview',
      label: 'Core',
      customProps: {
        sidebar_icon: 'star'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'admin/quickstart',
      label: 'Medusa Admin',
      customProps: {
        sidebar_icon: 'computer-desktop'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'ref',
      id: 'plugins/overview',
      label: 'Plugins',
      customProps: {
        sidebar_icon: 'squares-plus'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: ' ',
      customProps: {
        sidebar_is_divider_line: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: 'Frontend Storefronts',
      customProps: {
        sidebar_is_group_divider: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'starters/nextjs-medusa-starter',
      label: 'Next.js Storefront',
      customProps: {
        sidebar_icon: 'nextjs'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'starters/gatsby-medusa-starter',
      label: 'Gatsby Storefront',
      customProps: {
        sidebar_icon: 'gatsby'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: ' ',
      customProps: {
        sidebar_is_divider_line: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: 'SDKs',
      customProps: {
        sidebar_is_group_divider: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'ref',
      id: 'js-client/overview',
      label: 'JavaScript Client',
      customProps: {
        sidebar_icon: 'javascript'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'medusa-react/overview',
      label: 'Medusa React',
      customProps: {
        sidebar_icon: 'react'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: ' ',
      customProps: {
        sidebar_is_divider_line: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: 'CLI Tools',
      customProps: {
        sidebar_is_group_divider: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'cli/reference',
      label: 'Medusa CLI',
      customProps: {
        sidebar_icon: 'command-line'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'doc',
      id: 'usage/local-development',
      label: 'Medusa Dev CLI',
      customProps: {
        sidebar_icon: 'tools'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: ' ',
      customProps: {
        sidebar_is_divider_line: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'html',
      value: 'Additional Resources',
      customProps: {
        sidebar_is_group_divider: true
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'category',
      label: 'Deploy',
      customProps: {
        sidebar_icon: 'cloud-arrow-up'
      },
      items: [
        {
          type: "category",
          label: "Backend",
          link: {
            type: "doc",
            id: "deployments/server/index"
          },
          items: [
            {
              type: "doc",
              id: "deployments/server/deploying-on-heroku",
              label: "Deploy on Heroku",
              customProps: {
                image: 'https://res.cloudinary.com/dza7lstvk/image/upload/v1669739927/Medusa%20Docs/Other/xNvxSkf_l230wq.png'
              }
            },
            {
              type: "doc",
              id: "deployments/server/deploying-on-digital-ocean",
              label: "Deploy on DigitalOcean",
              customProps: {
                image: 'https://res.cloudinary.com/dza7lstvk/image/upload/v1669739945/Medusa%20Docs/Other/aahqJp4_lbtfdz.png'
              }
            },
            {
              type: "doc",
              id: "deployments/server/deploying-on-qovery",
              label: "Deploy on Qovery",
              customProps: {
                image: 'https://res.cloudinary.com/dza7lstvk/image/upload/v1669739955/Medusa%20Docs/Other/qOvY2dN_vogsxy.png'
              }
            },
            {
              type: "doc",
              id: "deployments/server/deploying-on-railway",
              label: "Deploy on Railway",
              customProps: {
                themedImage: {
                  light: 'https://res.cloudinary.com/dza7lstvk/image/upload/v1669741520/Medusa%20Docs/Other/railway-light_fzuyeo.png',
                  dark: 'https://res.cloudinary.com/dza7lstvk/image/upload/v1669741520/Medusa%20Docs/Other/railway-dark_kkzuwh.png'
                }
              }
            }
          ]
        },
        {
          type: "category",
          label: "Admin",
          link: {
            type: "doc",
            id: "deployments/admin/index"
          },
          items: [
            {
              type: "doc",
              id: "deployments/admin/deploying-on-netlify",
              label: "Deploy on Netlify",
              customProps: {
                image: 'https://i.imgur.com/gCbsCvX.png'
              }
            },
          ]
        },
        {
          type: "category",
          label: "Storefront",
          link: {
            type: "doc",
            id: "deployments/storefront/index"
          },
          items: [
            {
              type: "doc",
              id: "deployments/storefront/deploying-gatsby-on-netlify",
              label: "Deploy Gatsby on Netlify",
              customProps: {
                image: 'https://i.imgur.com/gCbsCvX.png'
              }
            },
          ]
        },
      ],
      className: 'homepage-sidebar-item'
    },
    {
      type: 'ref',
      id: 'advanced/backend/upgrade-guides/index',
      label: 'Upgrade Guides',
      customProps: {
        sidebar_icon: 'cog-six-tooth'
      },
      className: 'homepage-sidebar-item'
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      customProps: {
        sidebar_icon: 'bug'
      },
      items: [
        {
          type: "doc",
          id: "troubleshooting/cli-installation-errors",
          label: "Errors Installing CLI",
        },
        {
          type: "doc",
          id: "troubleshooting/common-installation-errors",
          label: "Installation Errors",
        },
        {
          type: "doc",
          id: "troubleshooting/errors-after-update",
          label: "Errors After Update",
        },
        {
          type: "doc",
          id: "troubleshooting/database-error",
          label: "Database SASL Error",
        },
        {
          type: "doc",
          id: "troubleshooting/cors-issues",
          label: "CORS issues",
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
        {
          type: "doc",
          id: "troubleshooting/redis-events",
          label: "Redis not emitting events",
        },
        {
          type: "doc",
          id: "troubleshooting/signing-in-to-admin",
          label: "Signing in to Medusa Admin",
        },
        {
          type: "doc",
          id: "troubleshooting/s3-acl-error",
          label: "S3 Plugin ACL Error",
        },
        {
          type: "doc",
          id: "troubleshooting/documentation-error",
          label: "Documentation Error",
        },
      ],
      className: 'homepage-sidebar-item'
    },
    {
      type: "doc",
      id: "contribution-guidelines",
      label: "Contribution Guidelines",
      customProps: {
        sidebar_icon: 'document-text'
      },
      className: 'homepage-sidebar-item',
    },
    {
      type: "doc",
      id: "usage",
      label: "Usage",
      customProps: {
        sidebar_icon: 'light-bulb'
      },
      className: 'homepage-sidebar-item',
    },
  ],
  modules: [
    {
      type: 'ref',
      id: 'homepage',
      label: 'Back to home',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: 'doc',
      id: 'modules/overview',
      label: 'Modules',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'sparkles'
      }
    },
    {
      type: 'category',
      label: 'Regions and Currencies',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'modules/regions-and-currencies/overview',
          label: 'Overview'
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'modules/regions-and-currencies/regions',
          label: 'Regions'
        },
        {
          type: 'link',
          href: '#',
          label: 'Currencies',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'modules/regions-and-currencies/admin/manage-regions',
          label: 'Admin: Manage Regions'
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Currencies',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'modules/regions-and-currencies/storefront/use-regions',
          label: 'Storefront: Use Regions'
        },
      ]
    },
    {
      type: 'category',
      label: 'Customers',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'modules/customers/overview',
          label: 'Overview'
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'modules/customers/customers',
          label: 'Customers'
        },
        {
          type: 'doc',
          id: 'modules/customers/customer-groups',
          label: 'Customer Groups'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Backend: Send SignUp Email',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'modules/customers/admin/manage-customers',
          label: 'Admin: Manage Customers'
        },
        {
          type: 'doc',
          id: 'modules/customers/admin/manage-customer-groups',
          label: 'Admin: Manage Customer Groups'
        },
        {
          type: 'doc',
          id: 'modules/customers/storefront/implement-customer-profiles',
          label: 'Storefront: Add Customer Profiles'
        },
      ]
    },
    {
      type: 'category',
      label: 'Products',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Products',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Collections',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Products',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Collections',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/admin/import-products',
          label: 'Admin: Import Products'
        },
        {
          type: 'link',
          href: '#',
          label: 'Storefront: Show Products',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Storefront: Show Collections',
          customProps: {
            sidebar_is_soon: true
          }
        },
      ]
    },
    {
      type: 'category',
      label: 'Carts and Checkout',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Cart',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/shipping/overview',
          label: 'Shipping'
        },
        {
          type: 'doc',
          id: 'advanced/backend/payment/overview',
          label: 'Payment'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/shipping/add-fulfillment-provider',
          label: 'Backend: Create Fulfillment Provider'
        },
        {
          type: 'doc',
          id: 'advanced/backend/payment/how-to-create-payment-provider',
          label: 'Backend: Create Payment Provider'
        },
        {
          type: 'doc',
          id: 'guides/carts-in-medusa',
          label: 'Storefront: Implement Cart'
        },
        {
          type: 'doc',
          id: 'advanced/storefront/how-to-implement-checkout-flow',
          label: 'Storefront: Implement Checkout'
        },
      ]
    },
    {
      type: 'category',
      label: 'Orders',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Orders',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Swaps',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Returns',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Claims',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Draft Orders',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Fulfillment',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Backend: Send Confirmation Email',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/ecommerce/handle-order-claim-event',
          label: 'Backend: Send Order Claim Email'
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Orders',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/admin/order-edit',
          label: 'Admin: Edit an Order'
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Swaps',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Returns',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Claims',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Order Drafts',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Return Reasons',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Storefront: Manage Customer Orders',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Storefront: Create a Swap',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Storefront: Create a Return',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/storefront/handle-order-edits',
          label: 'Storefront: Handle Order Edits'
        },
        {
          type: 'doc',
          id: 'advanced/storefront/implement-claim-order',
          label: 'Storefront: Implement Claim Order'
        },
      ]
    },
    {
      type: 'category',
      label: 'Taxes',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Taxes',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/taxes/inclusive-pricing',
          label: 'Tax Inclusive Pricing'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Backend: Create Tax Provider',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Taxes',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Tax Rates',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Tax Overrides',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/taxes/manual-calculation',
          label: 'Storefront: Calculate Taxes Manually'
        }
      ]
    },
    {
      type: 'category',
      label: 'Discounts',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/discounts/index',
          label: 'Discounts',
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/admin/manage-discounts',
          label: 'Admin: Manage Discounts'
        },
        {
          type: 'doc',
          id: 'advanced/storefront/use-discounts-in-checkout',
          label: 'Storefront: Use Discounts in Checkout'
        },
      ]
    },
    {
      type: 'category',
      label: 'Gift Cards',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/gift-cards/index',
          label: 'Gift Cards'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/ecommerce/send-gift-card-to-customer',
          label: 'Backend: Send Gift Card Code'
        },
        {
          type: 'doc',
          id: 'advanced/admin/manage-gift-cards',
          label: 'Admin: Manage Gift Cards'
        },
        {
          type: 'doc',
          id: 'advanced/storefront/use-gift-cards',
          label: 'Storefront: Use Gift Cards'
        },
      ]
    },
    {
      type: 'category',
      label: 'Price Lists',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/price-lists/index',
          label: 'Price Lists'
        },
        {
          type: 'doc',
          id: 'advanced/backend/price-selection-strategy/index',
          label: 'Price Selection Strategy'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/price-selection-strategy/override',
          label: 'Backend: Override Price Selection'
        },
        {
          type: 'doc',
          id: 'advanced/backend/price-lists/use-api',
          label: 'Admin: Manage Price Lists'
        },
        {
          type: 'doc',
          id: 'advanced/admin/import-prices',
          label: 'Admin: Import Prices'
        },
      ]
    },
    {
      type: 'category',
      label: 'Sales Channels',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/sales-channels/index',
          label: 'Sales Channels'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/sales-channels/manage-admin',
          label: 'Admin: Manage Sales Channels'
        },
        {
          type: 'doc',
          id: 'advanced/storefront/use-sales-channels',
          label: 'Storefront: Use Sales Channels'
        },
      ]
    },
    {
      type: 'category',
      label: 'Users',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'Architecture',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Users',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Users',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Admin: Manage Invites',
          customProps: {
            sidebar_is_soon: true
          }
        },
      ]
    },
  ],
  core: [
    {
      type: 'ref',
      id: 'homepage',
      label: 'Back to home',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: 'doc',
      id: 'core/overview',
      label: 'Core Concepts',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'star'
      }
    },
    {
      type: 'category',
      label: 'Backend Setup',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'core/backend/install',
          label: 'Backend Quickstart',
        },
        {
          type: 'doc',
          id: 'tutorial/set-up-your-development-environment',
          label: 'Development Environment'
        },
        {
          type: 'doc',
          id: 'usage/configurations',
          label: 'Configurations',
        },
      ]
    },
    {
      type: 'category',
      label: 'Fundamentals',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Concepts',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/dependency-container/index',
          label: 'Dependency Injection'
        },
      ]
    },
    {
      type: 'category',
      label: 'Entities',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/entities/overview',
          label: 'Overview'
        },
        {
          type: 'doc',
          id: 'advanced/backend/migrations/overview',
          label: 'Migrations'
        },
        {
          type: 'ref',
          id: 'references/entities/classes/Address',
          label: 'Entities Reference'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/entities/index',
          label: 'Create an Entity'
        },
        {
          type: 'doc',
          id: 'advanced/backend/migrations/index',
          label: 'Create a Migration'
        },
      ]
    },
    {
      type: 'category',
      label: 'Endpoints',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/endpoints/add',
          label: 'Create an Endpoint'
        },
        {
          type: 'doc',
          id: 'advanced/backend/endpoints/add-middleware',
          label: 'Add a Middleware'
        },
      ]
    },
    {
      type: 'category',
      label: 'Services',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/services/overview',
          label: 'Overview'
        },
        {
          type: 'doc',
          id: 'references/services/classes/AuthService',
          label: 'Services Reference'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/services/create-service',
          label: 'Create a Service'
        },
      ]
    },
    {
      type: 'category',
      label: 'Events',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/events/architecture',
          label: 'Overview'
        },
        {
          type: 'doc',
          id: 'advanced/backend/subscribers/overview',
          label: 'Subscribers'
        },
        {
          type: 'doc',
          id: 'advanced/backend/subscribers/events-list',
          label: 'Events Reference'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/subscribers/create-subscriber',
          label: 'Create a Subscriber'
        },
      ]
    },
    {
      type: 'category',
      label: 'Scheduled Jobs',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/scheduled-jobs/create',
          label: 'Create a Scheduled Job'
        },
      ]
    },
    {
      type: 'category',
      label: 'Notifications',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/notification/overview',
          label: 'Overview'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/notification/how-to-create-notification-provider',
          label: 'Create a Notification Provider'
        },
      ]
    },
    {
      type: 'category',
      label: 'File Service',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Create a File Service',
          customProps: {
            sidebar_is_soon: true
          }
        },
      ]
    },
    {
      type: 'category',
      label: 'Batch Jobs',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/batch-jobs/index',
          label: 'Overview'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: "doc",
          id: "advanced/backend/batch-jobs/create",
          label: "Create Batch Job Strategy"
        },
        {
          type: 'doc',
          id: 'advanced/backend/batch-jobs/customize-import',
          label: 'Customize Import Strategy'
        },
      ]
    },
    {
      type: 'category',
      label: 'Strategies',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'link',
          href: '#',
          label: 'Create a Strategy',
          customProps: {
            sidebar_is_soon: true
          }
        },
      ]
    },
    {
      type: 'category',
      label: 'Feature Flags',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'link',
          href: '#',
          label: 'Overview',
          customProps: {
            sidebar_is_soon: true
          }
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/feature-flags/toggle',
          label: 'Toggle Feature Flags'
        },
      ]
    },
    {
      type: 'category',
      label: 'Plugins',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/plugins/overview',
          label: 'Overview'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/backend/plugins/create',
          label: 'Create a Plugin'
        },
        {
          type: 'doc',
          id: 'advanced/backend/plugins/publish',
          label: 'Publish a Plugin'
        },
      ]
    },
    {
      type: 'category',
      label: 'Publishable API Keys',
      collapsible: false,
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: 'doc',
          id: 'advanced/backend/publishable-api-keys/index',
          label: 'Overview'
        },
        {
          type: 'html',
          value: 'How-to',
          customProps: {
            sidebar_is_group_divider: true
          }
        },
        {
          type: 'doc',
          id: 'advanced/admin/manage-publishable-api-keys',
          label: 'Admin: Manage Publishable API Keys'
        },
        {
          type: 'link',
          href: '#',
          label: 'Storefront: Use in Requests'
        },
        {
          type: 'doc',
          id: 'usage/local-development',
          label: 'Local Development'
        }
      ]
    },
  ],
  upgradeGuides: [
    {
      type: 'ref',
      id: 'homepage',
      label: 'Back to home',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: 'doc',
      id: 'advanced/backend/upgrade-guides/index',
      label: 'Upgrade Guides',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'cog-six-tooth'
      }
    },
    {
      type: "category",
      label: "Backend",
      collapsible: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'advanced/backend/upgrade-guides/medusa-core'
        }
      ]
    },
    {
      type: "category",
      label: "Medusa React",
      collapsible: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'advanced/backend/upgrade-guides/medusa-react'
        }
      ]
    },
    {
      type: "category",
      label: "Medusa Admin",
      collapsible: false,
      items: [
        {
          type: 'autogenerated',
          dirName: 'advanced/backend/upgrade-guides/admin'
        }
      ]
    }
  ],
  plugins: [
    {
      type: 'ref',
      id: 'homepage',
      label: 'Back to home',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: 'doc',
      id: 'plugins/overview',
      label: 'Plugins',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'bolt'
      }
    },
    [
      {
        type: "category",
        label: "Analytics",
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "add-plugins/segment",
            label: "Segment",
          },
        ],
      },
      {
        type: "category",
        label: "CMS",
        collapsible: false,
        items: [
          {
            type: "category",
            label: "Contentful",
            link: {
              type: "doc",
              id: "add-plugins/contentful/index",
            },
            items: [
              {
                type: "doc",
                id: "add-plugins/contentful/customize-contentful",
                label: "Customize Integration",
              },
            ]
          },
          {
            type: "doc",
            id: "add-plugins/strapi",
            label: "Strapi",
          },
        ],
      },
      {
        type: "category",
        label: "Notifications",
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "add-plugins/sendgrid",
            label: "SendGrid",
          },
          {
            type: "doc",
            id: "add-plugins/mailchimp",
            label: "Mailchimp",
          },
          {
            type: "doc",
            id: "add-plugins/twilio-sms",
            label: "Twilio SMS",
          },
          {
            type: "doc",
            id: "add-plugins/slack",
            label: "Slack",
          },
        ],
      },
      {
        type: "category",
        label: "Payment",
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "add-plugins/klarna",
            label: "Klarna",
          },
          {
            type: "doc",
            id: "add-plugins/paypal",
            label: "PayPal",
          },
          {
            type: "doc",
            id: "add-plugins/stripe",
            label: "Stripe",
          },
        ],
      },
      {
        type: "category",
        label: "Search",
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "add-plugins/algolia",
            label: "Algolia",
          },
          {
            type: "doc",
            id: "add-plugins/meilisearch",
            label: "MeiliSearch",
          },
        ],
      },
      {
        type: "category",
        label: "File Service",
        collapsible: false,
        items: [
          {
            type: "doc",
            id: "add-plugins/minio",
            label: "MinIO",
          },
          {
            type: "doc",
            id: "add-plugins/s3",
            label: "S3",
          },
          {
            type: "doc",
            id: "add-plugins/spaces",
            label: "Spaces",
          },
        ],
      },
    ],
  ],
  userGuideSidebar: [
    {
      type: 'doc',
      id: 'user-guide',
      label: 'User Guide',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'user'
      }
    },
    {
      type: 'autogenerated',
      dirName: 'user-guide'
    }
  ],
  servicesSidebar: [
    {
      type: 'ref',
      id: 'core/overview',
      label: 'Back to core concepts',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: 'html',
      value: 'Services Reference',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'folder-open'
      }
    },
    {
      type: 'autogenerated',
      dirName: 'references/services/classes', // generate sidebar from the docs folder (or versioned_docs/<version>)
    },
  ],
  jsClientSidebar: [
    {
      type: 'ref',
      id: 'homepage',
      label: 'Back to home',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: "doc",
      id: "js-client/overview",
      label: "Medusa JS Client",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'javascript',
      }
    },
    {
      type: "category",
      collapsed: false,
      label: "Resources",
      customProps: {
        sidebar_is_group_headline: true
      },
      items: [
        {
          type: "category",
          label: "admin",
          collapsed: true,
          link: {
            type: "doc",
            id: "references/js-client/classes/Admin",
          },
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/AdminAuthResource",
              label: "auth",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminBatchJobsResource",
              label: "batchJobs",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminCollectionsResource",
              label: "collections",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminCurrenciesResource",
              label: "currencies",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminCustomerGroupsResource",
              label: "customerGroups",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminCustomersResource",
              label: "customers",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminDiscountsResource",
              label: "discounts",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminDraftOrdersResource",
              label: "draftOrders",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminGiftCardsResource",
              label: "giftCards",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminInvitesResource",
              label: "invites",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminNotesResource",
              label: "notes",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminNotificationsResource",
              label: "notifications",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminOrdersResource",
              label: "orders",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminOrderEditsResource",
              label: "orderEdits",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminPriceListResource",
              label: "priceLists",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminProductsResource",
              label: "products",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminProductTagsResource",
              label: "productTags",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminProductTypesResource",
              label: "productTypes",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminRegionsResource",
              label: "regions",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminReturnReasonsResource",
              label: "returnReasons",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminReturnsResource",
              label: "returns",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminSalesChannelsResource",
              label: "salesChannels",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminShippingOptionsResource",
              label: "shippingOptions",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminShippingProfilesResource",
              label: "shippingProfiles",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminStoresResource",
              label: "store",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminSwapsResource",
              label: "swaps",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminTaxRatesResource",
              label: "taxRates",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminUploadsResource",
              label: "uploads",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminUsersResource",
              label: "users",
            },
            {
              type: "doc",
              id: "references/js-client/classes/AdminVariantsResource",
              label: "variants",
            },
          ]
        },
        {
          type: "doc",
          id: "references/js-client/classes/AuthResource",
          label: "auth",
        },
        {
          type: "category",
          label: "carts",
          link: {
            type: "doc",
            id: "references/js-client/classes/CartsResource",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/LineItemsResource",
              label: "lineItems",
            }
          ]
        },
        {
          type: "doc",
          id: "references/js-client/classes/CollectionsResource",
          label: "collections",
        },
        {
          type: "category",
          label: "customers",
          collapsed: true,
          link: {
            type: "doc",
            id: "references/js-client/classes/CustomerResource",
          },
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/AddressesResource",
              label: "addresses"
            },
            {
              type: "doc",
              id: "references/js-client/classes/PaymentMethodsResource",
              label: "paymentMethods"
            }
          ]
        },
        {
          type: "doc",
          id: "references/js-client/classes/GiftCardsResource",
          label: "giftCards",
        },
        {
          type: "doc",
          id: "references/js-client/classes/OrdersResource",
          label: "orders",
        },
        {
          type: "doc",
          id: "references/js-client/classes/OrderEditsResource",
          label: "orderEdits",
        },
        {
          type: "doc",
          id: "references/js-client/classes/PaymentMethodsResource",
          label: "paymentMethods",
        },
        {
          type: "category",
          label: "products",
          link: {
            type: "doc",
            id: "references/js-client/classes/ProductsResource",
          },
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "references/js-client/classes/ProductVariantsResource",
              label: "variants",
            }
          ]
        },
        {
          type: "doc",
          id: "references/js-client/classes/RegionsResource",
          label: "regions",
        },
        {
          type: "doc",
          id: "references/js-client/classes/ReturnReasonsResource",
          label: "returnReasons",
        },
        {
          type: "doc",
          id: "references/js-client/classes/ReturnsResource",
          label: "returns",
        },
        {
          type: "doc",
          id: "references/js-client/classes/ShippingOptionsResource",
          label: "shippingOptions",
        },
        {
          type: "doc",
          id: "references/js-client/classes/SwapsResource",
          label: "swaps",
        },
      ]
    }
  ],
  entitiesSidebar: [
    {
      type: 'ref',
      id: 'core/overview',
      label: 'Back to core concepts',
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: 'back-arrow'
      }
    },
    {
      type: 'html',
      value: 'Entities Reference',
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: 'folder-open'
      }
    },
    {
      type: 'autogenerated',
      dirName: 'references/entities/classes', // generate sidebar from the docs folder (or versioned_docs/<version>)
    },
  ],
}
