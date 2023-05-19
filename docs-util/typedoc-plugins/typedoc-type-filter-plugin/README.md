# typedoc-type-filter-plugin

A typedoc plugin that allows filtering items in the outputed documentation based on reflection kind or a custom `@referenceType` property.

## Options

The following options allow you to define the filters for the generated documentation. One used together, a code block or statement can only satisfy one of these options to be considered as "allowed".

### referenceTypes

The `referenceTypes` option is an array of strings, each being the allowed item to include in the reference. The string should be the value of `@referenceType` in the comments of the code.

For example, you can add the following comment for a code block:

```ts
/**
 * @referenceType event
 */
static readonly Events = {
  //...
}
```

Then, in `typedoc.js` (or the typedoc configuration file you're using), pass the `referenceTypes` option with the value `event`:

```js
module.exports = {
  //...
  plugin: [
    // other plugins...
    "typedoc-type-filter-plugin"
  ],
  referenceTypes: [
    "event"
  ],
}
```

You can pass more than one value in the array. If a code block's comments satisfy any of the passed `referenceTypes` values, it will be considered as allowed to be exported in the documentation.

### reflectionKinds

The `reflectionKinds` option is an array of numbers or values of the ReflectionKind enum imported from the `typedoc` package. It allows you to filter outputted items in the documentation by their reflection kind.

For example, you can add the following value in your `typedoc.js` (or the typedoc configuration file you're using):

```js
const { ReflectionKind } = require("typedoc")

module.exports = {
  //...
  plugin: [
    // other plugins...
    "typedoc-type-filter-plugin"
  ],
  reflectionKinds: [
    ReflectionKind.Constructor
  ],
}
```

This would only document the constructor of a class.

## Build Plugin

Before you use the plugin, make sure to build it with the following command:

```bash
yarn build
```
