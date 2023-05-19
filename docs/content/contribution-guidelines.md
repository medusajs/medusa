# Contribution Guidelines

Thank you for your interest in contributing to the documentation! You will be helping the open source community and other developers interested in learning more about Medusa and using it.

:::tip

This guide is specific to contributing to the documentation. If you’re interested in contributing to Medusa’s codebase, check out the [contributing guidelines in the Medusa GitHub repository](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md).

:::

## Site Setup

The documentation website is built with [Docusaurus](https://docusaurus.io/), a framework that optimizes documentation creation. If you’re not familiar with Docusaurus, it’s recommended to check out the [Installation documentation](https://docusaurus.io/docs/installation) on their website. This will help you better understand Docusaurus, how it works, its structure, and more details.

The documentation codebase is hosted as part of the [medusa repository](https://github.com/medusajs/medusa) on GitHub. You’ll find the code that runs the Docusaurus website under the [www/docs](https://github.com/medusajs/medusa/tree/master/www/docs) directory.

---

## Documentation Content

The documentation content is written in Markdown format and is located in the [docs/content](https://github.com/medusajs/medusa/tree/master/docs/content) directory of the same repository. If you’re not familiar with Markdown, check out [this cheat sheet](https://www.markdownguide.org/cheat-sheet/) for a quick start.

You’ll also find MDX files. MDX files combine the power of Markdown with React. So, the content of the file can contain JSX components and import statements, among other features. You can learn more about [MDX in docusaurus’s guide.](https://docusaurus.io/docs/markdown-features/react)

---

## What You Can Contribute To

- You can contribute to the Docusaurus codebase to add a new feature or fix a bug in the documentation website.
- You can contribute to the documentation content either by fixing errors you find or by adding documentation pages.

---

## What You Can’t Contribute To

- All references under the `docs/content/reference` directory are automatically generated using Typedoc. So, you can’t contribute to it by making changes to its markdown files.
- The API reference is generated from OpenApi Spec (OAS) comments added on endpoints in the core Medusa package. So, you can't contribute to it by making changes to files under `docs/api`. You can, however, contribute by making changes to the endpoint's comments. Endpoints are located under the `packages/medusa/src/api` directory.

---

## Style Guide

When you contribute to the documentation content, make sure to follow the [documentation style guide](https://www.notion.so/Style-Guide-Docs-fad86dd1c5f84b48b145e959f36628e0).

---

## How to Contribute

If you’re fixing errors in an existing documentation page, you can scroll down to the end of the page and click on the “Edit this page” link. You’ll be redirected to the GitHub edit form of that page and you can make edits directly and submit a pull request (PR).

If you’re adding a new page or contributing to the codebase, you need to fork the repository, create a new branch, and make all changes necessary in your repository. Then, once you’re done,  create a PR in the Medusa repository.

For more details on how to contribute, check out [the contribution guidelines in the Medusa repository](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md).

### Base Branch

When you make an edit to an existing documentation page or fork the repository to make changes to the documentation, you have to create a new branch.

Documentation contributions always use `develop` as the base branch. Make sure to also open your PR against the `develop` branch.

### Branch Name

Make sure that the branch name starts with `docs/`. For example, `docs/fix-services`.

### Pull Request Conventions

When you create a pull request, prefix the title with “docs:”. Make sure to keep “docs” in small letters.

<!-- vale off -->

In the body of the PR, explain clearly what the PR does. If the PR solves an issue, use [closing keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) with the issue number. For example, “Closes #1333”.

<!-- vale on -->

---

## Sidebar

When you add a new page to the documentation, you must add the new page in `www/docs/sidebars.js`. In this file, an object is exported. This object holds more than one sidebar. The properties of the object indicate the internal sidebar name, and the value is an array of sidebar items in that sidebar.

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

To add an icon to the sidebar item, start by checking if the icon already exists under `www/docs/src/theme/Icon`. If not, add the item as a React component under `www/docs/src/theme/Icon/Icon<Name>/index.tsx`, where `<Name>` is the camel-case name of your icon. The icon must be added to the React component as an SVG element. For example:
  
```tsx title=www/docs/src/theme/Icon/Bolt/index.tsx
import React from "react"

export default function IconBolt(props) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" 
      fill="none" xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path 
        d="M3.125..."
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        stroke="var(--ifm-icon-color)" />
    </svg>
  )
}
```

Make sure to set the `stroke` or `fill` of the icon to `var(--ifm-icon-color)` as shown in the example above.

If you added a new icon, add it in the object in the file `www/docs/src/theme/Icon/index.ts`, where the property is the kebab-case version of the icon's name, and the value being the component you created. Make sure to add it in the correct alphabetical position as well. For example:

```ts title=www/docs/src/theme/Icon/index.ts
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

```js title=www/docs/sidebars.js
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
  
  ```js title=www/docs/sidebars.js
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
  
  ```js title=www/docs/sidebars.js
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

  ```js title=www/docs/sidebars.js
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
  
  ```js title=www/docs/sidebars.js
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
  
  ```js title=www/docs/sidebars.js
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
  
  ```js title=www/docs/sidebars.js
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

When displaying notes and additional information on a documentation page, use [Admonitions](https://docusaurus.io/docs/markdown-features/admonitions). Make sure the type of admonition used matches the note’s importance to the current document.

If the note is something developers have to be careful of doing or not doing, use the `danger` admonition based on how critical it is.

If the note displays helpful information and tips that may not be in the scope of the documentation page, use the `tip` admonition.

For all other note types, use the `note` admonition.

---

## Images

If you are adding images to a documentation page, you can host the image on [Imgur](https://imgur.com) for free.

---

## Code Blocks

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
  -H 'Authorization: Bearer <API_TOKEN>' \
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
```js title=src/index.ts
console.log("hello")
```
~~~

### Remove Report Button

Some code block don't need a report button. To remove the report button, use the `noReport` metadata.

For example:

~~~md
```bash noReport
medusa new my-medusa-store --seed
```
~~~

### Remove Copy Button

Some code blocks don't need a copy button. To remove the copy button, use the `noCopy` metadata:

For example:

~~~md
```bash noCopy
medusa new my-medusa-store --seed
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

### Expand Commands

<!-- vale off -->

Don't use commands in their abbreviated terms. For example, instead of `npm i` use `npm install`.

<!-- vale on -->

### Run Command

Make sure to always use the `run` command when the command runs a script.

<!-- vale off -->

For example, even though you can run the `start` script using NPM with `npm start`, to make sure it’s transformed properly to a Yarn command, you must add the `run` keyword before `start`.

<!-- vale on -->

### Global Option

When a command uses the global option `-g`, add it at the end of the NPM command to ensure that it’s transformed to a Yarn command properly. For example:

```bash npm2yarn
npm install @medusajs/medusa-cli -g
```

---

## Linting with Vale

Medusa uses Vale to lint documentation pages and perform checks on incoming PRs into the repository.

### Result of Vale PR Checks

You can check the result of running the "lint" action on your PR by clicking the Details link next to it. You can find there all errors that you need to fix.

### Run Vale Locally

If you want to check your work locally, you can do that by:

1. [Installing Vale](https://vale.sh/docs/vale-cli/installation/) on your machine.
2. Changing to the `docs` directory:

```bash
cd docs
```

3\. Running the `run-vale` script:

```bash
./run-vale.sh error
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

Medusa uses ESlint to lint code blocks in the documentation and perform checks on incoming PRs into the repository.

### Result of ESLint PR Checks

You can check the result of running the "eslint" action on your PR by clicking the Details link next to it. You can find there all errors that you need to fix.

### Running ESLint locally

If you want to check ESLint errors locally and fix them, you can do that by:

1. Installing the dependencies in the root directory:

```bash
yarn install
```

2\. Run the lint command:

```bash
yarn lint:docs --fix
```

The `--fix` option automatically fixes some errors. Other errors will be shown which you'll have to resolve yourself.

### ESLint Exceptions

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
