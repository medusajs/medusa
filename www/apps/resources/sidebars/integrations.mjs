/** @type {import('types').Sidebar.SidebarItem[]} */
export const integrationsSidebar = [
  {
    type: "link",
    path: "/integrations",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "Analytics",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/infrastructure-modules/analytics/posthog",
        title: "PostHog",
      },
      {
        type: "link",
        path: "/integrations/guides/segment",
        title: "Segment",
      },
    ],
  },
  {
    type: "category",
    title: "Auth",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/commerce-modules/auth/auth-providers/google",
        title: "Google",
      },
      {
        type: "ref",
        path: "/commerce-modules/auth/auth-providers/github",
        title: "GitHub",
      },
      {
        type: "link",
        path: "/integrations/guides/okta",
        title: "Okta",
      },
    ],
  },
  {
    type: "category",
    title: "CMS",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/contentful",
        title: "Contentful",
      },
      {
        type: "link",
        path: "/integrations/guides/payload",
        title: "Payload CMS",
      },
      {
        type: "link",
        path: "/integrations/guides/sanity",
        title: "Sanity",
      },
      {
        type: "link",
        path: "/integrations/guides/strapi",
        title: "Strapi",
      },
    ],
  },
  {
    type: "category",
    title: "ERP",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/recipes/erp/odoo",
        title: "Odoo",
      },
    ],
  },
  {
    type: "category",
    title: "File",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/infrastructure-modules/file/s3",
        title: "S3 (and Compatible APIs)",
      },
    ],
  },
  {
    type: "category",
    title: "Fulfillment",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/shipstation",
        title: "ShipStation",
      },
    ],
  },
  {
    type: "category",
    title: "Instrumentation",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/sentry",
        title: "Sentry",
      },
    ],
  },
  {
    type: "category",
    title: "Migration",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/magento",
        title: "Magento",
      },
    ],
  },
  {
    type: "category",
    title: "Notification",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/mailchimp",
        title: "Mailchimp",
      },
      {
        type: "link",
        path: "/integrations/guides/resend",
        title: "Resend",
      },
      {
        type: "ref",
        path: "/infrastructure-modules/notification/sendgrid",
        title: "SendGrid",
      },
      {
        type: "link",
        path: "/integrations/guides/slack",
        title: "Slack",
      },
      {
        type: "ref",
        path: "/how-to-tutorials/tutorials/phone-auth#step-3-integrate-twilio-sms",
        title: "Twilio SMS",
      },
    ],
  },
  {
    type: "category",
    title: "Payment",
    initialOpen: true,
    children: [
      {
        type: "ref",
        path: "/commerce-modules/payment/payment-provider/stripe",
        title: "Stripe",
      },
      {
        type: "link",
        path: "/integrations/guides/paypal",
        title: "PayPal",
      },
    ],
  },
  {
    type: "category",
    title: "Search",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/algolia",
        title: "Algolia",
      },
      {
        type: "link",
        path: "/integrations/guides/meilisearch",
        title: "Meilisearch",
      },
    ],
  },
  {
    type: "category",
    title: "Tax",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/integrations/guides/avalara",
        title: "Avalara",
      },
    ],
  },
]
