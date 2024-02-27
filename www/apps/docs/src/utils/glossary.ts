export type GlossaryType = {
  matchTextRegex: RegExp
  ignoreTextRegex?: RegExp
  title: string
  content: string
  referenceLink: string
}

const glossary: GlossaryType[] = [
  {
    title: "Migration",
    content: "A script that is used to reflect changes to the database schema.",
    matchTextRegex: /migration/i,
    referenceLink: "/development/entities/migrations/overview",
  },
  {
    title: "Repository",
    content:
      "A class that provides generic methods to retrieve and manipulate entities.",
    matchTextRegex: /(repository|repositories)/i,
    referenceLink: "/development/entities/repositories",
  },
  {
    title: "Entity",
    content: "A class that represents a table in the database.",
    matchTextRegex: /(entity|entities)/i,
    referenceLink: "/development/entities/overview",
  },
  {
    title: "Dependency Injection",
    content:
      "Classes receive other resources, such as services or repositories, in their constructor using dependency injection.",
    matchTextRegex: /(dependency injection|dependency-injection)/i,
    referenceLink: "/development/fundamentals/dependency-injection",
  },
  {
    title: "Middleware",
    content:
      "A function that can be executed before or after API Route requests are handled.",
    matchTextRegex: /middleware/i,
    referenceLink: "/development/api-routes/add-middleware",
  },
  {
    title: "API Route",
    content: "REST API routes exposed to frontends or external systems.",
    matchTextRegex: /api-routes/i,
    referenceLink: "/development/api-routes/overview",
  },
  {
    title: "Subscriber",
    content: "A class that registers handler methods to an event.",
    matchTextRegex: /subscriber/i,
    referenceLink: "/development/events/subscribers",
  },
  {
    title: "Module",
    content:
      "Reusable pieces of code, typically as NPM packages, that provide specific functionality or feature.",
    matchTextRegex: /module/,
    ignoreTextRegex: /commerce module/i,
    referenceLink: "/development/modules/overview",
  },
  {
    title: "Loader",
    content: "A script that runs when the Medusa backend starts.",
    matchTextRegex: /loader/i,
    referenceLink: "/development/loaders/overview",
  },
  {
    title: "Scheduled Job",
    content:
      "A task that is performed at specific times during the Medusa backend's runtime.",
    matchTextRegex: /scheduled job/i,
    referenceLink: "/development/scheduled-jobs/overview",
  },
  {
    title: "Batch Job",
    content: "A task that is performed asynchronously and iteratively.",
    matchTextRegex: /batch job/i,
    referenceLink: "/development/batch-jobs",
  },
  {
    title: "Strategy",
    content:
      "A class that contains an isolated piece of logic that can be overridden and customized.",
    matchTextRegex: /(strategy|strategies)/i,
    referenceLink: "/development/strategies/overview",
  },
  {
    title: "Feature Flag",
    content:
      "A flag that guards beta features in the Medusa backend and ensures they can only be used when enabled.",
    matchTextRegex: /(feature-flag|feature flag)/i,
    referenceLink: "/development/feature-flags/overview",
  },
  {
    title: "Idempotency Key",
    content:
      "A unique, randomly-generated key associated with a process, such as cart completion.",
    matchTextRegex: /(idempotency-key|idempotency key)/i,
    referenceLink: "/development/idempotency-key/overview",
  },
  {
    title: "Search Service",
    content:
      "A class that implements an interface to provide search functionalities.",
    matchTextRegex: /(search service|search-service)/i,
    referenceLink: "/development/search/overview",
  },
  {
    title: "File Service",
    content:
      "A class that implements an interface to provide storage functionalities.",
    matchTextRegex: /(file service|file-service)/i,
    referenceLink: "/development/file-service/overview",
  },
  {
    title: "Notification Service",
    content:
      "A class that implements an interface to provide notification functionalities.",
    matchTextRegex: /(notification service|notification-service)/i,
    referenceLink: "/development/notification/overview",
  },
  {
    title: "Plugin",
    content:
      "A reusable NPM package that can be reused in Medusa backends and provide custom functionalities.",
    matchTextRegex: /plugin/i,
    ignoreTextRegex:
      /(file-service plugin|file service plugin|notification service plugin|notification-service plugin|search service plugin|search-service plugin)/i,
    referenceLink: "/development/plugins/overview",
  },
  {
    title: "Service",
    content:
      "A class that typically includes helper methods associated with an entity.",
    matchTextRegex: /service/i,
    ignoreTextRegex:
      /(file-service|file service|notification service|notification-service|search service|search-service)/i,
    referenceLink: "/development/services/overview",
  },
  {
    title: "Publishable API Key",
    content:
      "An API key that is associated with a set of resources and used on the client (storefront) side.",
    matchTextRegex: /(publishable-api-key|publishable api key)/i,
    referenceLink: "/development/publishable-api-keys",
  },
  {
    title: "JavaScript Client",
    content:
      "An NPM package that provides methods to interact with the Medusa backend's REST APIs.",
    matchTextRegex: /(js-client|js client|medusa javascript client)/i,
    referenceLink: "/js-client/overview",
  },
  {
    title: "Medusa React",
    content:
      "An NPM package that provides React hooks and utility methods to interact with the Medusa backend's REST APIs.",
    matchTextRegex: /(medusa-react|medusa react)/i,
    referenceLink: "/medusa-react/overview",
  },
  {
    title: "Admin Widget",
    content:
      "Custom React components that can be injected into different locations in the Medusa admin dashboard.",
    matchTextRegex: /admin widget/i,
    referenceLink: "/admin/widgets",
  },
  {
    title: "Admin UI Route",
    content:
      "A React component that is used to create a new page in the Medusa admin dashboard.",
    matchTextRegex: /(admin route|admin UI route)/i,
    referenceLink: "/admin/routes",
  },
  {
    title: "Admin Setting Page",
    content:
      "A React component that is used to create a new setting page in the Medusa admin dashboard.",
    matchTextRegex: /admin setting page/i,
    referenceLink: "/admin/setting-pages",
  },
]

export const getGlossary = () => [...glossary]

export const getGlossaryByPath = (path: string): GlossaryType | undefined => {
  return glossary.find(
    (g) => g.matchTextRegex.test(path) && !g.ignoreTextRegex?.test(path)
  )
}
