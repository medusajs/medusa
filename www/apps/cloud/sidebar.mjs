/** @type {import('types').Sidebar.RawSidebar[]} */
export const sidebar = [
  {
    sidebar_id: "cloud",
    title: "Cloud",
    items: [
      {
        type: "category",
        title: "Getting Started",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "/",
            title: "Introduction",
          },
          {
            type: "link",
            path: "/sign-up",
            title: "Sign Up",
          },
          {
            type: "link",
            path: "/first-project",
            title: "Create First Project",
          },
          {
            type: "link",
            path: "/faq",
            title: "FAQ",
          },
          {
            type: "link",
            path: "/comparison",
            title: "Cloud vs Self Hosting",
          },
          {
            type: "link",
            title: "Command Palette",
            path: "/command-palette",
          },
          {
            type: "link",
            title: "Navigation Styles",
            path: "/navigation",
          }
        ],
      },
      {
        type: "category",
        title: "Basics",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Organizations",
            path: "/organizations",
          },
          {
            type: "link",
            title: "Projects",
            path: "/projects",
            children: [
              {
                type: "link",
                title: "Prerequisites",
                path: "/projects/prerequisites",
              },
              {
                type: "link",
                title: "Rename Repository",
                path: "/projects/rename-repo-branch",
              },
            ],
          },
          {
            type: "link",
            title: "Environments",
            path: "/environments",
            children: [
              {
                type: "link",
                title: "Long-Lived",
                path: "/environments/long-lived",
              },
              {
                type: "link",
                title: "Preview",
                path: "/environments/preview",
              },
              {
                type: "link",
                title: "Environment Variables",
                path: "/environments/environment-variables",
              },
              {
                type: "link",
                title: "Subdomains",
                path: "/environments/subdomains",
              },
              {
                type: "link",
                title: "Custom Domains",
                path: "/environments/custom-domains",
              },
              {
                type: "ref",
                title: "Monitoring",
                path: "/monitoring",
              },
            ],
          },
          {
            type: "link",
            title: "Deployments",
            path: "/deployments",
            children: [
              {
                type: "link",
                title: "Access Deployment",
                path: "/deployments/access",
              },
              {
                type: "link",
                title: "Fix with AI",
                path: "/deployments/fix-with-ai",
              },
              {
                type: "link",
                title: "Troubleshooting",
                path: "/deployments/troubleshooting",
              },
            ],
          },
          {
            type: "link",
            title: "Access Keys",
            path: "/access-keys",
          },
          {
            type: "link",
            title: "Account",
            path: "/user",
          }
        ],
      },
      {
        type: "category",
        title: "CLI",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Installation",
            path: "/cli",
            hideFromChildItems: true,
          },
          {
            type: "link",
            title: "For Agents",
            path: "/cli/agents",
          },
          {
            type: "link",
            title: "login",
            path: "/cli/commands/login",
          },
          {
            type: "link",
            title: "signup",
            path: "/cli/commands/signup",
          },
          {
            type: "link",
            title: "use",
            path: "/cli/commands/use",
          },
          {
            type: "link",
            title: "whoami",
            path: "/cli/commands/whoami",
          },
          {
            type: "link",
            title: "organizations",
            path: "/cli/commands/organizations",
          },
          {
            type: "link",
            title: "projects",
            path: "/cli/commands/projects",
          },
          {
            type: "link",
            title: "environments",
            path: "/cli/commands/environments",
          },
          {
            type: "link",
            title: "deployments",
            path: "/cli/commands/deployments",
          },
          {
            type: "link",
            title: "variables",
            path: "/cli/commands/variables",
          },
          {
            type: "link",
            title: "logs",
            path: "/cli/commands/logs",
          },
          {
            type: "link",
            title: "version",
            path: "/cli/commands/version",
          },
          {
            type: "link",
            title: "logout",
            path: "/cli/commands/logout",
          },
        ],
      },
      {
        type: "category",
        title: "Resources",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Storefront",
            path: "/storefront",
          },
          {
            type: "link",
            title: "Database",
            path: "/database",
          },
          {
            type: "link",
            title: "Redis",
            path: "/redis",
          },
          {
            type: "link",
            title: "S3",
            path: "/s3",
          },
          {
            type: "link",
            title: "Cache",
            path: "/cache",
          },
          {
            type: "link",
            title: "Emails",
            path: "/emails",
            children: [
              {
                type: "link",
                title: "React Email Templates",
                path: "/emails/react-email",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Plugins",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Loyalty",
            path: "https://docs.medusajs.com/resources/commerce-modules/loyalty",
            badge: {
              text: "Published",
              variant: "blue",
            },
          },
          {
            type: "link",
            title: "Draft Orders",
            path: "https://docs.medusajs.com/resources/commerce-modules/order/draft-orders",
            badge: {
              text: "Published",
              variant: "blue",
            },
          },
        ],
      },
      {
        type: "category",
        title: "Billing",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Overview",
            path: "/billing",
          },
          {
            type: "link",
            title: "Plans & Pricing",
            path: "/pricing",
          },
          {
            type: "link",
            title: "Manage Plans",
            path: "/billing/plans",
          },
          {
            type: "link",
            title: "Manage Billing Details",
            path: "/billing/manage",
          },
        ],
      },
      {
        type: "category",
        title: "Monitoring",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Logs",
            path: "/logs",
          },
          {
            type: "link",
            title: "Notifications",
            path: "/notifications",
          },
          {
            type: "link",
            title: "Usage",
            path: "/usage",
          },
          {
            type: "link",
            title: "Performance",
            path: "/monitoring",
            children: [
              {
                type: "link",
                title: "Servers",
                path: "/monitoring/servers",
              },
              {
                type: "link",
                title: "Workers",
                path: "/monitoring/workers",
              },
              {
                type: "link",
                title: "HTTP",
                path: "/monitoring/http",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Networking",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "IP Addresses",
            path: "/ip-addresses",
          },
        ],
      },
      {
        type: "category",
        title: "Best Practices",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Update Medusa",
            path: "/update-medusa",
          },
          {
            type: "link",
            title: "Connect Storefront",
            path: "/connect-storefront",
          },
        ],
      },
    ],
  },
]
