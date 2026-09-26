# Book app (`docs.medusajs.com`)

The main documentation app: the docs homepage (`/`), the "Learn" guides
(`/learn`), and the get-started page (`/start`). It is also the app that hosts
the **What's New** section shown on the homepage for the whole docs site.

## What's New section — keep this updated

> **Whenever a new feature, release, or notable guide ships anywhere in the
> docs (this app, `resources`, `cloud`, `ui`, `user-guide`, or the API
> reference), add an entry to the What's New list.**

- **Data**: `components/Homepage/WhatsNewSection/data.ts` — the single static
  list. This is the only file to edit when announcing something.
- **UI**: `components/Homepage/WhatsNewSection/index.tsx` (server, sorts and
  slices) and `components/Homepage/WhatsNewSection/Row/index.tsx` (client,
  renders one row and owns the coming-soon modal). Neither needs a change when
  adding an entry.

Each entry is:

```ts
// shipped
{
  title: "Agentic deployments",     // short, sentence case, no trailing period
  date: "2026-09-12",               // ISO YYYY-MM-DD, the date it shipped
  link: "https://docs.medusajs.com/cloud/...", // docs page for the feature
  tag: "Medusa Cloud",              // area label shown as a pill
}

// coming soon
{
  title: "Medusa Search",
  tag: "Medusa Cloud",
  comingSoon: true,                 // no date, no link — the row is not clickable
}
```

The type is a union, so TypeScript enforces this: a `comingSoon: true` entry
cannot carry a `date` or `link`, and a shipped entry must have both.

Rules:

- **Coming-soon entries always render first**, followed by shipped entries
  **sorted by `date` descending**; the first `MAX_WHATS_NEW_ITEMS` (currently
  **4**) are shown. Add new entries anywhere in the array — order in the file
  only matters between two coming-soon entries.
- A coming-soon row is highlighted (`bg-medusa-bg-highlight`) and shows a
  `[SOON]` label where the date goes. Instead of linking, it opens a modal with
  the newsletter form so visitors can be notified when the feature ships.
- When a coming-soon feature ships, **convert the entry in place**: drop
  `comingSoon` and add its `date` and `link`.
- **Do not delete old entries** to make room; the slice handles it. Prune only
  when a linked page is removed.
- `link` must point at a real, already-published docs page. Use an absolute
  `https://docs.medusajs.com/...` URL for pages outside this app, and a relative
  path (e.g. `/learn/installation`) for pages inside it.
- `tag` should reuse an existing label where one fits — currently `Medusa Cloud`
  and `Guide`. Other reasonable labels: `Medusa OS`, `Admin`, `Storefront`.
- Keep `title` under ~48 characters so the row does not wrap on desktop.

## Homepage structure

`app/page.tsx` composes the homepage from the section components in
`components/Homepage/*`, with `<HomepageSectionsSeparator />` between sections.
Current order: Top → Start Prompt → Bloom → **What's New** → Links → Framework →
Code Tabs → Recipes → Commerce Modules → Footer.

Section conventions:

- Static content lives in a plain array/object at the top of the component (or a
  sibling `data.ts` when it is meant to be edited often, as with What's New).
- Style with `clsx` and the `medusa-*` Tailwind tokens
  (`text-medusa-fg-base`, `border-medusa-border-base`,
  `bg-medusa-tag-neutral-bg`, ...) — never raw hex or `rgb()` values. The token
  set is defined in `www/packages/tailwind/base.tailwind.config.js` and covers
  light and dark themes.
- Reuse `docs-ui` primitives (`HeadlineTags`, `ShadedBlock`, ...) instead of
  re-implementing them.
- Sections are server components; they are rendered inside a fixed
  `xl:max-w-[1026px]` column, so lay out with `w-full` plus fractional widths.

## Conventions

- No semicolons, double quotes, 2-space indent (Prettier).
- Components live in `components/<Name>/index.tsx`.
- Docs content is MDX under `app/learn/` and `app/start/`. Load the
  `writing-docs` skill before editing any MDX.
