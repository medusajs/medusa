# typedoc-plugin-custom

A Typedoc plugin that combines utility plugins for documenting references.

## Configurations

### Resolve Reference Configurations

The [`resolve-reference-plugin`](./src/resolve-references-plugin.ts) imitates the [`typedoc-plugin-missing-exports`](https://www.npmjs.com/package/typedoc-plugin-missing-exports) plugin. So, it accepts the same options as the [`typedoc-plugin-missing-exports`](https://www.npmjs.com/package/typedoc-plugin-missing-exports) plugin.

### Frontmatter Plugin

`frontmatterData` is an object of key-value pairs. If none provided, no frontmatter variables will be added to the Markdown files.

An example of passing it in a JavaScript configuration file:

```js
frontmatterData: {
  displayed_sidebar: "jsClientSidebar",
},
```

## Build the Plugin

Before using any command that makes use of this plugin, make sure to run the `build` command:

```bash
yarn build
```
