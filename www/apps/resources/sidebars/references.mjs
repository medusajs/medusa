/** @type {import('types').Sidebar.SidebarItem[]} */
export const referencesSidebar = [
  {
    type: "link",
    path: "/references-overview",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "link",
    path: "/admin-widget-injection-zones",
    title: "Admin Widget Injection Zones",
    description: "List of injection zones you can add widgets in.",
  },
  {
    type: "link",
    path: "/medusa-container-resources",
    title: "Container Resources",
    description:
      "Resources you can access through the Medusa and Module containers.",
  },
  {
    type: "sidebar",
    sidebar_id: "core-flows",
    title: "Core Workflows",
    custom_autogenerate: "core-flows",
    description:
      "Built-in workflows and steps you can use in your customizations.",
  },
  {
    type: "sidebar",
    sidebar_id: "dml-reference",
    title: "Data Model Language",
    childSidebarTitle: "Data Model Language Reference",
    description: "API reference of the Data Model Langauge (DML).",
    children: [
      {
        type: "link",
        path: "/references/data-model",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "link",
        path: "/references/data-model/define",
        title: "Define Method",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Property Types",
        autogenerate_path: "/references/dml/Property_Types/methods",
      },
      {
        type: "category",
        title: "Relationship Methods",
        autogenerate_path: "/references/dml/Relationship_Methods/methods",
      },
      {
        type: "category",
        title: "Model Methods",
        autogenerate_path: "/references/dml/Model_Methods/methods",
      },
      {
        type: "category",
        title: "Property Configuration Methods",
        autogenerate_path:
          "/references/dml/Property_Configuration_Methods/methods",
      },
    ],
  },
  {
    type: "sidebar",
    sidebar_id: "data-model-repository-reference",
    title: "Data Model Repository",
    description:
      "List of methods in your service extending the data model repository.",
    children: [
      {
        type: "link",
        path: "/data-model-repository-reference",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Methods",
        initialOpen: true,
        autogenerate_path: "/data-model-repository-reference/methods",
      },
      {
        type: "category",
        title: "Tips",
        initialOpen: true,
        autogenerate_path: "/data-model-repository-reference/tips",
      },
    ],
  },
  {
    type: "link",
    path: "/references/events",
    title: "Events",
    description: "List of events emitted by Medusa's Commerce Modules.",
  },
  {
    type: "sidebar",
    sidebar_id: "helper-steps-reference",
    title: "Helper Steps",
    description: "Steps to query data, emit events, create links, and more.",
    children: [
      {
        type: "link",
        path: "/references/helper-steps",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Steps",
        autogenerate_path: "/references/helper_steps/functions",
        initialOpen: true,
      },
    ],
  },
  {
    type: "sidebar",
    sidebar_id: "service-factory-reference",
    title: "Service Factory",
    description:
      "List of methods in your service extending the service factory.",
    children: [
      {
        type: "link",
        path: "/service-factory-reference",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Methods",
        initialOpen: true,
        autogenerate_path: "/service-factory-reference/methods",
      },
      {
        type: "category",
        title: "Tips",
        initialOpen: true,
        autogenerate_path: "/service-factory-reference/tips",
      },
    ],
  },
  {
    type: "sidebar",
    sidebar_id: "test-tools-reference",
    title: "Testing Framework",
    description: "API reference of functions you can use to write tests.",
    children: [
      {
        type: "link",
        path: "/test-tools-reference",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Functions",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "medusaIntegrationTestRunner",
            path: "/test-tools-reference/medusaIntegrationTestRunner",
          },
          {
            type: "link",
            title: "moduleIntegrationTestRunner",
            path: "/test-tools-reference/moduleIntegrationTestRunner",
          },
        ],
      },
    ],
  },
  {
    type: "sidebar",
    sidebar_id: "workflows-sdk-reference",
    title: "Workflows SDK",
    childSidebarTitle: "Workflows SDK Reference",
    description: "API reference of the Workflow SDK functions and helpers.",
    children: [
      {
        type: "link",
        path: "/references/workflows",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Functions",
        initialOpen: true,
        autogenerate_path: "/references/workflows/functions",
      },
    ],
  },
]
