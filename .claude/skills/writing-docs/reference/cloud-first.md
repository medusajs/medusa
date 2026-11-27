# Cloud-First Messaging

Medusa's docs present Medusa as an agent-native commerce platform and Cloud as the main way to build with it. Apply these rules to every page in every project.

## Core Rules

- **Assume the reader is a Cloud user.** Show how to do the task on Cloud first, then how to do it in local development.
- **Local development is the second path, not an alternative to Cloud.** Readers set up locally by cloning their Cloud project ([Set Up Medusa Locally](!cloud!/setup-locally)), build and test locally, then publish to Cloud.
- **Don't mention self-hosting or other deployment platforms** Deployment means deploying to Cloud. Only the existing self-hosting pages (for example, `!docs!/learn/deployment/general`) cover it, and new content doesn't link to them.
- **Don't install with `create-medusa-app`.** Its only home is the [reference page](!resources!/create-medusa-app). Link setup prerequisites to `!cloud!/setup-locally` (or `!cloud!/first-project` for creating a project), never `!docs!/learn/installation` (redirected).
- **Call the admin user docs the "Merchant Guide"**, never "User Guide" or "Medusa Admin User Guide". The project directory and link prefix stay `user-guide` (`!user-guide!/...`).
- **Call the AI docs assistant "Docs Assistant"**, never "Bloom".
- **Agents are first-class readers.** Write steps an agent can perform without manual hand-offs, and add an Agent Hand-off note where an agent can do the task.

## Docs Structure (Navbar → Project)

| Navbar item | Project and path | Holds |
|---|---|---|
| Get Started | `cloud` (`/cloud`) | Introduction, Sign Up, first project, Going Live Checklist, Features, AI Toolkit, Setup Locally, Development Resources, Integrations, and the Cloud platform sections (Management, Resources, Search, Enterprise, Webhooks, Billing, Monitoring, Networking) |
| Commerce | `resources` (`/resources/commerce-modules`) | Commerce Module pages |
| Build | `book` (`/learn`) and `resources` | Framework (`/learn`), Storefront Development, Recipes, How-to & Tutorials |
| Merchant Guide | `user-guide` (`/user-guide`) | Admin dashboard guides for merchants |
| Developer Resources | `resources`, `ui`, `api-reference` | Tools (Cloud CLI, Medusa CLI, JS SDK, ...) and references |

- Onboarding, AI tooling, and local setup belong in `cloud`, not in the `book`'s `/learn`.
- The `book` is the open-source Framework. Its introduction focuses on the Framework, not on installation.

## Environment Variables

Set them in Cloud first, then in `.env` for local development:

````mdx
Set the `MY_SERVICE_API_KEY` environment variable:

1. In Cloud, add the variable in your environment's [Environment variables settings](!cloud!/environments/environment-variables#add-environment-variables-on-cloud). Mark it as **Sensitive**, and enable the **Build** toggle, since `medusa-config.ts` reads it during the build.
2. For local development, add the variable to your `.env` file:

```bash title=".env"
MY_SERVICE_API_KEY=<YOUR_API_KEY>
```
````

- Mark secrets (API keys, tokens, webhook secrets) as **Sensitive**.
- Enable **Build** only for variables that `medusa-config.ts` or the build reads.
- For webhooks and other public URLs, use the deployed environment's backend URL (`{your_backend_url}`), and say that a local application needs a tunnel such as ngrok.

## Deploying Changes

Deploying means pushing to the branch a Cloud environment tracks:

```mdx
Commit the changes and push them to the branch that your Cloud environment tracks. Cloud then [creates a deployment](!cloud!/deployments#how-are-deployments-created) that applies them.
```

Guides that build a feature end with a publish step that links [Publish Customizations to Cloud](!docs!/learn/customization/publish). See the `writing-tutorials` skill for the full template.

## Infrastructure and Cloud-Managed Behavior

When Cloud already provides or configures something, say so before the local instructions, and tell the reader what to skip on Cloud:

```mdx
On Cloud, Medusa provides [Medusa Cache](!cloud!/cache), which configures the Caching Module with a managed Redis instance. You only enable the feature flag.

Locally, you register the Caching Module with a provider, such as Redis.
```

Examples: managed database, Redis, S3 file storage, caching, emails ([Medusa Emails](!cloud!/emails)), worker modes, and data transfer usage for syncing with third-party services.

## Agent Hand-off Notes

Add one near the top of any page whose steps an agent can perform (setup guides, provider setup, tutorials, recipes). Point the prompt at the page's Markdown URL (the page URL plus `.md`):

````mdx
<Note title="Agent Hand-off">

Your AI agent can perform the steps in this guide. Run the following prompt in your agent from your Medusa application's directory:

```bash title="Prompt"
Fetch https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/github.md and set up the GitHub Auth Module Provider in my Medusa application
```

</Note>
````

- Adjust "from your Medusa application's directory" to where the agent should run (for example, "from the directory where you want to create the plugin").
- Guides that start by creating a Cloud project begin the note with "After you create a Cloud project, your AI agent can perform the rest of the steps in this guide, including setting up the project locally."
- Skip it on conceptual pages and Merchant Guide pages.

## Admin URLs

Refer to the admin of a deployed Cloud environment, not `localhost:9000/app`. Mention the local URL only as a secondary note for readers running Medusa locally. `localhost:9000` is fine in local-development steps, such as testing an API route with `curl`.

## Prerequisites

```mdx
<Prerequisites
  items={[
    {
      text: "Medusa application set up locally",
      link: "!cloud!/setup-locally",
    },
  ]}
/>
```

## Features Page and What's New

When you document a new feature, also add it to the Features page (`www/apps/cloud/app/features/page.mdx`) and the What's New list (`www/apps/book/components/Homepage/WhatsNewSection/data.ts`). See `www/apps/cloud/CLAUDE.md` and `www/apps/book/CLAUDE.md`.
