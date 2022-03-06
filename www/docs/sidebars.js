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
              type: "doc",
              id: "tutorial/adding-custom-functionality",
              label: "Add Custom Functionality"
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
        {
          type: "doc",
          id: "add-plugins/contentful",
          label: "CMS: Contentful",
        },
        {
          type: "doc",
          id: "add-plugins/strapi",
          label: "CMS: Strapi",
        },
        {
          type: "doc",
          id: "add-plugins/segment",
          label: "Analytics: Segment",
        },
        {
          type: "doc",
          id: "add-plugins/meilisearch",
          label: "Search: MeiliSearch",
        },
        {
          type: "doc",
          id: "add-plugins/algolia",
          label: "Search: Algolia",
        },
        {
          type: "doc",
          id: "add-plugins/spaces",
          label: "File: Spaces",
        },
        {
          type: "doc",
          id: "add-plugins/s3",
          label: "File: S3",
        },
        {
          type: "doc",
          id: "add-plugins/minio",
          label: "File: MinIO",
        },
        {
          type: "doc",
          id: "add-plugins/stripe",
          label: "Payment: Stripe",
        },
        {
          type: "doc",
          id: "add-plugins/klarna",
          label: "Payment: Klarna",
        },
        {
          type: "doc",
          id: "add-plugins/paypal",
          label: "Payment: PayPal",
        },
        {
          type: "doc",
          id: "add-plugins/sendgrid",
          label: "Notification: SendGrid",
        },
        {
          type: "doc",
          id: "add-plugins/slack",
          label: "Bot: Slack",
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
      ],
    },
  ],
}
