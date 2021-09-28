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
      id: "quickstart/quick-start",
      label: "Quickstart",
    },
    // {
    //   type: 'category',
    //   label: 'Quickstart',
    //   items: [
    //     {
    //       type: 'doc',
    //       id: 'quickstart/quick-start-docker',
    //       label: 'Quickstart w. Docker (Coming soon!)',
    //     },
    //   ],
    // },
    {
      type: "category",
      label: "Tutorials",
      items: [
        {
          type: "doc",
          id: "tutorial/set-up-your-development-environment",
        },
        {
          type: "doc",
          id: "tutorial/creating-your-medusa-server",
        },
        {
          type: "doc",
          id: "tutorial/adding-custom-functionality",
        },
        // {
        //   type: "doc",
        //   id: "tutorial/linking-your-local-project-with-medusa-cloud",
        // },
      ],
    },
    {
      type: "category",
      label: "How to",
      items: [
        {
          type: "doc",
          id: "how-to/plugins",
        },
        {
          type: "doc",
          id: "how-to/notification-api",
        },
        {
          type: "category",
          label: "Gatsby + Contentful + Medusa",
          items: [
            {
              type: "doc",
              id: "how-to/headless-ecommerce-store-with-gatsby-contentful-medusa",
            },
          ],
        },
        {
          type: "doc",
          id: "how-to/setting-up-a-nextjs-storefront-for-your-medusa-project",
        },
        {
          type: "doc",
          id: "how-to/create-medusa-app",
        },
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        {
          type: "doc",
          id: "guides/fulfillment-api",
        },
        {
          type: "doc",
          id: "guides/checkouts",
        },
        {
          type: "doc",
          id: "guides/carts-in-medusa",
        },
      ],
    },
   {
      type: "category",
      label: "Deploy",
      items: [
        {
          type: "doc",
          id: "how-to/deploying-on-heroku",
        },
      ],
    },
  ],
}
