/** @type {import('types').Sidebar.SidebarItem[]} */
export const infrastructureModulesSidebar = [
  {
    type: "link",
    path: "/infrastructure-modules",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "Analytics Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/analytics",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/analytics/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/infrastructure-modules/analytics/posthog",
            title: "PostHog",
          },
          {
            type: "ref",
            path: "/integrations/guides/segment",
            title: "Segment",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/references/analytics/provider",
            title: "Create Analytics Module Provider",
          },
          {
            type: "link",
            path: "/references/analytics/service",
            title: "Use Analytics Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Caching Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/caching",
        title: "Overview",
      },
      {
        type: "link",
        path: "/infrastructure-modules/caching/concepts",
        title: "Concepts",
      },
      {
        type: "link",
        path: "/infrastructure-modules/caching/migrate-cache",
        title: "Migrate from Cache Module",
      },
      {
        type: "link",
        title: "Providers",
        path: "/infrastructure-modules/caching/providers",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/caching/providers/redis",
            title: "Redis",
          },
          {
            type: "link",
            path: "/infrastructure-modules/caching/guides/memcached",
            title: "Memcached",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/caching/guides/clear-cache",
            title: "Clear Cache",
          },
          {
            type: "link",
            path: "/references/caching-module-provider",
            title: "Create Caching Module Provider",
          },
          {
            type: "link",
            path: "/references/caching-service",
            title: "Use Caching Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Cache Module",
    initialOpen: false,
    badge: {
      variant: "neutral",
      text: "Deprecated",
    },
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/cache",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/cache/in-memory",
            title: "In-Memory",
          },
          {
            type: "link",
            path: "/infrastructure-modules/cache/redis",
            title: "Redis",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/cache/create",
            title: "Create Cache Module",
          },
          {
            type: "link",
            path: "/references/cache-service",
            title: "Use Cache Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Event Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/event",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/event/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/infrastructure-modules/event/redis",
            title: "Redis",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/event/create",
            title: "Create Event Module",
          },
          {
            type: "link",
            path: "/references/event-service",
            title: "Use Event Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "File Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/file",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Providers",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/file/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/infrastructure-modules/file/s3",
            title: "AWS S3 (and Compatible APIs)",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/references/file-provider-module",
            title: "Create File Provider",
          },
          {
            type: "link",
            path: "/references/file-service",
            title: "Use File Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Locking Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/locking",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Providers",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/locking/redis",
            title: "Redis",
          },
          {
            type: "link",
            path: "/infrastructure-modules/locking/postgres",
            title: "PostgreSQL",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/references/locking-module-provider",
            title: "Create Locking Provider",
          },
          {
            type: "link",
            path: "/references/locking-service",
            title: "Use Locking Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Notification Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/notification",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Providers",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/notification/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/infrastructure-modules/notification/sendgrid",
            title: "SendGrid",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        autogenerate_tags: "notification+server",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        children: [
          {
            type: "link",
            path: "/references/notification-provider-module",
            title: "Create Notification Provider",
          },
          {
            type: "ref",
            path: "/integrations/guides/resend",
            title: "Integrate Resend",
          },
          {
            type: "link",
            path: "/infrastructure-modules/notification/send-notification",
            title: "Send Notification",
          },
          {
            type: "link",
            path: "/references/notification-service",
            title: "Use Notification Module",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Workflow Engine Module",
    initialOpen: true,
    children: [
      {
        type: "link",
        path: "/infrastructure-modules/workflow-engine",
        title: "Overview",
      },
      {
        type: "sub-category",
        title: "Modules",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/workflow-engine/in-memory",
            title: "In-Memory",
          },
          {
            type: "link",
            path: "/infrastructure-modules/workflow-engine/redis",
            title: "Redis",
          },
        ],
      },
      {
        type: "sub-category",
        title: "Guides",
        children: [
          {
            type: "link",
            path: "/infrastructure-modules/workflow-engine/how-to-use",
            title: "Use Workflow Engine Module",
          },
        ],
      },
    ],
  },
]
