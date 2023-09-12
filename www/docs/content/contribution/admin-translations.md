---
sidebar_label: "Admin Translation"
sidebar_position: 2
---

# Contribute by Translating Admin

In this document, you'll learn how you can contribute to Medusa by translating the Medusa admin.

## Overview

The Medusa admin supports multiple languages, with the default being English. To ensure a wide support for different languages, your contribution by translating to other languages you're fluent in is highly appreciated.

This type of contribution is a no-code contribution, meaning you don't need advanced technical skills to contribute.

---

## Method 1: Cloning the Monorepository

:::note

If you would like an easier, less technical method, try [method 2](#method-2-using-github).

:::

1\. Clone the [Medusa monorepository](https://github.com/medusajs/medusa) to your local machine:

```bash
git clone https://github.com/medusajs/medusa.git
```

If you already have it cloned, make sure to pull the latest changes from the `develop` branch.

2\. Create a branch that will be used to open the pull request later:

```bash
git check -b feat/translate-<LANGUAGE>
```

Where `<LANGUAGE>` is your language name. For example, `feat/translate-ar`.

3\. Create a new directory under `packages/admin-ui/ui/public/locales` with its name being the [ISO 2 character code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of your language. For example, `ar`. In the new directory, create the file `translation.json`.

4\. Copy the content of the English translation file located at `packages/admin-ui/ui/public/locales/en/translation.json` and paste it in your new `translation.json` file.

5\. In the file, leave the key names as-is, and only translate the values.

6\. Once you're done, push the changes into your branch and open a pull request on GitHub.

---

## Method 2: Using GitHub

This method is useful if you're non-technical as you only need to use GitHub's interface.

1. Go to the [English translations file](https://github.com/medusajs/medusa/blob/develop/packages/admin-ui/ui/public/locales/en/translation.json) and copy its content.
2. Go to the [locales directory](https://github.com/medusajs/medusa/blob/develop/packages/admin-ui/ui/public/locales).
3. Click on Add file, then choose Create new file from the dropdown.
4. In the new page that opens, for the "Name your file" field, enter `<LANGUAGE>/translation.json`, where `<LANGUAGE>` is the [ISO 2 character code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) of your language. For example, `ar/translation.json`.
5. Paste the content you copied from the English translation file.
6. You can now translate the file. Notice that each translation entry is made up of a key-value pair. You should only translate the text in the value.
7. Once you're done, click on the "Commit changes..." button.
8. Follow the next steps to open a pull request with your contribution.
