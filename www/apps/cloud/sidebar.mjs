const soonBadge = {
  variant: "blue",
  text: "Soon",
}

/** @type {import('types').Sidebar.RawSidebar[]} */
export const sidebar = [
  {
    sidebar_id: "get-started",
    title: "Get Started",
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
            path: "/going-live",
            title: "Going Live Checklist",
          },
          {
            type: "link",
            path: "/faq",
            title: "FAQ",
          },
          {
            type: "link",
            path: "/comparison",
            title: "Cloud vs Self-Hosted",
          },
          {
            type: "link",
            path: "/features",
            title: "Features",
          },
        ],
      },
      {
        type: "category",
        title: "AI Toolkit",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "/ai-toolkit",
            title: "Overview",
          },
          {
            type: "link",
            title: "Medusa MCP",
            path: "/ai-toolkit/medusa-mcp",
            children: [
              {
                type: "link",
                title: "Claude Connector",
                path: "/ai-toolkit/medusa-mcp/claude",
              },
              {
                type: "link",
                title: "ChatGPT App",
                path: "/ai-toolkit/medusa-mcp/chatgpt",
              },
              {
                type: "link",
                title: "n8n",
                path: "/ai-toolkit/medusa-mcp/n8n",
              },
              {
                type: "link",
                title: "Custom Agents",
                path: "/ai-toolkit/medusa-mcp/custom-agents",
              },
              {
                type: "link",
                title: "Retrieve Custom Data",
                path: "/ai-toolkit/medusa-mcp/custom-data",
              },
            ],
          },
          {
            type: "link",
            path: "/ai-toolkit/docs-mcp",
            title: "Docs MCP",
            children: [
              {
                type: "link",
                title: "Ask Medusa Questions",
                path: "/ai-toolkit/docs-mcp/ask-medusa-question",
                description:
                  "Answer Medusa questions from the official documentation.",
              },
              {
                type: "link",
                title: "Migrate from Shopify",
                path: "/ai-toolkit/docs-mcp/migrate-from-shopify",
                description:
                  "Migrate your store's data from Shopify to Medusa.",
              },
              {
                type: "link",
                title: "Migrate from WooCommerce",
                path: "/ai-toolkit/docs-mcp/migrate-from-woocommerce",
                description:
                  "Migrate your store's data from WooCommerce to Medusa.",
              },
              {
                type: "link",
                title: "Migrate from Magento",
                path: "/ai-toolkit/docs-mcp/migrate-from-magento",
                description:
                  "Migrate your store's data from Magento to Medusa.",
              },
              {
                type: "link",
                title: "Integrate Providers",
                path: "/ai-toolkit/docs-mcp/integrate-providers",
                description:
                  "Build payment and fulfillment module providers for third-party services.",
              },
              {
                type: "link",
                title: "Extend Products",
                path: "/ai-toolkit/docs-mcp/extend-products",
                description:
                  "Attach custom data and features to products, variants, and options.",
              },
              {
                type: "link",
                title: "Upgrade Medusa",
                path: "/ai-toolkit/docs-mcp/upgrade-instructions",
                description:
                  "Upgrade a Medusa project to a newer version, breaking changes included.",
              },
              {
                type: "link",
                title: "Submit Feedback",
                path: "/ai-toolkit/docs-mcp/submit-feedback",
                description:
                  "Send documentation, bug, and feedback to the Medusa team.",
              },
            ],
          },
          {
            type: "link",
            title: "Cloud Assistant",
            path: "/ai-toolkit/assistant",
          },
          {
            type: "link",
            path: "/ai-toolkit/agent-skills",
            title: "Skills",
          },
          {
            type: "ref",
            title: "Cloud CLI",
            path: "/cli",
          },
          {
            type: "link",
            path: "/ai-toolkit/ai-friendly-docs",
            title: "AI-Friendly Docs",
          },
        ],
      },
      {
        type: "category",
        title: "Building Features",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "#",
            title: "Setup Locally",
            badge: soonBadge,
            children: [
              {
                type: "link",
                path: "#",
                title: "Setup with Docker",
                badge: soonBadge,
              },
            ],
          },
          {
            type: "link",
            path: "#",
            title: "Development Resources",
            badge: soonBadge,
          },
          {
            type: "link",
            path: "#",
            title: "Integrations",
            badge: soonBadge,
          },
        ],
      },
      {
        type: "category",
        title: "Management",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Organizations",
            path: "/organizations",
            children: [
              {
                type: "link",
                title: "Connections",
                path: "/organizations/connections",
              },
            ],
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
                title: "Clone Project Locally",
                path: "/projects/clone-locally",
              },
              {
                type: "link",
                title: "Rename Repository",
                path: "/projects/rename-repo-branch",
              },
              {
                type: "link",
                title: "Log Drains",
                path: "/projects/log-drains",
              },
              {
                type: "link",
                title: "Troubleshooting",
                path: "/projects/troubleshooting",
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
            path: "#",
            title: "Admin",
            badge: soonBadge,
          },
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
        ],
      },
      {
        type: "category",
        title: "Emails",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Overview",
            path: "/emails",
          },
          {
            type: "link",
            title: "React Email Templates",
            path: "/emails/react-email",
          },
        ],
      },
      {
        type: "category",
        title: "Search",
        children: [
          {
            type: "link",
            title: "Overview",
            path: "/search",
          },
          {
            type: "link",
            title: "Analytics",
            path: "/search/analytics",
          },
          {
            type: "sub-category",
            title: "API",
            children: [
              {
                type: "link",
                title: "Index Settings",
                path: "/search/settings",
              },
              {
                type: "link",
                title: "Semantic Search",
                path: "/search/semantic-search",
              },
            ],
          },
          {
            type: "link",
            title: "Comparison",
            path: "/search/comparison",
            children: [
              {
                type: "link",
                title: "Compare to Algolia",
                path: "/search/algolia",
              },
              {
                type: "link",
                title: "Compare to Meilisearch",
                path: "/search/meilisearch",
              },
              {
                type: "link",
                title: "Compare to PostgreSQL",
                path: "/search/postgres",
              },
            ],
          },
          {
            type: "sub-category",
            title: "Migration",
            children: [
              {
                type: "link",
                title: "Migrate from Algolia",
                path: "/search/migrate-from-algolia",
              },
              {
                type: "link",
                title: "Migrate from Meilisearch",
                path: "/search/migrate-from-meilisearch",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Enterprise",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "#",
            title: "RBAC",
            badge: soonBadge,
          },
          {
            type: "link",
            path: "#",
            title: "SSO",
            badge: soonBadge,
          },
        ],
      },
      {
        type: "category",
        title: "Webhooks",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Manage Endpoints",
            path: "/webhooks/endpoints",
          },
          {
            type: "link",
            title: "Manage Events",
            path: "/webhooks/events",
          },
          {
            type: "link",
            title: "Reference",
            path: "/webhooks/reference",
          },
          {
            type: "link",
            title: "Changelog",
            path: "/webhooks/changelog",
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
            title: "Status Page",
            path: "/status",
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
            children: [
              {
                type: "link",
                title: "Compute Hours",
                path: "/usage/compute",
              },
            ],
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
          {
            type: "link",
            title: "Medusa Security",
            path: "/security",
            children: [
              {
                type: "link",
                title: "Security Analytics",
                path: "/security/analytics",
              },
              {
                type: "link",
                title: "Data Protection",
                path: "/security/data-protection",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    sidebar_id: "cloud-cli",
    title: "Cloud CLI",
    items: [
      {
        type: "link",
        title: "Installation",
        path: "/cli",
      },
      {
        type: "link",
        title: "For Agents",
        path: "/cli/agents",
      },
      {
        type: "link",
        title: "Changelog",
        path: "/cli/changelog",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Commands",
        initialOpen: true,
        children: [
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
            title: "local",
            path: "/cli/commands/local",
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
    ],
  },
]
