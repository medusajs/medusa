import numberSidebarItems from "./utils/number-sidebar-items.mjs"
import { sidebarAttachHrefCommonOptions } from "./utils/sidebar-attach-common-options.mjs"

/** @type {import('@/types').SidebarItem[]} */
export const sidebar = numberSidebarItems(
  sidebarAttachHrefCommonOptions([
    {
      type: "link",
      path: "/",
      title: "Introduction",
    },
    {
      type: "link",
      path: "/first-customizations",
      title: "Your First Customizations",
    },
    {
      type: "link",
      path: "/basics",
      title: "The Basics",
      children: [
        {
          type: "link",
          path: "/basics/project-directories-files",
          title: "Project Directories and Files",
        },
        {
          type: "link",
          path: "/basics/medusa-container",
          title: "Medusa Container",
        },
        {
          type: "link",
          path: "/basics/api-routes",
          title: "API Routes",
        },
        {
          type: "link",
          path: "/basics/modules-and-services",
          title: "Modules and Services",
        },
        {
          type: "link",
          path: "/basics/commerce-modules",
          title: "Commerce Modules",
        },
        {
          type: "link",
          path: "/basics/modules-directory-structure",
          title: "Modules Directory Structure",
        },
        {
          type: "link",
          path: "/basics/data-models",
          title: "Data Models",
        },
        {
          type: "link",
          path: "/basics/loaders",
          title: "Loaders",
        },
        {
          type: "link",
          path: "/basics/events-and-subscribers",
          title: "Events and Subscribers",
        },
        {
          type: "link",
          path: "/basics/scheduled-jobs",
          title: "Scheduled Jobs",
        },
        {
          type: "link",
          path: "/basics/workflows",
          title: "Workflows",
        },
        {
          type: "link",
          path: "/basics/admin-customizations",
          title: "Admin Customizations",
        },
      ],
    },
    {
      type: "link",
      path: "/advanced-development",
      title: "Advanced Development",
      children: [
        {
          type: "sub-category",
          title: "API Routes",
          children: [
            {
              type: "link",
              path: "/advanced-development/api-routes/http-methods",
              title: "HTTP Methods",
            },
            {
              type: "link",
              path: "/advanced-development/api-routes/parameters",
              title: "Parameters",
            },
            {
              type: "link",
              path: "/advanced-development/api-routes/middlewares",
              title: "Middlewares",
            },
            {
              type: "link",
              path: "/advanced-development/api-routes/protected-routes",
              title: "Protected Routes",
            },
            {
              type: "link",
              path: "/advanced-development/api-routes/cors",
              title: "Handling CORS",
            },
          ],
        },
        {
          type: "sub-category",
          title: "Modules",
          children: [
            {
              type: "link",
              path: "/advanced-development/modules/container",
              title: "Module's Container",
            },
            {
              type: "link",
              path: "/advanced-development/modules/service-factory",
              title: "Service Factory",
            },
            {
              type: "link",
              path: "/advanced-development/modules/isolation",
              title: "Module Isolation",
            },
            {
              type: "link",
              path: "/advanced-development/modules/module-links",
              title: "Module Links",
            },
            {
              type: "link",
              path: "/advanced-development/modules/module-link-directions",
              title: "Module Link Direction",
            },
            {
              type: "link",
              path: "/advanced-development/modules/remote-link",
              title: "Remote Link",
            },
            {
              type: "link",
              path: "/advanced-development/modules/remote-query",
              title: "Remote Query",
            },
            {
              type: "link",
              path: "/advanced-development/modules/options",
              title: "Module Options",
            },
          ],
        },
        {
          type: "link",
          path: "/advanced-development/data-models",
          title: "Data Models",
          children: [
            {
              type: "link",
              path: "/advanced-development/data-models/property-types",
              title: "Property Types",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/primary-key",
              title: "Primary Key",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/default-properties",
              title: "Default Properties",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/configure-properties",
              title: "Configure Properties",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/relationships",
              title: "Relationships",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/manage-relationships",
              title: "Manage Relationships",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/index",
              title: "Index",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/searchable-property",
              title: "Searchable Property",
            },
            {
              type: "link",
              path: "/advanced-development/data-models/write-migration",
              title: "Write Migration",
            },
          ],
        },
        {
          type: "sub-category",
          title: "Events and Subscribers",
          children: [
            {
              type: "link",
              path: "/advanced-development/events-and-subscribers/data-payload",
              title: "Events Data Payload",
            },
          ],
        },
        {
          type: "sub-category",
          title: "Scheduled Jobs",
          children: [
            {
              type: "link",
              path: "/advanced-development/scheduled-jobs/execution-number",
              title: "Execution Number",
            },
          ],
        },
        {
          type: "sub-category",
          title: "Workflows",
          children: [
            {
              type: "link",
              path: "/advanced-development/workflows/constructor-constraints",
              title: "Workflow Constraints",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/conditions",
              title: "Conditions in Workflows",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/compensation-function",
              title: "Compensation Function",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/add-workflow-hook",
              title: "Workflow Hooks",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/access-workflow-errors",
              title: "Access Workflow Errors",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/retry-failed-steps",
              title: "Retry Failed Steps",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/parallel-steps",
              title: "Run Steps in Parallel",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/workflow-timeout",
              title: "Workflow Timeout",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/long-running-workflow",
              title: "Long-Running Workflow",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/execute-another-workflow",
              title: "Execute Another Workflow",
            },
            {
              type: "link",
              path: "/advanced-development/workflows/advanced-example",
              title: "Example: Advanced Workflow",
            },
          ],
        },
        {
          type: "link",
          path: "/advanced-development/custom-cli-scripts",
          title: "Custom CLI Scripts",
        },
        {
          type: "link",
          path: "/advanced-development/admin",
          title: "Admin Development",
          children: [
            {
              type: "link",
              path: "/advanced-development/admin/widgets",
              title: "Admin Widgets",
            },
            {
              type: "link",
              path: "/advanced-development/admin/ui-routes",
              title: "Admin UI Routes",
            },
            {
              type: "link",
              path: "/advanced-development/admin/tips",
              title: "Tips",
            },
          ],
        },
      ],
    },
    {
      type: "link",
      path: "/storefront-development",
      title: "Storefront Development",
      children: [
        {
          type: "link",
          path: "/storefront-development/nextjs-starter",
          title: "Next.js Starter",
        },
      ],
    },
    {
      type: "link",
      path: "/architectural-modules",
      title: "Architectural Modules",
    },
    {
      type: "link",
      path: "/debugging-and-testing",
      title: "Debugging and Testing",
      children: [
        {
          type: "link",
          path: "/debugging-and-testing/logging",
          title: "Logging",
        },
        {
          type: "link",
          path: "/debugging-and-testing/tools",
          title: "Tools",
        },
      ],
    },
    {
      type: "link",
      path: "/deployment",
      title: "Deployment",
    },
    {
      type: "link",
      path: "/more-resources",
      title: "More Resources",
    },
    {
      type: "link",
      path: "/cheatsheet",
      title: "Cheat Sheet",
    },
  ])
)
