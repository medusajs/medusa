# @medusajs/ui-preset

Tailwind CSS v3 and v4 preset that carries Medusa's design tokens (colors, effects, typography, component tokens) as CSS variables and `ui-*` theme extensions. `@medusajs/ui`, the Medusa Admin, and admin extensions depend on it.

## Using this package

- Inside Medusa Admin extensions, nothing to do: `@medusajs/admin-bundler` imports `@medusajs/ui-preset/theme.css` into the admin's Tailwind 4 build.
- In a standalone app on Tailwind v4, import the CSS-first theme (class-based dark mode on `.dark` or `[data-mode="dark"]`):

```css
@import "tailwindcss";
@import "@medusajs/ui-preset/theme.css";
@source "../node_modules/@medusajs/ui/dist";
```

- In a standalone app on Tailwind v3 (peer dep `tailwindcss ^3.4.3 || ^4.0.0`), use the JavaScript preset:

```js
// tailwind.config.js
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
}
```

What the preset adds:
- Semantic color utilities under `ui-` (`bg-ui-bg-base`, `text-ui-fg-muted`, `border-ui-border-strong`, `bg-ui-tag-green-bg`, ...), backed by CSS variables such as `--bg-base`.
- Typography component classes (`txt-compact-small-plus`, `h1-core`, ...).
- Shadows / effects, `transition-fg`, accordion keyframes, and `tailwindcss-animate` (`tw-animate-css` in `theme.css`).
- `rounded-xs`, `button { cursor: pointer }`, and, on v3 only, an `outline-hidden` utility, so `@medusajs/ui` class names mean the same in v3 and v4.
- Fonts `Inter` / `Roboto Mono` (font files are not bundled).

Docs: https://docs.medusajs.com/ui/installation/standalone-project.md

## Architecture

- `src/index.ts` sets `module.exports = preset`, so consumers `require()` it directly.
- `src/preset.ts`: `{ content: [], plugins: [plugin, tailwindcss-animate] }`.
- `src/plugin.ts` (hand-written):
  - Injects the light tokens on `:root`.
  - Injects the dark tokens either on the dark class (`darkMode: "class"` or `["class", selector]`) or under `prefers-color-scheme: dark` (default `media`).
  - Extends the theme from `src/theme/extension/theme.ts`.
- `src/constants.ts` (hand-written): font stacks, keyframes, animations, `transition-fg`, and the radius additions shared by both presets.
- `src/theme-css.ts` (hand-written): `generateThemeCSS()` builds the v4 `theme.css` from the same tokens. `tsup.config.ts` writes it to `dist/theme.css` after each build, exported as `@medusajs/ui-preset/theme.css`.
- `src/theme/**` (generated):
  - `tokens/colors.ts`, `tokens/effects.ts`, `tokens/typography.ts`, `tokens/components.ts`, `extension/theme.ts`
  - Produced from Figma by `@medusajs/toolbox`.

## Development

```bash
yarn build      # tsup, then writes dist/theme.css
yarn generate   # toolbox tokens -o ./src/theme (needs FIGMA_TOKEN)
```

## Gotchas

- Do not hand-edit `src/theme/**`; `yarn generate` overwrites it.
  - Token changes come from the Medusa Figma file and need a `FIGMA_TOKEN` with access to the Medusa Figma organization. External contributors should open an issue.
  - Build `@medusajs/toolbox` first so its `toolbox` bin exists.
- With `darkMode: "class"`, only `colors.dark` and `effects.dark` are applied under the dark selector. `components.dark` is only added in the default `media` branch.
- `plugin.ts` must only use plugin APIs that both Tailwind 3 and 4 run (`addBase`, `addComponents`, `addUtilities`, `theme.extend`, `config()`). It detects v3 by the `corePlugins` API, which v4 doesn't pass.
- Unlike the JS preset, `theme.css` always applies `components.dark` under the dark selectors.
- `packages/design-system/ui/tailwind-compat` compiles `@medusajs/ui`'s classes with both presets in v3 and v4; run `yarn test tailwind-compat` there after changing either preset.
- Renaming or removing a token breaks class names used across `@medusajs/ui`, the dashboard, and third-party admin extensions.
