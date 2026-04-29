import { RemoteQueryEntryPoints } from "@medusajs/framework/types"

/**
 * Extracts only the keys of T where the value is a string (or nullable string), the key
 * is not __typename or id.
 * This filters out relations and other non-string fields.
 */
type StringValuedKeys<T> = {
  [K in keyof T]: K extends `${string}_id`
    ? never
    : "__typename" extends K
    ? never
    : "id" extends K
    ? never
    : NonNullable<T[K]> extends string
    ? K
    : never
}[keyof T]

/**
 * A discriminated union of all possible entity configurations.
 * When you specify a `type`, TypeScript will narrow `fields` to only
 * the string-valued keys of that specific entity type.
 */
export type TranslatableEntityConfig =
  | {
      [K in keyof RemoteQueryEntryPoints]: {
        type: K
        fields: StringValuedKeys<RemoteQueryEntryPoints[K]>[]
      }
    }[keyof RemoteQueryEntryPoints]
  | {
      type: string
      fields: string[]
    }

/**
 * Options for configuring the translation module.
 */
export type TranslationModuleOptions = {
  entities?: TranslatableEntityConfig[]
}

// Augment the global ModuleOptions registry
declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/translation": TranslationModuleOptions
    "@medusajs/medusa/translation": TranslationModuleOptions
  }
}
