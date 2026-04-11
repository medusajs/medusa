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

---

## Step 1: Install a Medusa Application
[pre-written template — see below]

## Step 2: ...
...

## Next Steps

### Troubleshooting

### Getting Help
```

Note: `## Troubleshooting` and `## Getting Help` are **subsections** (`###`) under `## Next Steps`, not top-level sections.

## Pre-Written Step 1 Template (Always Use Verbatim)

Copy this exactly — do not rewrite it:

````mdx
## Step 1: Install a Medusa Application

<Prerequisites items={[
  {
    text: "Node.js v20+",
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

Start by installing the Medusa application on your machine with the following command:

```bash npx2yarnExec
npx create-medusa-app@latest
```

You'll first be asked for the project's name. Then, when asked whether you want to install the [Next.js Starter Storefront](../../../nextjs-starter/page.mdx), choose Yes.

Afterward, the installation process will start, which will install the Medusa application in a directory with your project's name, and the Next.js Starter Storefront in a separate directory with the `{project-name}-storefront` name.

<Note title="Why is the storefront installed separately">

The Medusa application is composed of a headless Node.js server and an admin dashboard. The storefront is installed or custom-built separately and connects to the Medusa application through its REST endpoints, called [API routes](!docs!/learn/fundamentals/api-routes). Learn more in [Medusa's Architecture documentation](!docs!/learn/introduction/architecture).

</Note>

Once the installation finishes successfully, the Medusa Admin dashboard will open with a form to create a new user. Enter the user's credentials and submit the form. Afterward, you can log in with the new user and explore the dashboard.

<Note title="Ran into Errors">

Check out the [troubleshooting guides](../../../troubleshooting/create-medusa-app-errors/page.mdx) for help.

</Note>

---
````

For integration guides where a storefront may not be needed, omit the storefront-related sentences and the "Why is the storefront installed separately" note.

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

- Install and set up Medusa.
- [Main feature: e.g., Define product review models and implement their management features in the Medusa server.]
- [Admin: e.g., Customize the Medusa Admin to allow merchants to view and manage product reviews.]
- [Storefront: e.g., Customize the Next.js Starter Storefront to display and submit product reviews.]
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
Use only at Step 1:
```mdx
<Prerequisites items={[
  { text: "Node.js v20+", link: "https://nodejs.org/en/download" },
  { text: "Git CLI tool", link: "https://git-scm.com/downloads" },
  { text: "PostgreSQL", link: "https://www.postgresql.org/download/" }
]} />
```

Add extra prerequisites for integration guides (e.g., third-party account, API key).

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
npx create-medusa-app@latest
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
