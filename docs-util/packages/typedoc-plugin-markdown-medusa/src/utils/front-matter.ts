import * as Handlebars from "handlebars"
import { PageEvent } from "typedoc/dist/lib/output/events"

export interface FrontMatterVars {
  [key: string]: string | number | boolean
}

/**
 * Prepends YAML block to a string
 * @param contents - the string to prepend
 * @param vars - object of required front matter variables
 */
export const prependYAML = (contents: string, vars: FrontMatterVars) => {
  return contents
    .replace(/^/, toYAML(vars) + "\n\n")
    .replace(/[\r\n]{3,}/g, "\n\n")
}

/**
 * Returns the page title as rendered in the document h1(# title)
 * @param page
 */
export const getPageTitle = (page: PageEvent) => {
  return Handlebars.helpers.reflectionTitle.call(page, false)
}

/**
 * Converts YAML object to a YAML string
 * @param vars
 */
const toYAML = (vars: FrontMatterVars) => {
  const yaml = `---
${Object.entries(vars)
  .map(
    ([key, value]) =>
      `${key}: ${
        typeof value === "string" ? `"${escapeString(value)}"` : value
      }`
  )
  .join("\n")}
---`
  return yaml
}

// prettier-ignore
const escapeString = (str: string) => str.replace(/"/g, "\\\"")
