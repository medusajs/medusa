import type { CustomFieldModelFormMap } from "@medusajs/admin-shared"
import { z, ZodFirstPartySchemaTypes } from "zod"
import {
  CustomFieldConfig,
  CustomFormField,
  RouteConfig,
  WidgetConfig,
} from "./types"

function createConfigHelper<TConfig>(config: TConfig): TConfig {
  return {
    ...config,
    /**
     * This property is required to allow the config to be exported,
     * while still allowing HMR to work correctly.
     *
     * It tricks Fast Refresh into thinking that the config is a React component,
     * which allows it to be updated without a full page reload.
     */
    $$typeof: Symbol.for("react.memo"),
  }
}

/**
 * Define a widget configuration.
 *
 * @param config The widget configuration.
 * @returns The widget configuration.
 */
export function defineWidgetConfig(config: WidgetConfig) {
  return createConfigHelper(config)
}

/**
 * Define a route configuration.
 *
 * @param config The route configuration.
 * @returns The route configuration.
 */
export function defineRouteConfig(config: RouteConfig) {
  return createConfigHelper(config)
}

/**
 * Define a custom fields configuration.
 *
 * @param config The custom fields configuration.
 * @returns The custom fields configuration.
 *
 * @experimental This API is experimental and may change in the future.
 */
export function unstable_defineCustomFieldsConfig<
  TModel extends keyof CustomFieldModelFormMap
>(config: CustomFieldConfig<TModel>) {
  return createConfigHelper(config)
}

/**
 * Creates a type-safe form builder.
 *
 * @returns The form helper.
 *
 * @example
 * ```ts
 * import { unstable_createFormHelper, unstable_defineCustomFieldsConfig } from "@medusajs/admin-sdk"
 * import type { HttpTypes } from "@medusajs/types"
 * import type { Brand } from "../../types/brand"
 *
 * type ExtendedProduct = HttpTypes.Product & {
 *   brand: Brand | null
 * }
 *
 * const form = unstable_createFormHelper<ExtendedProduct>()
 *
 * export default unstable_defineCustomFieldsConfig({
 *   entryPoint: "product",
 *   link: "brand",
 *   forms: [{
 *     form: "create",
 *     fields: {
 *       brand_id: form.define({
 *         rules: form.string().nullish(),
 *         defaultValue: "",
 *       }),
 *     }
 *   }]
 * })
 * ```
 *
 * @experimental This API is experimental and may change in the future.
 */
export function unstable_createFormHelper<TData>() {
  return {
    /**
     * Define a custom form field.
     *
     * @param field The field to define.
     * @returns The field.
     */
    define: <T extends ZodFirstPartySchemaTypes>(
      field: Omit<CustomFormField<TData, T>, "validation"> & { validation: T }
    ): CustomFormField<TData, T> => {
      return field as CustomFormField<TData, T>
    },
    string: () => z.string(),
    number: () => z.number(),
    boolean: () => z.boolean(),
    date: () => z.date(),
    array: z.array,
    object: z.object,
    null: () => z.null(),
    nullable: z.nullable,
    undefined: () => z.undefined(),
    coerce: z.coerce,
  }
}
