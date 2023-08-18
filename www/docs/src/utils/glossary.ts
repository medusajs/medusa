type GlossaryType = {
  matchTextRegex: RegExp
  ignoreTextRegex?: RegExp
  title: string
  content: string
}

const glossary: GlossaryType[] = [
  {
    title: "Migration",
    content: "A script that is used to reflect changes to the database schema.",
    matchTextRegex: /migration/i,
  },
  {
    title: "Repository",
    content:
      "A class that provides generic methods to retrieve and manipulate entities.",
    matchTextRegex: /(repository|repositories)/i,
  },
  {
    title: "Entity",
    content: "A class that represents a table in the database.",
    matchTextRegex: /(entity|entities)/i,
  },
  {
    title: "Dependency Injection",
    content: "The act of delivering the required resources to a class",
    matchTextRegex: /(dependency injection|dependency-injection)/i,
  },
  {
    title: "Middleware",
    content:
      "A function that can be executed before or after endpoint requests are handled.",
    matchTextRegex: /middleware/i,
  },
  {
    title: "Endpoint",
    content: "REST API exposed to frontends or external systems.",
    matchTextRegex: /endpoint/i,
  },
  {
    title: "Subscriber",
    content: "A class that registers handler methods to an event.",
    matchTextRegex: /subscriber/i,
  },
  {
    title: "Module",
    content:
      "Reusable pieces of code that provide specific functionality or feature.",
    matchTextRegex: /module/,
    ignoreTextRegex: /commerce module/i,
  },
  {
    title: "Loader",
    content: "A script that runs when the Medusa backend starts.",
    matchTextRegex: /loader/i,
  },
  {
    title: "Scheduled Job",
    content:
      "A task that is performed at specific times during the Medusa backend's runtime.",
    matchTextRegex: /scheduled job/i,
  },
  {
    title: "Batch Job",
    content: "A task that is performed asynchronously and iteratively.",
    matchTextRegex: /batch job/i,
  },
  {
    title: "Strategy",
    content:
      "A class that contains an isolated piece of logic that can be overridden and customized",
    matchTextRegex: /(strategy|strategies)/i,
  },
  {
    title: "Feature Flag",
    content: "Guards beta features in the Medusa backend.",
    matchTextRegex: /(feature-flag|feature flag)/i,
  },
  {
    title: "Idempotency Key",
    content:
      "A unique, randomly-generated key associated with a process, such as cart completion.",
    matchTextRegex: /(idempotency-key|idempotency key)/i,
  },
  {
    title: "Search Service",
    content:
      "A class that implements an interface to provide search functionalities.",
    matchTextRegex: /(search service|search-service)/i,
  },
  {
    title: "File Service",
    content:
      "A class that implements an interface to provide storage functionalities.",
    matchTextRegex: /(file service|file-service)/i,
  },
  {
    title: "Notification Service",
    content:
      "A class that implements an interface to provide notification functionalities.",
    matchTextRegex: /(notification service|notification-service)/i,
  },
  {
    title: "Plugin",
    content:
      "A reusable NPM package that can be reused in Medusa backends and provide custom functionalities.",
    matchTextRegex: /plugin/i,
    ignoreTextRegex:
      /(file-service plugin|file service plugin|notification service plugin|notification-service plugin|search service plugin|search-service plugin)/i,
  },
  {
    title: "Service",
    content: "A class that includes helper methods associated with an entity.",
    matchTextRegex: /service/i,
    ignoreTextRegex:
      /(file-service|file service|notification service|notification-service|search service|search-service)/i,
  },
  {
    title: "Publishable API Key",
    content:
      "An API key that is associated with a set of resources and used on the client (storefront) side.",
    matchTextRegex: /(publishable-api-key|publishable api key)/i,
  },
  {
    title: "JavaScript Client",
    content:
      "An NPM package that provides methods to interact with the Medusa backend's REST APIs.",
    matchTextRegex: /(js-client|js client|medusa javascript client)/i,
  },
  {
    title: "Medusa React",
    content:
      "An NPM package that provides React hooks and utility methods to interact with the Medusa backend's REST APIs.",
    matchTextRegex: /(medusa-react|medusa react)/i,
  },
  {
    title: "Admin Widget",
    content:
      "Custom React components that can be injected into different locations in the Medusa admin dashboard",
    matchTextRegex: /admin widget/i,
  },
  {
    title: "Admin UI Route",
    content:
      "A React component that is used to create a new page in the Medusa admin dashboard.",
    matchTextRegex: /(admin route|admin UI route)/i,
  },
  {
    title: "Admin Setting Page",
    content:
      "A React component that is used to create a new setting page in the Medusa admin dashboard",
    matchTextRegex: /admin setting page/i,
  },
]

export const getGlossary = () => [...glossary]

export const getGlossaryByPath = (path: string): GlossaryType | undefined => {
  return glossary.find(
    (g) => g.matchTextRegex.test(path) && !g.ignoreTextRegex?.test(path)
  )
}
