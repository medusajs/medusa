# Tutorial MDX Conventions

Reference for MDX structure, components, and patterns used in Medusa tutorials.

## Frontmatter

```yaml
---
sidebar_label: "Feature Name"
tags:
    - name: module-name
      label: "Implement Feature Name"
    - server
    - tutorial
products:
  - product
  - customer
---
```

- `sidebar_label`: Short display name for the sidebar
- `tags`: Mix of string tags (`server`, `tutorial`) and object tags (`{name, label}`) for cross-linking
- `products`: Medusa Commerce Modules covered (product, cart, order, customer, promotion, payment, etc.)

For integration guides, add the service type as a tag string (e.g., `analytics`, `notification`, `cms`).

## Required Imports and Metadata

```mdx
import { Github, PlaySolid } from "@medusajs/icons"
import { Prerequisites, WorkflowDiagram, CardList } from "docs-ui"

export const metadata = {
  title: `Implement X in Medusa`,
}
```

## Standard Section Order

```text
# {metadata.title}

[Intro paragraph]

## Summary

[Bullet list]

You can follow this tutorial whether you're new to Medusa or an advanced Medusa developer.

![Overview diagram alt text](https://res.cloudinary.com/...)

<CardList items={[...]} />

<Note title="Agent Hand-off">
[pre-written template — see below]
</Note>

---

## Step 1: Create a Cloud Project and Set It Up Locally
[pre-written template — see below]

## Step 2: ...
...

## Step N: Publish to Cloud
[pre-written template — see below]

## Next Steps

### Troubleshooting

### Getting Help
```

Note: `## Troubleshooting` and `## Getting Help` are **subsections** (`###`) under `## Next Steps`, not top-level sections.

Tutorials are **Cloud-first**: the reader creates a Cloud project, builds and tests locally, then publishes to Cloud. Never install with `create-medusa-app` and never describe self-hosting or other deployment platforms.

## Agent Hand-off Note (Always Include)

Place it after the `CardList` and before the `---` that precedes Step 1. Replace the URL with the tutorial's URL plus `.md`, and end the prompt with a short imperative describing the feature:

````mdx
<Note title="Agent Hand-off">

After you create a Cloud project, your AI agent can perform the rest of the steps in this guide, including setting up the project locally. Run the following prompt in your agent from the directory where you want to set up the project, or from the project's directory if you already set it up:

```bash title="Prompt"
Fetch https://docs.medusajs.com/resources/how-to-tutorials/tutorials/{name}.md and [implement X] in my Medusa project
```

</Note>
````

## Pre-Written Step 1 Template (Always Use Verbatim)

Copy this exactly — do not rewrite it:

````mdx
## Step 1: Create a Cloud Project and Set It Up Locally

<Prerequisites items={[
  {
    text: "A Medusa account",
    link: "!cloud!/sign-up"
  },
  {
    text: "Node.js v22.22.0+",
    link: "https://nodejs.org/en/download"
  },
  {
    text: "Git CLI tool",
    link: "https://git-scm.com/downloads"
  },
  {
    text: "PostgreSQL",
    link: "https://www.postgresql.org/download/"
  }
]} />

Start by creating a Cloud project from the DTC starter, which includes the Medusa application and the [Next.js Starter Storefront](../../../nextjs-starter/page.mdx). Follow the [Create Your First Project](!cloud!/first-project#option-1-choose-a-starter) guide to create the project.

Cloud clones the starter into a GitHub repository in your account or organization. Then, set up the project on your machine by following the [Set Up Medusa Locally](!cloud!/setup-locally) guide. You build and test the customizations in this tutorial locally, then publish them to Cloud at the end.

The project is a monorepository. The Medusa application is in the `apps/backend` directory, and the Next.js Starter Storefront is in the `apps/storefront` directory.

<Note>

In this guide, all file paths of backend customizations are relative to the `apps/backend` directory of your Medusa project.

</Note>

---
````

For guides that don't customize the storefront, drop the storefront mentions:

- First paragraph: `Start by creating a Cloud project from the DTC starter. Follow the ...`
- Monorepo sentence: `The project is a monorepository. The Medusa application is in the `apps/backend` directory.`

Add extra prerequisites for integration guides (e.g., third-party account, API key) after the PostgreSQL item.

## Environment Variables

Show the `.env` change for local development, then add this line after it, linking to the publish step's anchor:

```mdx
You'll add these variables to your Cloud environment when you [publish to Cloud](#step-N-publish-to-cloud).
```

The publish step lists every variable and explains where to set it (see the template below).

## Pre-Written Publish to Cloud Template (Always the Last Step)

The last numbered step before `## Next Steps` is always `## Step N: Publish to Cloud`. Use this template, replacing the branch name, commit message, and feature description:

````mdx
## Step N: Publish to Cloud

After you test the [feature] customizations locally, publish them to your Cloud project.

Create a new branch, commit your changes, and push them to the project's repository:

```bash
git checkout -b feat/{feature-name}
git add .
git commit -m "Add {feature}"
git push origin feat/{feature-name}
```

Then, on GitHub, open a pull request from the `feat/{feature-name}` branch to your production branch. Cloud deploys the changes to a [preview environment](!cloud!/environments/preview), where you can test them before you merge the pull request. Once you merge it, Cloud deploys the changes to your production environment.

Learn more in the [Publish Customizations to Cloud](!docs!/learn/customization/publish) chapter.

---
````

If the tutorial added environment variables, insert this before "Create a new branch", listing each variable and marking secrets (API keys, tokens, webhook secrets) as **Sensitive**:

````mdx
Create the environment variables that you added in the `.env` file in your Cloud project. Add the following variables in the environment's **Backend** variables:

- `MY_SERVICE_API_KEY`

Add the variables in two places:

1. **Preview environments**: In your project's dashboard, click **Preview Settings** in the sidebar, and add the variables in the environment variables section. Preview environments created afterward inherit them. Learn more in the [Preview Environments](!cloud!/environments/preview#manage-shared-previews-settings) guide.
2. **Target environment**: In the dashboard of the environment you're publishing to, such as Production, click **Environment variables** in the sidebar, then add the variables and click **Save**. Each environment has its own variables, so repeat this for every environment you publish to.

In both places, enable the **Build** toggle of all the variables, since `medusa-config.ts` reads them. Mark `MY_SERVICE_API_KEY` as **Sensitive**. Learn more in the [Environment Variables](!cloud!/environments/environment-variables) Cloud guide.
````

Only enable **Build** for variables that `medusa-config.ts` or the build reads. If a third-party service needs the deployed URL (webhooks, redirect URLs), add a numbered "After you merge the pull request" list that tells the reader to update it to `{your_backend_url}/...`.

## Intro Paragraph Pattern

```
In this tutorial, you'll learn how to implement [X] in Medusa.

When you install a Medusa application, you get a fully-fledged commerce platform with a Framework for customization. The Medusa application's commerce features are built around [Commerce Modules](../../../commerce-modules/page.mdx) which are available out-of-the-box.

Medusa doesn't provide [X] out-of-the-box, but the Medusa Framework facilitates implementing customizations like [X]. In this tutorial, you'll learn how to customize the Medusa server[, Admin dashboard, and Next.js Starter Storefront] to implement [X].

You can follow this guide whether you're new to Medusa or an advanced Medusa developer.
```

## Summary Section Pattern

```mdx
## Summary

By following this tutorial, you'll learn how to:

- Create a Cloud project and set it up locally.
- [Main feature: e.g., Define product review models and implement their management features in the Medusa server.]
- [Admin: e.g., Customize the Medusa Admin to allow merchants to view and manage product reviews.]
- [Storefront: e.g., Customize the Next.js Starter Storefront to display and submit product reviews.]
- Publish the customizations to Cloud.
```

## CardList (GitHub + OpenAPI)

```mdx
<CardList items={[
  {
    href: "https://github.com/medusajs/examples/tree/main/{example-name}",
    title: "{Feature Name} Repository",
    text: "Find the full code for this guide in this repository.",
    icon: Github,
  },
  {
    href: "https://res.cloudinary.com/dza7lstvk/raw/upload/v.../OpenApi/{name}.yaml",
    title: "OpenApi Specs for Postman",
    text: "Import this OpenApi Specs file into tools like Postman.",
    icon: PlaySolid,
  },
]} />
```

If no OpenAPI specs exist, omit the second card.

## Components

### Prerequisites
Use only at Step 1 (see the Step 1 template for the items). Add extra prerequisites for integration guides (e.g., third-party account, API key).

### WorkflowDiagram
Place immediately after introducing a workflow:
```mdx
<WorkflowDiagram
  workflow={{
    name: "myWorkflowName",
    steps: [
      {
        type: "step",
        name: "stepName",
        description: "What this step does.",
        depth: 1,
      },
      {
        type: "when",
        condition: "If condition is true",
        depth: 2,
        steps: [
          { type: "step", name: "conditionalStep", description: "...", depth: 3 },
        ],
      },
    ],
  }}
/>
```

### Note
```mdx
<Note>
Plain note with no title.
</Note>

<Note title="Why is this needed?">
Note with a custom title.
</Note>
```

## Code Block Attributes

```
```ts title="src/modules/review/models/product-review.ts"
// backend code
```

```tsx title="src/app/products/[id]/page.tsx" badgeLabel="Storefront" badgeColor="blue"
// storefront code
```

```ts title="src/workflows/create-review.ts" highlights={createReviewHighlights}
// workflow code with line highlights
```

```bash npm2yarn
npm install some-package
```

```bash npx2yarnExec
npx medusa db:migrate
```
```

**Badge conventions:**
- `badgeLabel="Storefront"` + `badgeColor="blue"` — Next.js storefront files
- `badgeLabel="Medusa Application"` + `badgeColor="green"` — backend files (only when both appear close together)

## Highlights Arrays

Define highlights as exported constants before the MDX body:

```ts
export const workflowHighlights = [
  ["5", "input", "The workflow receives the review data as input."],
  ["10", "product_id", "Retrieve the product to validate it exists."],
  ["18", "review", "Create the product review record."],
]
```

Format: `[lineNumber, keyword/identifier, description]`

Reference in code block: `highlights={workflowHighlights}`

## Service Method Sub-Steps Pattern

When a step requires implementing multiple methods on a service class (common in module provider integrations), each method gets its own lettered sub-step under the parent step. Structure:

1. First sub-step: create the service file with the class scaffold (no methods yet), then explain the class structure below the code block
2. Subsequent sub-steps: one per method — explain what it does, show the code adding that method to the class, then explain implementation details

**Sub-step heading format:** `### {letter}. Implement {methodName} Method`

**Example structure for a service step:**

````mdx
## Step 3: Create Mailchimp Module Provider

[concept definition + module creation context]

### a. Create Module Directory

[directory creation instruction]

### b. Create Service

[1-2 sentences on what the service does]

Create the file `src/modules/mailchimp/service.ts` with the following content:

```ts title="src/modules/mailchimp/service.ts" highlights={serviceHighlights}
// class scaffold with constructor only, no method implementations yet
```

[Explanation of class structure: what it extends, static `identifier`, constructor params and what each option means]

In the next sections, you'll implement the methods of the `MailchimpNotificationProviderService` class.

### c. Implement validateOptions Method

The `validateOptions` method is used to validate the options passed to the module provider. If the method throws an error, the Medusa application won't start.

Add the `validateOptions` method to the `MailchimpNotificationProviderService` class:

```ts title="src/modules/mailchimp/service.ts"
class MailchimpNotificationProviderService extends AbstractNotificationProviderService {
  // ...
  validateOptions(options: Options) {
    // ...
  }
}
```

[Explain what the method does and any important implementation details]

### d. Implement send Method

When the Medusa application needs to send a notification, it calls the `send` method of the module provider.

[Continue with remaining methods...]
````

**Key rules:**
- Show only the new method being added in each sub-step's code block — use `// ...` to omit already-shown code
- Always add a transition sentence like "In the next sections, you'll implement the methods of the `XService` class." after introducing the scaffold
- Helper/private methods that support a required method can be nested as `####` sub-sub-steps under the parent method's `###` sub-step
- The final sub-step of a service step is always exporting the module definition (`### {letter}. Export Module Definition`)

## Test it Out Sections

Every major step (API routes, subscribers, admin UI, storefront) must end with a test section:

```mdx
### Test it Out

To test the [feature], send a request to the [endpoint]:

```bash
curl -X POST http://localhost:9000/store/products/{id}/reviews \
  -H "Content-Type: application/json" \
  --data-raw '{
    "rating": 5,
    "content": "Great product!"
  }'
```

If successful, you'll receive a response similar to:

```json
{
  "review": {
    "id": "review_123",
    "rating": 5,
    "content": "Great product!"
  }
}
```
```

For Admin UI steps, describe where to navigate and what to look for. For storefront steps, describe the user interaction.

## Next Steps, Troubleshooting, and Getting Help (Verbatim Template)

Use this structure exactly. Adjust the bullet points in `## Next Steps` to match the tutorial's topic.

`### Troubleshooting` and `### Getting Help` are subsections of `## Next Steps` — do not promote them to `##`.

````mdx
## Next Steps

You've now implemented [X] in Medusa. You can expand on this feature to add more features like:

- [Idea 1, e.g., Automated emails to customers when they reach a new tier.]
- [Idea 2, e.g., More complex rules based on product categories or collections.]
- [Idea 3, e.g., Other privileges, such as early access to new products or free shipping.]

If you're new to Medusa, check out the [main documentation](!docs!/learn) for a more in-depth understanding of the concepts you've used in this guide and more.

To learn more about the commerce features Medusa provides, check out [Commerce Modules](../../../commerce-modules/page.mdx).

### Troubleshooting

If you encounter issues during your development, check out the [troubleshooting guides](../../../troubleshooting/page.mdx).

### Getting Help

If you encounter issues not covered in the troubleshooting guides:

1. Visit the [Medusa GitHub repository](https://github.com/medusajs/medusa) to report issues or ask questions.
2. Join the [Medusa Discord community](https://discord.gg/medusajs) for real-time support from community members.
````
