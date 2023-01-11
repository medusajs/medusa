/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      items: [
        {
          type: "doc",
          id: "homepage",
          label: "Overview",
        },
        {
          type: "doc",
          id: "introduction",
          label: "Introduction",
        },
        {
          type: "category",
          label: "Install Medusa Server",
          collapsed: false,
          items: [
            {
              type: "doc",
              id: "quickstart/quick-start",
              label: "Quickstart Guide",
            },
            {
              type: "doc",
              id: "usage/create-medusa-app",
              label: 'Use create-medusa-app'
            },
            {
              type:"doc",
              id: "quickstart/quick-start-docker",
            },
          ]
        },
        {
          type: "doc",
          id: "usage",
        },
      ]
    },
    {
      type: "category",
      label: "Setup & Deployment",
      items: [
        {
          type: "doc",
          id: "tutorial/set-up-your-development-environment",
          label: "Set Up Dev Environment"
        },
        {
          type: "doc",
          id: "usage/configurations",
          label: "Configure Server"
        },
        {
          type: "category",
          label: "Storefronts",
          items: [
            {
              type: "doc",
              id: "starters/gatsby-medusa-starter",
              label: "Gatsby Storefront Quickstart",
            },
            {
              type: "doc",
              id: "starters/nextjs-medusa-starter",
              label: "Next.js Storefront Quickstart",
            },
          ],
        },
        {
          type: "doc",
          id: "admin/quickstart",
        },
        {
          type: "category",
          label: "Deployment",
          items: [
            {
              type: "category",
              label: "Server",
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
        },
        {
          type: "category",
          label: 'Upgrade Guides',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'advanced/backend/upgrade-guides/index'
          },
          items: [
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-7-3",
              label: "v1.7.3"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-7-1",
              label: "v1.7.1"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-7-0",
              label: "v1.7.0"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-6-1",
              label: "v1.6.1"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-3-8",
              label: "v1.3.8"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-3-6",
              label: "v1.3.6"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-3-0",
              label: "v1.3.0"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/admin/admin-vite",
              label: "Medusa Admin: Vite"
            },
          ]
        },
        {
          type: "category",
          label: 'Local Development',
          items: [
            {
              type: "doc",
              id: "usage/local-development",
              label: "Server and Monorepo"
            },
            {
              type: "doc",
              id: "admin/development",
              label: "Medusa Admin"
            }
          ]
        }
      ]
    },
    {
      type: "category",
      label: "How-to Guides",
      items: [
        {
          type: "category",
          label: "Storefront",
          items: [
            {
              type: "doc",
              id: "advanced/storefront/use-regions",
              label: "Use Regions"
            },
            {
              type: "doc",
              id: "advanced/storefront/customer-profiles",
              label: "Add Customer Profiles"
            },
            {
              type: "doc",
              id: "advanced/storefront/use-gift-cards",
              label: "Use Gift Cards"
            },
            {
              type: "doc",
              id: "guides/carts-in-medusa",
              label: "Implement Cart"
            },
            {
              type: "doc",
              id: "advanced/storefront/use-discounts-in-checkout",
              label: "Use Discounts in Checkout"
            },
            {
              type: "doc",
              id: "advanced/backend/taxes/manual-calculation",
              label: "Calculate Taxes Manually"
            },
            {
              type: "doc",
              id: "advanced/storefront/how-to-implement-checkout-flow",
              label: "Implement Checkout"
            },
            {
              type: "doc",
              id: "advanced/storefront/implement-claim-order",
              label: "Implement Claim Order"
            },
            {
              type: "doc",
              id: "advanced/storefront/handle-order-edits",
              label: "Handle Order Edits"
            },
            {
              type: "doc",
              id: "advanced/storefront/use-sales-channels",
              label: "Use SalesChannels APIs"
            },
          ]
        },
        {
          type: "category",
          label: "Admin",
          items: [
            {
              type: "doc",
              id: "advanced/admin/order-edit",
              label: "Edit an Order"
            },
            {
              type: "doc",
              id: "advanced/admin/manage-customers",
              label: "Manage Customers"
            },
            {
              type: "doc",
              id: "advanced/admin/use-customergroups-api",
              label: "Manage Customer Groups"
            },
            {
              type: "doc",
              id: "advanced/admin/import-products",
              label: "Import Products"
            },
            {
              type: "doc",
              id: "advanced/admin/import-prices",
              label: "Import Prices"
            },
            {
              type: "doc",
              id: "advanced/backend/price-lists/use-api",
              label: "Manage PriceLists"
            },
            {
              type: "doc",
              id: "advanced/admin/manage-discounts",
              label: "Manage Discounts"
            },
            {
              type: "doc",
              id: "advanced/admin/manage-gift-cards",
              label: "Manage Gift Cards"
            },
            {
              type: "doc",
              id: "advanced/admin/manage-regions",
              label: "Manage Regions"
            },
            {
              type: "doc",
              id: "advanced/backend/sales-channels/manage-admin",
              label: "Manage Sales Channels"
            },
            {
              type: "doc",
              id: "advanced/admin/manage-publishable-api-keys",
              label: "Manage PublishableApiKeys"
            },
          ]
        },
        {
          type: "doc",
          id: "advanced/backend/endpoints/add",
          label: "Create an Endpoint"
        },
        {
          type: "doc",
          id: "advanced/backend/services/create-service",
          label: "Create a Service"
        },
        {
          type: "doc",
          id: "advanced/backend/subscribers/create-subscriber",
          label: "Create a Subscriber"
        },
        {
          type: "doc",
          id: "advanced/backend/entities/index",
          label: "Create an Entity"
        },
        {
          type: "doc",
          id: "advanced/backend/shipping/add-fulfillment-provider",
          label: "Create a Fulfillment Provider"
        },
        {
          type: "doc",
          id: "advanced/backend/payment/how-to-create-payment-provider",
          label: "Create a Payment Provider"
        },
        {
          type: "doc",
          id: "advanced/backend/notification/how-to-create-notification-provider",
          label: "Create a Notification Provider"
        },
        {
          type: "doc",
          id: "advanced/backend/plugins/create",
          label: "Create a Plugin"
        },
        {
          type: "doc",
          id: "advanced/backend/migrations/index",
          label: "Create a Migration"
        },
        {
          type: "doc",
          id: "advanced/backend/feature-flags/toggle",
          label: "Toggle Feature Flags"
        },
        {
          type: "doc",
          id: "advanced/backend/scheduled-jobs/create",
          label: "Create a Scheduled Job"
        },
        {
          type: "doc",
          id: "advanced/backend/batch-jobs/create",
          label: "Create Batch Job Strategy"
        },
        {
          type: "doc",
          id: "advanced/backend/batch-jobs/customize-import",
        },
        {
          type: "doc",
          id: "advanced/backend/price-selection-strategy/override",
          label: "Override Price Selection"
        },
        {
          type: "doc",
          id: "advanced/ecommerce/handle-order-claim-event",
          label: "Handle Order Claim Event"
        },
        {
          type: "doc",
          id: "advanced/ecommerce/send-gift-card-to-customer",
          label: "Send Gift Card Code"
        },
      ]
    },
    {
      type: "category",
      label: "Conceptual Guides",
      items: [
        {
          type: "doc",
          id: "advanced/backend/dependency-container/index"
        },
        {
          type: "doc",
          id: "advanced/backend/entities/overview",
          label: "Entities"
        },
        {
          type: "doc",
          id: "advanced/backend/services/overview",
          label: "Services"
        },
        {
          type: "doc",
          id: "advanced/backend/subscribers/overview",
          label: "Subscribers"
        },
        {
          type: "doc",
          id: "advanced/backend/shipping/overview",
          label: "Shipping Architecture"
        },
        {
          type: "doc",
          id: "advanced/backend/payment/overview",
          label: "Payment Architecture"
        },
        {
          type: "doc",
          id: "advanced/backend/notification/overview",
          label: "Notification Architecture"
        },
        {
          type: "doc",
          id: "advanced/backend/discounts/index"
        },
        {
          type: "doc",
          id: "advanced/backend/plugins/overview",
          label: "Plugins"
        },
        {
          type: "doc",
          id: "advanced/backend/migrations/overview",
          label: "Migrations"
        },
        {
          type: "doc",
          id: "advanced/backend/batch-jobs/index",
          label: "Batch Jobs"
        },
        {
          type: "doc",
          id: "advanced/backend/regions/overview",
          label: "Regions"
        },
        {
          type: "doc",
          id: "advanced/backend/customers/index"
        },
        {
          type: "doc",
          id: "advanced/backend/customer-groups/index"
        },
        {
          type: "doc",
          id: "advanced/backend/taxes/inclusive-pricing",
          label: "Tax Inclusive Pricing"
        },
        {
          type: "doc",
          id: "advanced/backend/price-lists/index"
        },
        {
          type: "doc",
          id: "advanced/backend/price-selection-strategy/index"
        },
        {
          type: "doc",
          id: "advanced/backend/sales-channels/index"
        },
        {
          type: "doc",
          id: "advanced/backend/gift-cards/index"
        },
        {
          type: "doc",
          id: "advanced/backend/publishable-api-keys/index",
          label: "Publishable API Keys"
        },
      ]
    },
    {
      type: "category",
      label: "Integrations",
      items: [
        {
          type: "category",
          label: "Analytics",
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
          label: "Storage",
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
    },
    {
      type: "category",
      label: "Troubleshooting",
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
    },
    {
      type: "category",
      label: "References",
      items: [
        {
          type: "doc",
          id: "cli/reference",
          label: "CLI Reference",
        },
        {
          type: "ref",
          id: "references/entities/classes/Address",
          label: "Entities Reference",
        },
        {
          type: "doc",
          id: "advanced/backend/subscribers/events-list",
          label: "Events Reference"
        },
        {
          type: "ref",
          id: "js-client/overview",
          label: "JS Client Reference",
        },
        {
          type: "ref",
          id: "references/services/classes/AuthService",
          label: "Services Reference",
        },
      ]
    },
    {
      type: "doc",
      id: "contribution-guidelines",
      label: "Contribution Guidelines",
    },
  ],
  userGuideSidebar: [
    {
      type: 'autogenerated',
      dirName: 'user-guide', // '.' means the current docs folder
    }
  ],
  servicesSidebar: [
    {
      type: 'autogenerated',
      dirName: 'references/services/classes', // generate sidebar from the docs folder (or versioned_docs/<version>)
    },
  ],
  jsClientSidebar: [
    {
      type: "doc",
      id: "js-client/overview",
      label: "Overview",
    },
    {
      type: "category",
      collapsed: false,
      label: "Resources",
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
      type: 'autogenerated',
      dirName: 'references/entities/classes', // generate sidebar from the docs folder (or versioned_docs/<version>)
    },
  ],
}
