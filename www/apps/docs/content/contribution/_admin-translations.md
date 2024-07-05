---
sidebar_label: "Admin Translation"
sidebar_position: 2
---

# Contribute by Translating Admin

In this document, you'll learn how you can contribute to Medusa by translating the Medusa Admin.

## Overview

The Medusa Admin supports multiple languages, with the default being English. To ensure a wide support for different languages, your contribution by translating to other languages you're fluent in is highly appreciated.

This type of contribution is a no-code contribution, meaning you don't need advanced technical skills to contribute.

---

## How to Contribute Translation

1\. Clone the [Medusa monorepository](https://github.com/medusajs/medusa) to your local machine:

```bash
git clone https://github.com/medusajs/medusa.git
```

If you already have it cloned, make sure to pull the latest changes from the `v1.x` branch.

2\. Create a branch that will be used to open the pull request later:

```bash
git checkout -b feat/translate-<LANGUAGE>
```

Where `<LANGUAGE>` is your language name. For example, `feat/translate-da`.

3\. Create a new directory under `packages/admin-ui/ui/public/locales` with its name being the [ISO 2 character code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of your language. For example, `da`. In the new directory, create the file `translation.json`.

4\. Copy the content of the English translation file located at `packages/admin-ui/ui/public/locales/en/translation.json` and paste it in your new `translation.json` file.

5\. In the file, leave the key names as-is, and only translate the values.

6\. Next, you need to add the new language into the multi-language configurations. To do that, go to the file `packages/admin-ui/ui/src/i18n/index.ts`.

7\. In `packages/admin-ui/ui/src/i18n/index.ts`, add the new language to the `supportedLanguages` array as an object. The object accepts two properties: `locale` for the ISO 2 character code, and `name` for the name of the language. The name of the language should be the translated name, not the English name. For example:

```ts title="packages/admin-ui/ui/src/i18n/index.ts"
export const supportedLanguages = [
  // other languages...
  {
    locale: "da",
    name: "Dansk",
  },
]
```

8\. Once you're done, push the changes into your branch and open a pull request on GitHub.
