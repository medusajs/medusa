/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  tutorialSidebar: [
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
      type: "doc",
      id: "quickstart/quick-start",
      label: "Quickstart Guide",
    },
    {
      type: "category",
      collapsed: false,
      label: "Usage Guides",
      items: [
        {
          type: "doc",
          id: "tutorial/set-up-your-development-environment",
          label: "Set Up your Development Environment"
        },
        {
          type: "doc",
          id: "tutorial/creating-your-medusa-server",
          label: "Create your Medusa Server"
        },
        {
          type: "category",
          collapsed: true,
          label: "Storefront Quickstart",
          items: [
            {
              type: "doc",
              id: "starters/gatsby-medusa-starter",
              label: "Quickstart: Gatsby",
            },
            {
              type: "doc",
              id: "starters/nextjs-medusa-starter",
              label: "Quickstart: Next.js",
            },
            {
              type: "doc",
              id: "how-to/setting-up-a-nextjs-storefront-for-your-medusa-project",
              label: "Set Up a Next.js Storefront for your Medusa Project"
            },
          ],
        },
        {
          type: "doc",
          id: "admin/quickstart",
        },
        {
          type: "doc",
          id: "how-to/create-medusa-app",
        },
        {
          type: "category",
          label: "Deployment",
          items: [
            {
              type: "doc",
              id: "how-to/deploying-on-heroku",
              label: "Deploy: Heroku",
            },
            {
              type: "doc",
              id: "how-to/deploying-on-qovery",
              label: "Deploy: Qovery",
            },
            {
              type: "doc",
              id: "how-to/deploying-on-digital-ocean",
              label: "Deploy: DigitalOcean",
            },
            {
              type: "doc",
              id: "how-to/deploying-admin-on-netlify",
              label: "Deploy: Admin on Netlify",
            },
            {
              type: "doc",
              id: "how-to/deploying-gatsby-on-netlify",
              label: "Deploy: Gatsby on Netlify",
            },
          ],
        },
      ]
    },
    {
      type: "category",
      label: "Advanced Guide",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Medusa Server",
          collapsed: true,
          items: [
            {
              type: "category",
              label: 'Endpoints',
              collapsed: true,
              items: [
                {
                  type: "doc",
                  id: "advanced/backend/endpoints/add-storefront",
                  label: "Add Endpoint for Storefront"
                },
                {
                  type: "doc",
                  id: "advanced/backend/endpoints/add-admin",
                  label: "Add Endpoint for Admin"
                },
              ]
            },
            {
              type: "category",
              label: 'Services',
              collapsed: true,
              items: [
                {
                  type: "doc",
                  id: "advanced/backend/services/create-service",
                  label: "Create a Service"
                },
              ]
            },
            {
              type: "category",
              label: 'Subscribers',
              collapsed: true,
              items: [
                {
                  type: "doc",
                  id: "advanced/backend/subscribers/create-subscriber",
                  label: "Create a Subscriber"
                },
              ]
            },
            {
              type: "doc",
              id: "how-to/notification-api",
            },
            {
              type: "doc",
              id: "guides/fulfillment-api",
            },
            {
              type: "doc",
              id: "guides/plugins",
            },
            {
              type: "doc",
              id: "guides/checkouts",
            },
            {
              type: "doc",
              id: "guides/carts-in-medusa",
            },
          ]
        }
      ]
    },
    {
      type: "category",
      label: "Integrations",
      collapsed: false,
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
          label: "Bot",
          items: [
            {
              type: "doc",
              id: "add-plugins/slack",
              label: "Slack",
            },
          ],
        },
        {
          type: "category",
          label: "CMS",
          items: [
            {
              type: "doc",
              id: "add-plugins/contentful",
              label: "Contentful",
            },
            {
              type: "doc",
              id: "add-plugins/strapi",
              label: "Strapi",
            },
            {
              type: "category",
              label: "Gatsby + Contentful + Medusa",
              items: [
                {
                  type: "doc",
                  id: "how-to/headless-ecommerce-store-with-gatsby-contentful-medusa",
                },
                {
                  type: "doc",
                  id: "how-to/making-your-store-more-powerful-with-contentful",
                },
              ],
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
          label: "Payment provider (Stripe) not showing in checkout",
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
          id: "troubleshooting/documentation-error",
          label: "Documentation Error",
        },
      ],
    },
  ],
}
