# typedoc-frontmatter-plugin

A Typedoc plugin that allows inserting frontmatter key-value pairs at the top of the exported Markdown files.

## Configurations

The following options are optional and can be used to customize the configurations of the plugin.

### frontmatterData

`frontmatterData` is an object of key-value pairs. If none provided, no frontmatter variables will be added to the Markdown files.

An example of passing it in a JavaScript configuration file:

```js
frontmatterData: {
  displayed_sidebar: "jsClientSidebar",
},
```

If passing the option in the command line the value should be a JSON object.

### pagesPattern

`pagesPattern` is a string that contains a regular expression. This allows you to limit the pages the frontmatter variables should be added to.

By default, the frontmatter variables will be added to all files.

An example of passing it in a JavaScript configuration file:

```js
frontmatterData: {
  pagesPattern: "internal\\.",
},
```

## Building the Plugin

Before using any command that makes use of this plugin, make sure to run the `build` command:

```bash
yarn build
```
