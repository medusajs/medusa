/** @type {import('types').Sidebar.SidebarItem[]} */
export const auditSidebar = [
  {
    type: "sidebar",
    sidebar_id: "audit",
    title: "Audit Module",
    children: [
      {
        type: "link",
        path: "/enterprise/audit",
        title: "Overview",
      },
      {
        type: "link",
        path: "/enterprise/audit/module-options",
        title: "Module Options",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Server Guides",
        children: [
          {
            type: "link",
            path: "/enterprise/audit/record-api-requests",
            title: "Record API Requests",
          },
          {
            type: "link",
            path: "/enterprise/audit/record-custom-audit-logs",
            title: "Record Custom Audit Logs",
          },
          {
            type: "link",
            path: "/enterprise/audit/read-audit-logs",
            title: "Read Audit Logs",
          },
          {
            type: "link",
            path: "/references/audit/provider",
            title: "Create Audit Provider",
          },
        ],
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+audit",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to view audit logs in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Audit Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/enterprise/audit/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+audit",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Audit Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "audit-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Audit Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/audit",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/audit/IAuditModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "audit-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Audit Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/audit/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/audit_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
