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
          id: "introduction"
        },
        {
          type: "doc",
          id: "quickstart/quick-start",
          label: "Quickstart Guide",
        },
        {
          type:"doc",
          id: "quickstart/quick-start-docker",
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
          type: "doc",
          id: "usage/create-medusa-app",
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
                    image: 'https://i.imgur.com/xNvxSkf.png'
                  }
                },
                {
                  type: "doc",
                  id: "deployments/server/deploying-on-digital-ocean",
                  label: "Deploy on DigitalOcean",
                  customProps: {
                    image: 'https://i.imgur.com/aahqJp4.png'
                  }
                },
                {
                  type: "doc",
                  id: "deployments/server/deploying-on-qovery",
                  label: "Deploy on Qovery",
                  customProps: {
                    image: 'https://i.imgur.com/qOvY2dN.png'
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
              id: "advanced/backend/upgrade-guides/1-3-0",
              label: "v1.3.0"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-3-6",
              label: "v1.3.6"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-3-8",
              label: "v1.3.8"
            },
            {
              type: "doc",
              id: "advanced/backend/upgrade-guides/1-6-1",
              label: "v1.6.1"
            },
          ]
        },
        {
          type: "doc",
          id: "usage/local-development",
        },
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
              id: "guides/carts-in-medusa",
              label: "Implement Cart"
            },
            {
              type: "doc",
              id: "advanced/storefront/how-to-implement-checkout-flow",
              label: "Implement Checkout"
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
              id: "advanced/backend/taxes/manual-calculation",
              label: "Calculate Taxes Manually"
            },
            {
              type: "doc",
              id: "advanced/backend/price-lists/use-api",
              label: "Use PriceList APIs"
            },
            {
              type: "doc",
              id: "advanced/backend/sales-channels/manage-admin",
              label: "Use SalesChannel APIs"
            },
            {
              type: "doc",
              id: "advanced/admin/use-customergroups-api",
              label: "Use CustomerGroup APIs"
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
          id: "advanced/backend/cron-jobs/create",
          label: "Create a Cron Job"
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
      ]
    },
    {
      type: "category",
      label: "Conceptual Guides",
      items: [
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
          id: "advanced/backend/customer-groups/index"
        },
        {
          type: "doc",
          id: "advanced/backend/dependency-container/index"
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
