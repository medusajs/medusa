/* eslint-disable @typescript-eslint/no-var-requires */
// const typedocConfig = require("typedoc/typedoc.json")

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  // extends: [typedocConfig],
  plugin: ["typedoc-plugin-markdown-medusa"],
  readme: "none",
  excludeTags: "@privateRemark",
  // Uncomment this when debugging
  // showConfig: true,
}
