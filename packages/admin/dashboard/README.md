# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Translations

Translation files live in `src/i18n/translations`. `en.json` is the source of truth, and every other `<locale>.json` file is translated from it.

### Find missing translations

```bash
yarn i18n:sync missing
```

Prints the number of strings in `en.json` that each locale is missing. Plural keys are expanded to the plural forms each locale uses, as defined in `src/i18n/plural-config.json`.

Pass `--output` to also write the missing strings to a JSON file:

```bash
yarn i18n:sync missing --output missing.json
```

The file is keyed by locale. Each entry has the number of missing strings (`count`), the locale's plural forms (`pluralForms`), and the missing keys nested as in `en.json` with their English text as values (`missing`).

### Apply translations

```bash
yarn i18n:sync apply --input <directory>
```

Merges translated strings into the locale files. The directory must contain JSON files named `<locale>.json`, or `<locale>.<anything>.json` to split a locale across several files (for example, `de.part-1.json`). Each file uses the same nested shape as `missing` in the `missing` output, with translated values.

New keys are inserted next to their neighbors in `en.json`, and existing keys keep their order. A translation is skipped with a warning if:

- Its key doesn't exist in `en.json`, or is a plural form the locale doesn't use.
- The locale already has a translation for the key. Existing translations are never overwritten.
- It's empty or not a string.
- Its `{{placeholders}}` or `<0>` tags don't match the English text. Plural forms may add or drop `{{count}}`.

### Automated sync

The [Admin i18n Sync](../../../.github/workflows/admin-i18n-sync.yml) workflow runs daily. It finds missing translations, translates them with Claude, and opens a PR on the `chore/admin-i18n-sync-translations` branch. It skips runs while a previous sync PR is still open.
