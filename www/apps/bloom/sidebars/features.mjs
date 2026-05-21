/** @type {import('types').Sidebar.RawSidebar} */
export const featuresSidebar = [
  {
    sidebar_id: "features",
    title: "Features",
    items: [
      {
        type: "link",
        title: "Commerce Features",
        path: "/features/commerce-features",
      },
      {
        type: "category",
        title: "Agent Features",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "View Switcher",
            path: "/features/view-switcher",
          },
          {
            type: "link",
            title: "Emails",
            path: "/features/emails",
          },
          {
            type: "link",
            title: "Integrations",
            path: "/features/integrations",
            children: [
              {
                type: "link",
                title: "Cookiebot",
                path: "/features/integrations/guides/cookiebot",
              },
              {
                type: "link",
                title: "Klaviyo",
                path: "/features/integrations/guides/klaviyo",
              },
              {
                type: "link",
                title: "Slack",
                path: "/features/integrations/guides/slack",
              },
              {
                type: "link",
                title: "Stripe",
                path: "/features/integrations/guides/stripe",
              },
            ],
          },
          {
            type: "link",
            title: "Selection Mode",
            path: "/features/selection-mode",
          },
          {
            type: "link",
            title: "Design from Media",
            path: "/features/design-from-media",
          },
          {
            type: "link",
            title: "Pull from URLs",
            path: "/features/pull-from-urls",
          },
          {
            type: "link",
            title: "Restore Changes",
            path: "/features/restore-changes",
          },
          {
            type: "link",
            title: "Responsive View",
            path: "/features/responsive-view",
          },
          {
            type: "link",
            title: "Demo Data",
            path: "/features/demo-data",
          },
          {
            type: "link",
            title: "Team Collaboration",
            path: "/features/team-collaboration",
          },
        ],
      },
    ],
  },
]
