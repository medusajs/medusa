import camelCase from "camelcase"
import pascalCase from "pascalcase"
import Handlebars from "handlebars/runtime"
import { EOL } from "os"

import type { Enum } from "../client/interfaces/Enum"
import type { Model } from "../client/interfaces/Model"
import type { HttpClient } from "../HttpClient"
import { unique } from "./unique"

export const registerHandlebarHelpers = (root: {
  httpClient: HttpClient
  useOptions: boolean
  useUnionTypes: boolean
}): void => {
  Handlebars.registerHelper("ifdef", function (this: any, ...args): string {
    const options = args.pop()
    if (!args.every((value) => !value)) {
      return options.fn(this)
    }
    return options.inverse(this)
  })

  Handlebars.registerHelper(
    "equals",
    function (
      this: any,
      a: string,
      b: string,
      options: Handlebars.HelperOptions
    ): string {
      return a === b ? options.fn(this) : options.inverse(this)
    }
  )

  Handlebars.registerHelper(
    "notEquals",
    function (
      this: any,
      a: string,
      b: string,
      options: Handlebars.HelperOptions
    ): string {
      return a !== b ? options.fn(this) : options.inverse(this)
    }
  )

  Handlebars.registerHelper(
    "containsSpaces",
    function (
      this: any,
      value: string,
      options: Handlebars.HelperOptions
    ): string {
      return /\s+/.test(value) ? options.fn(this) : options.inverse(this)
    }
  )

  Handlebars.registerHelper(
    "union",
    function (
      this: any,
      properties: Model[],
      parent: string | undefined,
      options: Handlebars.HelperOptions
    ) {
      const type = Handlebars.partials["type"]
      const types = properties.map((property) =>
        type({ ...root, ...property, parent })
      )
      const uniqueTypes = types.filter(unique)
      let uniqueTypesString = uniqueTypes.join(" | ")
      if (uniqueTypes.length > 1) {
        uniqueTypesString = `(${uniqueTypesString})`
      }
      return options.fn(uniqueTypesString)
    }
  )

  Handlebars.registerHelper(
    "intersection",
    function (
      this: any,
      properties: Model[],
      parent: string | undefined,
      options: Handlebars.HelperOptions
    ) {
      const type = Handlebars.partials["type"]
      const types = properties.map((property) =>
        type({ ...root, ...property, parent })
      )
      const uniqueTypes = types.filter(unique)
      let uniqueTypesString = uniqueTypes.join(" & ")
      if (uniqueTypes.length > 1) {
        uniqueTypesString = `(${uniqueTypesString})`
      }
      return options.fn(uniqueTypesString)
    }
  )

  Handlebars.registerHelper(
    "enumerator",
    function (
      this: any,
      enumerators: Enum[],
      parent: string | undefined,
      name: string | undefined,
      options: Handlebars.HelperOptions
    ) {
      if (!root.useUnionTypes && parent && name) {
        return `${parent}.${name}`
      }
      return options.fn(
        enumerators
          .map((enumerator) => enumerator.value)
          .filter(unique)
          .join(" | ")
      )
    }
  )

  Handlebars.registerHelper("escapeComment", function (value: string): string {
    return value
      .replace(/\*\//g, "*")
      .replace(/\/\*/g, "*")
      .replace(/\r?\n(.*)/g, (_, w) => `${EOL} * ${w.trim()}`)
  })

  Handlebars.registerHelper(
    "escapeDescription",
    function (value: string): string {
      return value
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\${/g, "\\${")
    }
  )

  Handlebars.registerHelper("camelCase", function (value: string): string {
    return camelCase(value)
  })

  Handlebars.registerHelper("pascalCase", function (value: string): string {
    return pascalCase(value)
  })
}
