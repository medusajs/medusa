/** @type {import('types').Sidebar.RawSidebar} */
export const gettingStartedSidebar = [
  {
    sidebar_id: "getting-started",
    title: "Getting Started",
    items: [
      {
        type: "category",
        title: "Get Started",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Introduction",
            path: "/",
          },
          {
            type: "link",
            title: "Create your first Bloom",
            path: "/first-store",
          },
          {
            type: "link",
            title: "Going Live",
            path: "/going-live",
          },
          {
            type: "link",
            title: "Credits and Plans",
            path: "/credits-and-plans",
          },
          {
            type: "link",
            title: "Starters",
            path: "/starters",
          },
          {
            type: "link",
            title: "FAQ",
            path: "/faq",
          },
          {
            type: "link",
            title: "Preview Tabs",
            path: "/preview-tabs",
          },
        ],
      },
      {
        type: "category",
        title: "Project Management",
        children: [
          {
            type: "link",
            title: "Manage Projects",
            path: "/manage-projects",
          },
          {
            type: "link",
            title: "Custom Domains",
            path: "/custom-domains",
          },
        ],
      },
      {
        type: "category",
        title: "Account & Organization",
        children: [
          {
            type: "link",
            title: "Organization",
            path: "/organization-management",
            children: [
              {
                type: "link",
                title: "Team",
                path: "/organization-management/team",
              },
              {
                type: "link",
                title: "Manage Billing",
                path: "/manage-billing",
              },
            ],
          },
          {
            type: "link",
            title: "Profile",
            path: "/profile-management",
          },
        ],
      },
      {
        type: "link",
        title: "Help and Feedback",
        path: "/help-and-feedback",
      },
    ],
  },
]
