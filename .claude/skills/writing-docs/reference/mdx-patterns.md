# MDX Patterns

Exact syntax used across `book`, `resources`, `ui`, and `user-guide` projects.

## Page Metadata

Every MDX page exports a `metadata` object as the first line:

```mdx
export const metadata = {
  title: `Page Title`,
}

# {metadata.title}
```

In the `book` project, titles use the auto-generated `${pageNumber}` variable — always keep it:

```mdx
export const metadata = {
  title: `${pageNumber} Workflows`,
}

# {metadata.title}
```

> **CRITICAL:** Never remove `${pageNumber}` from book titles. It is injected by the prep script.

Pages whose content is dynamically injected, such as from a React component, must have the `generate_toc` frontmatter enabled to generate their table of content items.

```mdx
---
generate_toc: true
---

import Content from "./content"

export const metadata = {
  title: `Product Module`,
}

<Content />
```

## Code Blocks

### Basic code block

~~~mdx
```ts title="src/workflows/my-workflow.ts"
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
// ...
```
~~~

### Code block with highlights

Highlights draw attention to specific lines. Define them before the code block:

~~~mdx
export const highlights = [
  ["3", "greetingJob", "The function executed at the scheduled interval."],
  ["4", "container", "Receive the Medusa container as a parameter."],
  ["10", "name", "A unique name for the job."],
]

​```ts title="src/jobs/hello-world.ts" highlights={highlights}
import { MedusaContainer } from "@medusajs/framework/types"

export default async function greetingJob(container: MedusaContainer) {
  const logger = container.resolve("logger")
  logger.info("Greeting!")
}

export const config = {
  name: "greeting-every-minute",
  schedule: "* * * * *",
}
​```
~~~

The highlights array entries are `[lineNumber, variableName, explanation]`.

### Multi-language tabs

Use `<CodeTabs>` and `<CodeTab>` for npm/yarn/pnpm examples:

~~~mdx
import { CodeTabs, CodeTab } from "docs-ui"

<CodeTabs group="npm2yarn">
  <CodeTab label="npm" value="npm">

  ```bash
  npm run dev
  ```

  </CodeTab>
  <CodeTab label="yarn" value="yarn">

  ```bash
  yarn dev
  ```

  </CodeTab>
</CodeTabs>
~~~

For bash commands that have npm/yarn equivalents, use the shorthand:

~~~mdx
```bash npm2yarn
npm run dev
```
~~~

## Note Components

```mdx
<Note>

General informational note.

</Note>

<Note title="Tip">

A helpful tip or shortcut.

</Note>

<Note title="Warning" type="warning">

Something to be careful about.

</Note>

<Note title="Don't use this if" type="error">

- A condition where this approach is wrong
- Another condition

</Note>
```

## Version Notes

When documenting a new option, method, parameter, or behavior change, add a version note so readers know when it became available.

**Get the current version** from `www/packages/docs-ui/src/global-config.ts` → `version.number`. The next version is the patch increment (e.g. `2.13.5` → `2.13.6`). Use the next version when the change is being introduced now (i.e. not yet released).

**Release URL pattern:** `https://github.com/medusajs/medusa/releases/tag/v{version}`

### New option/method/parameter — `<Note>` block

Place immediately after the heading for the new item:

```mdx
### myNewOption

<Note>

This option is available since Medusa [v2.13.6](https://github.com/medusajs/medusa/releases/tag/v2.13.6).

</Note>

Description of the option...
```

### Changed behavior — "Before Medusa v..." inside `<Note>`

Use when existing behavior changed and users may have old code:

```mdx
<Note>

Before [Medusa v2.13.6](https://github.com/medusajs/medusa/releases/tag/v2.13.6), you did X. Now, you must do Y instead.

</Note>
```

### Table cell — inline version annotation

For new or deprecated entries in `<Table>` components, annotate inside the cell:

```mdx
<Table.Cell>

`myOption` (v2.13.6+)

</Table.Cell>
```

For deprecated entries:

```mdx
<Table.Cell>

`oldOption` (Deprecated v2.13.6+, use `newOption` instead)

</Table.Cell>
```

## Prerequisites Component

Use at the top of pages that require existing knowledge or setup:

```mdx
import { Prerequisites } from "docs-ui"

<Prerequisites
  items={[
    {
      text: "Medusa application set up",
      link: "!docs!/learn/installation",
    },
    {
      text: "pnpm installed",
      link: "https://pnpm.io/installation",
    },
  ]}
/>
```

## Cross-Project Links

Never use absolute URLs for cross-project links. Use the special link syntax:

```mdx
[text](!docs!/learn/fundamentals/workflows)    → book
[text](!resources!/commerce-modules/product)   → resources
[text](!user-guide!/products)                  → user-guide
```

Internal links within the same project use relative paths:

```mdx
[text](./other-page/page.mdx)
[text](../sibling/page.mdx)
```

## Section Dividers

Use `---` to separate major sections:

```mdx
## First Section

Content here.

---

## Second Section

Content here.
```

## Imports

Import components at the top of the file, after frontmatter and before metadata export:

```mdx
---
generate_toc: true
---

import { Prerequisites } from "docs-ui"
import { CodeTabs, CodeTab } from "docs-ui"

export const metadata = {
  title: `My Page`,
}
```

## Images

Use standard markdown image syntax with a Cloudinary URL for user-guide screenshots:

```mdx
![Alt text describing the screenshot](https://res.cloudinary.com/dza7lstvk/image/upload/...)
```

If you don't have the URL, leave a placeholder comment:

```mdx
<!-- TODO: add screenshot of <description> -->
```

Never invent a Cloudinary URL.

## Keyboard Shortcuts

### Keys to press — `Kbd` component

Wrap any key name the user must press in the `Kbd` component from `docs-ui`:

```mdx
import { Kbd } from "docs-ui"

Press <Kbd>Enter</Kbd> to confirm, or <Kbd>Escape</Kbd> to cancel.
```

### OS-dependent shortcuts (CMD vs CTRL) — `getOsShortcut`

When a shortcut differs between macOS (⌘ Cmd) and Windows/Linux (Ctrl), use the `getOsShortcut` utility from `docs-ui` so the correct key is shown automatically based on the user's OS:

```mdx
import { Kbd, getOsShortcut } from "docs-ui"

Press <Kbd>{getOsShortcut()}</Kbd>+<Kbd>S</Kbd> to save.
```

`getOsShortcut()` returns `"Cmd"` on macOS and `"Ctrl"` on other platforms.

> **Rule:** Never hard-code `Cmd` or `Ctrl` alone. If the shortcut uses the primary modifier key, always use `getOsShortcut()` so both platforms are covered.