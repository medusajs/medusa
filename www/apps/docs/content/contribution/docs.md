---
sidebar_label: "Docs"
sidebar_position: 1
---

# Docs Contribution Guidelines

Thank you for your interest in contributing to the documentation! You will be helping the open source community and other developers interested in learning more about Medusa and using it.

:::tip

This guide is specific to contributing to the documentation. If you’re interested in contributing to Medusa’s codebase, check out the [contributing guidelines in the Medusa GitHub repository](https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md).

:::

## Documentation Workspace

Medusa's documentation projects are all part of the documentation yarn workspace, which you can find in the [medusa repository](https://github.com/medusajs/medusa/tree/v1.x) under the `www` directory.

The workspace has the following two directories:

:::note

This describes the structure under the [v1.x branch](https://github.com/medusajs/medusa/tree/v1.x) of the Medusa repository.

:::

- `apps`: this directory holds the different documentation websites and projects.
  - `docs`: includes the codebase for the main documentation website (the one you're viewing this documentation on). It's built with [Docusaurus](https://docusaurus.io/).
  - `api-reference`: includes the codebase for the API reference website. It's built with [Next.js 13](https://nextjs.org/).
  - `ui`: includes the codebase for the Medusa UI documentation website. It's built with [Next.js 13](https://nextjs.org/).
- `packages`: this directory holds the shared packages and components necessary for the development of the projects in the `apps` directory.
  - `docs-ui` includes the shared React components between the different apps.
  - `eslint-config-docs` includes the shared ESLint configuration between the different apps and packages.
  - `tailwind` includes the shared Tailwind CSS configuration between the different apps and packages.
  - `tsconfig` includes the shared TypeScript configuration between the different apps and packages.

---

## Documentation Content

### Main Documentation Website

The documentation content is written in Markdown format and is located in the [www/apps/docs/content](https://github.com/medusajs/medusa/tree/v1.x/www/apps/docs/content) directory of the `v1.x` branch of the Medusa repository. If you’re not familiar with Markdown, check out [this cheat sheet](https://www.markdownguide.org/cheat-sheet/) for a quick start.

You’ll also find MDX files. MDX files combine the power of Markdown with React. So, the content of the file can contain JSX components and import statements, among other features. You can learn more about [MDX in docusaurus’s guide.](https://docusaurus.io/docs/markdown-features/react).

:::note

Documentation pages under the `www/apps/docs/content/references` directory are generated automatically from the source code under the `packages` directory. So, you can't directly make changes to them. Instead, you'll have to make changes to the comments in the original source code.

:::

### API Reference

The API reference's content is split into two types:

1. Static content, which are the content related to getting started, expanding fields, and more. These are located in the [www/apps/api-reference/app/_mdx](https://github.com/medusajs/medusa/tree/v1.x/www/apps/api-reference/app/_mdx) directory. They are MDX files.
2. OpenAPI specs that are shown to developers when checking the reference of an API Route. These are automatically generated from comments on API Routes. So, if you find issues in them or want to make improvements, you have to find the API Routes under the [`packages/medusa/src/api`](https://github.com/medusajs/medusa/tree/develop/packages/medusa/src/api) directory and make changes to its comments.

### Medusa UI Documentation

The content of the Medusa UI documentation are located under the [www/apps/ui/src/content/docs](https://github.com/medusajs/medusa/tree/develop/www/apps/ui/src/content/docs) directory. They are MDX files.

The UI documentation also shows code examples, which you can find under the [www/apps/ui/src/examples](https://github.com/medusajs/medusa/tree/develop/www/apps/ui/src/examples) directory.

---

## Style Guide

When you contribute to the documentation content, make sure to follow the [documentation style guide](https://www.notion.so/Style-Guide-Docs-fad86dd1c5f84b48b145e959f36628e0).

---

## How to Contribute

If you’re fixing errors in an existing documentation page, you can scroll down to the end of the page and click on the “Edit this page” link. You’ll be redirected to the GitHub edit form of that page and you can make edits directly and submit a pull request (PR).

If you’re adding a new page or contributing to the codebase, you need to fork the repository, create a new branch, and make all changes necessary in your repository. Then, once you’re done,  create a PR in the Medusa repository.

### Base Branch

When you make an edit to an existing documentation page or fork the repository to make changes to the documentation, you have to create a new branch.

Documentation contributions to this documentation website always use `v1.x` as the base branch. Make sure to also open your PR against the `v1.x` branch.

### Branch Name

Make sure that the branch name starts with `docs/`. For example, `docs/fix-services`. Vercel deployed previews are only triggered for branches starting with `docs/`.

### Pull Request Conventions

When you create a pull request, prefix the title with `docs:` or `docs(PROJECT_NAME):`, where `PROJECT_NAME` is the name of the documentation project this pull request pertains to. For example, `docs(ui): fix titles`.

<!-- vale off -->

In the body of the PR, explain clearly what the PR does. If the PR solves an issue, use [closing keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) with the issue number. For example, “Closes #1333”.

<!-- vale on -->

---

## Main Documentation Sidebar

When you add a new page to the documentation, you must add the new page in `www/apps/docs/sidebars.js`. In this file, an object is exported. This object holds more than one sidebar. The properties of the object indicate the internal sidebar name, and the value is an array of sidebar items in that sidebar.

You can learn more about the syntax used [here](https://docusaurus.io/docs/sidebar/items).

### Terminology

When the documentation page is a conceptual or an overview documentation, the label in the sidebar should start with a noun.

When the documentation page is tutorial documentation, the label in the sidebar should start with a verb. Exceptions to this rule are integration documentation and upgrade guides.

### Sidebar Prefixes

How-to guides in the sidebar for documentation pages under the Commerce Modules section are typically prefixed with one of the following terms:

- `Backend: `: Used when the how-to guide explains how to do something on the Medusa backend.
- `Admin: `: Used when the how-to guide explains how to do something using the admin APIs.
- `Store: `: Used when the how-to guide explains how to do something using the store APIs.

### Sidebar Icon

To add an icon to the sidebar item, start by checking if the icon is already exported in the file `www/apps/docs/src/theme/Icon`. If not, you can either export the icon from the [@medusajs/icons](https://docs.medusajs.com/ui/icons/overview), or add the new icon as a React component in the `www/apps/docs/src/theme/Icon/Icon<Name>/index.tsx` file, where `<Name>` is the camel-case name of your icon. The icon must be added to the React component as an SVG element.

For example:
  
```tsx title="www/docs/src/theme/Icon/Bolt/index.tsx"
import React from "react"
import { IconProps } from "@medusajs/icons/dist/types"

export default function IconBolt(props: IconProps) {
  return (
    <svg 
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20" 
      fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path 
        d="M3.125..."
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        stroke="currentColor" />
    </svg>
  )
}
```

Make sure to set the `stroke` or `fill` of the icon to `currentColor` as shown in the example above. The source code for the Sidebar passes the icon a color. So, this ensures the color is correctly used.

If you added a new icon, add it in the exported object in the file `www/apps/docs/src/theme/Icon/index.ts`, where the property is the kebab-case version of the icon's name, and the value being the component you created. Make sure to add it in the correct alphabetical position as well. For example:

```ts title="www/docs/src/theme/Icon/index.ts"
import IconBolt from "./Bolt"
import IconBoltSolid from "./BoltSolid"
// other imports

export default {
  // other icons
  "bolt": IconBolt,
  "bolt-solid": IconBoltSolid,
  // other icons
}
```

Finally, you can add the icon to the sidebar item by adding a `sidebar_icon` property to the `customProps` property and setting its value to the kebab-cased version of the icon's name. For example:

```js title="www/docs/sidebars.js"
module.exports = {
  // other sidebars
  homepage: [
    {
      // other properties
      customProps: {
        sidebar_icon: "book-open",
      },
    },
    // other items
  ],
}
```

### Sidebar Item Types

There are different sidebar item types used in the documentation:

- Homepage Items: If a sidebar item is shown under the `homepage` sidebar, you should set the `className` property of the item to `homepage-sidebar-item`. You can use this with other sidebar item types. For example:
  
  ```js title="www/docs/sidebars.js"
  module.exports = {
    // other sidebars
    homepage: [
      {
        type: "doc",
        // other properties
        className: "homepage-sidebar-item",
      },
      // other items
    ],
  }
  ```

- Sidebar Title: This item is used as a title to the sidebar, typically added at the top of the sidebar. You typically would also use an icon with it. To use this item, add a `sidebar_is_title` property to the `customProps` object of the item with its value being `true`. For example:
  
  ```js title="www/docs/sidebars.js"
  module.exports = {
    // other sidebars
    modules: [
      // other items
      {
        type: "doc",
        id: "modules/overview",
        label: "Commerce Modules",
        customProps: {
          sidebar_is_title: true,
          sidebar_icon: "puzzle",
        },
      },
      // other items
    ],
  }
  ```

- Back Item: This item is used to show a back button, typically at the top of the sidebar. To use this item, add the `sidebar_is_back_link` property to the `customProps` object of the item, with its value set to true. Also, add the `sidebar_icon` property to the `customProps` object with its value set to `back-arrow`. For example:

  ```js title="www/docs/sidebars.js"
  module.exports = {
    // other sidebars
    core: [
      // other items
      {
        type: "ref",
        id: "homepage",
        label: "Back to home",
        customProps: {
          sidebar_is_back_link: true,
          sidebar_icon: "back-arrow",
        },
      },
      // other items
    ],
  }
  ```

- Group Divider Item: This item is used if a sidebar item does not link to any document and is only used to separate between sidebar sections. The item must be of type `html`, and its `value` property holds the text that should be shown in the divider. You must also add in the `customProps` object of the item the property `sidebar_is_group_divider` with its value being `true`. For example:
  
  ```js title="www/docs/sidebars.js"
  module.exports = {
    // other sidebars
    homepage: [
      // other items
      {
        type: "html",
        value: "Browse Docs",
        customProps: {
          sidebar_is_group_divider: true,
        },
        className: "homepage-sidebar-item",
      },
      // other items
    ],
  }
  ```

- Group Headline Item: This item is used if a sidebar item does not link to any document and is only used to indicate the beginning of a new section or group in the sidebar. To use this item, set the `type` of the item to `category`, and add the `sidebar_is_group_headline` property to the `customProps` object of the item, with its value set to `true`. For example:
  
  ```js title="www/docs/sidebars.js"
  module.exports = {
    // other sidebars
    modules: [
      // other items
      {
        type: "category",
        label: "Regions and Currencies",
        collapsible: false,
        customProps: {
          sidebar_is_group_headline: true,
        },
        items: [
          // items within group or section
        ],
      },
      // other items
    ],
  }
  ```

- Soon Item: This item is used to indicate that a certain guide will be added soon, but it does not actually link to any document. To use this item, set the `type` of the item to `link`, its `href` property to `#`, and add to the `customProps` object the property `sidebar_is_soon` with its value set to `true`. For example:
  
  ```js title="www/docs/sidebars.js"
  module.exports = {
    // other sidebars
    modules: [
      // other items
      {
        type: "link",
        href: "#",
        label: "Currencies",
        customProps: {
          sidebar_is_soon: true,
        },
      },
      // other items
    ],
  }
  ```

---

## Notes and Additional Information

:::note

This only works in the main documentation website.

:::

When displaying notes and additional information on a documentation page, use [Admonitions](https://docusaurus.io/docs/markdown-features/admonitions). Make sure the type of admonition used matches the note’s importance to the current document.

If the note is something developers have to be careful of doing or not doing, use the `danger` admonition based on how critical it is.

If the note displays helpful information and tips that may not be in the scope of the documentation page, use the `tip` admonition.

For all other note types, use the `note` admonition.

---

## Images

If you are adding images to a documentation page, you can host the image on [Imgur](https://imgur.com) for free to include it in the PR. Our team will later upload it to our image hosting.

---

## Code Blocks

:::note

These sections only works in the main documentation website.

:::

### Use Tabs with Code Blocks

To use Tabs with Code Blocks, you have to use [Docusaurus's `Tabs` and `TabItem` components](https://docusaurus.io/docs/markdown-features/code-blocks#multi-language-support-code-blocks).

You must also pass to the `Tabs` component the prop `isCodeTabs={true}` to ensure correct styling.

For example:

~~~md
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs groupId="request-type" isCodeTabs={true}>
  <TabItem value="client" label="Medusa JS Client" default>

    ```ts
    medusa.admin.uploads.create(file) // file is an instance of File
    .then(({ uploads }) => {
      const key = uploads[0].key
    })
    ```

  </TabItem>
  <TabItem value="curl" label="cURL">

    ```bash
    curl -L -X POST '<BACKEND_URL>/admin/uploads' \
      -H 'x-medusa-access-token: <API_TOKEN>' \
      -H 'Content-Type: text/csv' \
      -F 'files=@"<FILE_PATH_1>"'
    ```

  </TabItem>
</Tabs>
~~~

### Add Title to Code Block with Tabs

If you want to add a title to a code block with tabs, add the `codeTitle` prop to the `Tabs` component.

For example:

```md
<Tabs 
  groupId="request-type"
  isCodeTabs={true}
  codeTitle="/src/services/hello.ts">
```

### Add Title to Code Block without Tabs

To add a title to a code block without tabs:

~~~md
```js title="src/index.ts"
console.log("hello")
```
~~~

### Remove Report Button

Some code block don't need a report button. To remove the report button, use the `noReport` metadata.

For example:

~~~md
```bash noReport
medusa new my-medusa-store
```
~~~

### Remove Copy Button

Some code blocks don't need a copy button. To remove the copy button, use the `noCopy` metadata:

For example:

~~~md
```bash noCopy
medusa new my-medusa-store
```
~~~

---

## NPM and Yarn Code Blocks

If you’re adding code blocks that use NPM and Yarn, you must use the [npm2yarn syntax](https://docusaurus.io/docs/markdown-features/code-blocks#npm2yarn-remark-plugin).

For example:

~~~md
```bash npm2yarn
npm run start
```
~~~

The code snippet must be written using NPM, and the `npm2yarn` plugin will automatically transform it to Yarn.

### Global Option

When a command uses the global option `-g`, add it at the end of the NPM command to ensure that it’s transformed to a Yarn command properly. For example:

```bash npm2yarn
npm install @medusajs/medusa-cli -g
```

---

## Linting with Vale

Medusa uses [Vale](https://vale.sh/) to lint documentation pages and perform checks on incoming PRs into the repository.

### Result of Vale PR Checks

You can check the result of running the "lint" action on your PR by clicking the Details link next to it. You can find there all errors that you need to fix.

### Run Vale Locally

If you want to check your work locally, you can do that by:

1. [Installing Vale](https://vale.sh/docs/vale-cli/installation/) on your machine.
2. Changing to the `www/vale` directory:

```bash
cd www/vale
```

3\. Running the `run-vale` script:

```bash
# to lint content for the main documentation
./run-vale.sh docs content error references
# to lint content for the API reference
./run-vale.sh api-reference app/_mdx error
# to lint content for the Medusa UI documentation
./run-vale.sh ui src/content/docs error
```

### VS Code Extension

To facilitate writing documentation, you can optionally use the [Vale VS Code extension](https://github.com/errata-ai/vale-vscode). This will show you any errors in your documentation while writing it.

### Linter Exceptions

If it's needed to break some style guide rules in a document, you can wrap the parts that the linter shouldn't scan with the following comments in the `md` or `mdx` files:

```md
<!-- vale off -->

content that shouldn't be scanned for errors here...

<!-- vale on -->
```

You can also disable specific rules. For example:

```md
<!-- vale docs.Numbers = NO -->

Medusa supports Node versions 14 and 16.

<!-- vale docs.Numbers = YES -->
```

If you use this in your PR, you must justify its usage.

---

## Linting with ESLint

Medusa uses ESlint to lint code blocks both in the content and the code base of the documentation apps.

### Linting Content with ESLint

Each PR runs through a check that lints the code in the content files using ESLint. The action's name is `content-eslint`.

If you want to check content ESLint errors locally and fix them, you can do that by:

1\. Install the dependencies in the `www` directory:

```bash
yarn install
```

2\. Run the turbo command in the `www` directory:

```bash
turbo run lint:content
```

This will fix any fixable errors, and show errors that require your action.

### Linting Code with ESLint

Each PR runs through a check that lints the code in the content files using ESLint. The action's name is `code-docs-eslint`.

If you want to check code ESLint errors locally and fix them, you can do that by:

1\. Install the dependencies in the `www` directory:

```bash
yarn install
```

2\. Run the turbo command in the `www` directory:

```bash
turbo run lint
```

This will fix any fixable errors, and show errors that require your action.

### ESLint Exceptions

:::note

These exceptions only work in the main documentation website.

:::

If some code blocks have errors that can't or shouldn't be fixed, you can add the following command before the code block:

~~~md
<!-- eslint-skip -->

```js
console.log("This block isn't linted")
```

```js
console.log("This block is linted")
```
~~~

You can also disable specific rules. For example:

~~~md
<!-- eslint-disable semi -->

```js
console.log("This block can use semicolons");
```

```js
console.log("This block can't use semi colons")
```
~~~

---

## Need Additional Help

If you need any additional help while contributing, you can join Medusa's [Discord server](https://discord.gg/medusajs) and ask Medusa’s core team as well as the community any questions.
