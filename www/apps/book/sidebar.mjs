import numberSidebarItems from "./utils/number-sidebar-items.mjs"
import { sidebarAttachHrefCommonOptions } from "./utils/sidebar-attach-common-options.mjs"

/** @type {import('@/types').SidebarItem[]} */
export const sidebar = numberSidebarItems(
  sidebarAttachHrefCommonOptions([
    {
      type: "link",
      path: "/learn",
      title: "Introduction",
    },
    {
      type: "link",
      path: "/learn/first-customizations",
      title: "Your First Customizations",
      chapterTitle: "First Customization",
    },
    {
      type: "link",
      path: "/learn/basics",
      title: "The Basics",
      chapterTitle: "Basics",
      children: [
        {
          type: "link",
          path: "/learn/basics/project-directories-files",
          title: "Project Conventions",
        },
        {
          type: "link",
          path: "/learn/basics/medusa-container",
          title: "Medusa Container",
        },
        {
          type: "link",
          path: "/learn/basics/modules",
          title: "Modules",
        },
        {
          type: "link",
          path: "/learn/basics/api-routes",
          title: "API Routes",
        },
        {
          type: "link",
          path: "/learn/basics/commerce-modules",
          title: "Commerce Modules",
        },
        {
          type: "link",
          path: "/learn/basics/modules-directory-structure",
          title: "Modules Directory Structure",
        },
        {
          type: "link",
          path: "/learn/basics/loaders",
          title: "Loaders",
        },
        {
          type: "link",
          path: "/learn/basics/events-and-subscribers",
          title: "Events and Subscribers",
        },
        {
          type: "link",
          path: "/learn/basics/scheduled-jobs",
          title: "Scheduled Jobs",
        },
        {
          type: "link",
          path: "/learn/basics/workflows",
          title: "Workflows",
        },
        {
          type: "link",
          path: "/learn/basics/admin-customizations",
          title: "Admin Customizations",
        },
      ],
    },
    {
      type: "link",
      path: "/learn/customization",
      title: "Custom Development",
      chapterTitle: "Customization",
      children: [
        {
          type: "link",
          title: "Build Custom Features",
          path: "/learn/customization/custom-features",
          children: [
            {
              type: "link",
              title: "Brand Module",
              path: "/learn/customization/custom-features/module",
            },
            {
              type: "link",
              title: "Create Brand Workflow",
              path: "/learn/customization/custom-features/workflow",
            },
            {
              type: "link",
              title: "Create Brand API Route",
              path: "/learn/customization/custom-features/api-route",
            },
          ],
        },
        {
          type: "link",
          title: "Extend Models",
          path: "/learn/customization/extend-models",
          children: [
            {
              type: "link",
              title: "Define Link",
              path: "/learn/customization/extend-models/define-link",
            },
            {
              type: "link",
              title: "Create Links Between Records",
              path: "/learn/customization/extend-models/create-links",
            },
            {
              type: "link",
              title: "Extend Route",
              path: "/learn/customization/extend-models/extend-create-product",
            },
            {
              type: "link",
              title: "Query Linked Records",
              path: "/learn/customization/extend-models/query-linked-records",
            },
          ],
        },
        {
          type: "link",
          title: "Customize Admin",
          path: "/learn/customization/customize-admin",
          children: [
            {
              type: "link",
              title: "Add Widgets",
              path: "/learn/customization/customize-admin/widget",
            },
            {
              type: "link",
              title: "Add UI Route",
              path: "/learn/customization/customize-admin/route",
            },
          ],
        },
        {
          type: "link",
          title: "Integrate Systems",
          path: "/learn/customization/integrate-systems",
          children: [
            {
              type: "link",
              title: "Integrate with Service",
              path: "/learn/customization/integrate-systems/service",
            },
            {
              type: "link",
              title: "Handle Event",
              path: "/learn/customization/integrate-systems/handle-event",
            },
            {
              type: "link",
              title: "Schedule Task",
              path: "/learn/customization/integrate-systems/schedule-task",
            },
          ],
        },
        {
          type: "link",
          title: "Next Steps",
          path: "/learn/customization/next-steps",
        },
      ],
    },
    {
      type: "link",
      path: "/learn/advanced-development",
      title: "Advanced Development",
      chapterTitle: "Advanced",
      children: [
        {
          type: "link",
          title: "Architecture",
          path: "/learn/advanced-development/architecture/overview",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/architecture/architectural-modules",
              title: "Architectural Modules",
            },
          ],
        },
        {
          type: "link",
          title: "API Routes",
          path: "/learn/advanced-development/api-routes",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/http-methods",
              title: "HTTP Methods",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/parameters",
              title: "Parameters",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/responses",
              title: "Response",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/middlewares",
              title: "Middlewares",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/validation",
              title: "Validation",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/protected-routes",
              title: "Protected Routes",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/errors",
              title: "Errors",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/cors",
              title: "Handling CORS",
            },
            {
              type: "link",
              path: "/learn/advanced-development/api-routes/additional-data",
              title: "Additional Data",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/advanced-development/modules",
          title: "Modules",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/modules/isolation",
              title: "Module Isolation",
            },
            {
              type: "link",
              path: "/learn/advanced-development/modules/container",
              title: "Module's Container",
            },
            {
              type: "link",
              path: "/learn/advanced-development/modules/options",
              title: "Module Options",
            },
            {
              type: "link",
              path: "/learn/advanced-development/modules/service-factory",
              title: "Service Factory",
            },
            {
              type: "link",
              path: "/learn/advanced-development/modules/service-constraints",
              title: "Service Constraints",
            },
            {
              type: "link",
              path: "/learn/advanced-development/modules/db-operations",
              title: "Database Operations",
            },
            {
              type: "link",
              path: "/learn/advanced-development/modules/multiple-services",
              title: "Multiple Services",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/advanced-development/module-links",
          title: "Module Links",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/module-links/directions",
              title: "Module Link Direction",
            },
            {
              type: "link",
              path: "/learn/advanced-development/module-links/remote-link",
              title: "Remote Link",
            },
            {
              type: "link",
              path: "/learn/advanced-development/module-links/query",
              title: "Query",
            },
            {
              type: "link",
              path: "/learn/advanced-development/module-links/custom-columns",
              title: "Custom Columns",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/advanced-development/data-models",
          title: "Data Models",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/data-models/infer-type",
              title: "Infer Type",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/property-types",
              title: "Property Types",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/primary-key",
              title: "Primary Key",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/default-properties",
              title: "Default Properties",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/configure-properties",
              title: "Configure Properties",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/relationships",
              title: "Relationships",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/manage-relationships",
              title: "Manage Relationships",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/index",
              title: "Define Index",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/searchable-property",
              title: "Searchable Property",
            },
            {
              type: "link",
              path: "/learn/advanced-development/data-models/write-migration",
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
              path: "/learn/advanced-development/events-and-subscribers/data-payload",
              title: "Events Data Payload",
            },
            {
              path: "/learn/advanced-development/events-and-subscribers/emit-event",
              title: "Emit an Event",
            },
          ],
        },
        {
          type: "sub-category",
          title: "Scheduled Jobs",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/scheduled-jobs/execution-number",
              title: "Execution Number",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/advanced-development/workflows",
          title: "Workflows",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/workflows/variable-manipulation",
              title: "Variable Manipulation",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/conditions",
              title: "Using Conditions",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/constructor-constraints",
              title: "Constructor Constraints",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/compensation-function",
              title: "Compensation Function",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/workflow-hooks",
              title: "Workflow Hooks",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/add-workflow-hook",
              title: "Expose a Hook",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/access-workflow-errors",
              title: "Access Workflow Errors",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/retry-failed-steps",
              title: "Retry Failed Steps",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/parallel-steps",
              title: "Run Steps in Parallel",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/workflow-timeout",
              title: "Workflow Timeout",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/long-running-workflow",
              title: "Long-Running Workflow",
            },
            {
              type: "link",
              path: "/learn/advanced-development/workflows/execute-another-workflow",
              title: "Execute Another Workflow",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/advanced-development/custom-cli-scripts",
          title: "Custom CLI Scripts",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/custom-cli-scripts/seed-data",
              title: "Seed Data",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/advanced-development/admin",
          title: "Admin Development",
          children: [
            {
              type: "link",
              path: "/learn/advanced-development/admin/widgets",
              title: "Admin Widgets",
            },
            {
              type: "link",
              path: "/learn/advanced-development/admin/ui-routes",
              title: "Admin UI Routes",
            },
            {
              type: "link",
              path: "/learn/advanced-development/admin/constraints",
              title: "Constraints",
            },
            {
              type: "link",
              path: "/learn/advanced-development/admin/tips",
              title: "Tips",
            },
          ],
        },
      ],
    },
    {
      type: "link",
      path: "/learn/storefront-development",
      title: "Storefront Development",
      chapterTitle: "Storefront",
      children: [
        {
          type: "link",
          path: "/learn/storefront-development/nextjs-starter",
          title: "Next.js Starter",
        },
      ],
    },
    {
      type: "link",
      path: "/learn/debugging-and-testing",
      title: "Debugging and Testing",
      chapterTitle: "Debugging & Testing",
      children: [
        {
          type: "link",
          path: "/learn/debugging-and-testing/testing-tools",
          title: "Testing Tools",
        },
        {
          type: "link",
          path: "/learn/debugging-and-testing/testing-tools/integration-tests",
          title: "Integration Tests",
          children: [
            {
              type: "link",
              path: "/learn/debugging-and-testing/testing-tools/integration-tests/api-routes",
              title: "Example: API Routes Tests",
            },
            {
              type: "link",
              path: "/learn/debugging-and-testing/testing-tools/integration-tests/workflows",
              title: "Example: Workflows Tests",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/debugging-and-testing/testing-tools/modules-tests",
          title: "Modules Tests",
          children: [
            {
              type: "link",
              path: "/learn/debugging-and-testing/testing-tools/modules-tests/module-example",
              title: "Example",
            },
          ],
        },
        {
          type: "link",
          path: "/learn/debugging-and-testing/instrumentation",
          title: "Instrumentation",
        },
        {
          type: "link",
          path: "/learn/debugging-and-testing/logging",
          title: "Logging",
        },
      ],
    },
    {
      type: "link",
      path: "/learn/deployment",
      title: "Deployment",
    },
    {
      type: "link",
      path: "/learn/more-resources",
      title: "More Resources",
      children: [
        {
          type: "link",
          path: "/learn/more-resources/cheatsheet",
          title: "Cheat Sheet",
        },
      ],
    },
  ])
)
