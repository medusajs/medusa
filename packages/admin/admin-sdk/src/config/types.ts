import type {
  CustomFieldFormKeys,
  CustomFieldModel,
  CustomFieldModelContainerMap,
  CustomFieldModelFormTabsMap,
  InjectionZone,
} from "@medusajs/admin-shared"
import type { ComponentType } from "react"
import { ZodFirstPartySchemaTypes } from "zod"

export interface WidgetConfig {
  /**
   * The injection zone or zones that the widget should be injected into.
   */
  zone: InjectionZone | InjectionZone[]
}

export interface RouteConfig {
  /**
   * An optional label to display in the sidebar. If not provided, the route will not be displayed in the sidebar.
   */
  label?: string
  /**
   * An optional icon to display in the sidebar together with the label. If no label is provided, the icon will be ignored.
   */
  icon?: ComponentType
}

export type CustomFormField<
  TData = unknown,
  TValidation extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes
> = {
  /**
   * The rules that the field should be validated against.
   *
   * @example
   * ```ts
   * rules: z.string().email() // The field must be a valid email
   * ```
   */
  validation: TValidation
  /**
   * The default value of the field.
   */
  defaultValue: ((data: TData) => any) | any
  /**
   * The label of the field. If not provided, the label will be inferred from the field name.
   */
  label?: string
  /**
   * The description of the field.
   */
  description?: string
  /**
   * The placeholder of the field.
   */
  placeholder?: string
  /**
   * Custom component to render the field. If not provided, the field will be rendered using the
   * default component for the field type, which is determined by the field's validation schema.
   */
  component?: ComponentType
}

// Define the main configuration type
export interface CustomFieldConfig<TModel extends CustomFieldModel> {
  /**
   * The name of the model that the custom models are linked to.
   * This should be the name of one of the built-in models, such as `product` or `customer`.
   *
   * @example
   * ```ts
   * model: "product"
   * ```
   */
  model: TModel
  /**
   * The name of the custom model(s) that the custom fields belong to.
   * This is used to ensure that the custom fields are fetched when
   * querying the entrypoint model.
   *
   * @example
   * ```ts
   * export default unstable_defineCustomFieldsConfig({
   *   model: "product",
   *   link: "brand"
   *   // ...
   * })
   * ```
   * or
   * ```ts
   * export default unstable_defineCustomFieldsConfig({
   *   model: "product",
   *   link: ["brand", "seller"]
   *   // ...
   * })
   * ```
   */
  link: string | string[]
  forms: Array<
    {
      [K in CustomFieldFormKeys<TModel> &
        keyof CustomFieldModelFormTabsMap[TModel]]: {
        /**
         * The form to extend.
         *
         * @example
         * ```ts
         * export default unstable_defineCustomFieldsConfig({
         *   model: "product",
         *   link: "brand",
         *   forms: [
         *     {
         *       zone: "create",
         *       // ...
         *     }
         *   ],
         *   // ...
         * })
         * ```
         */
        zone: K
        fields: Record<string, CustomFormField<any, any>>
      } & (CustomFieldModelFormTabsMap[TModel][K] extends never
        ? {}
        : { tab: CustomFieldModelFormTabsMap[TModel][K] })
    }[CustomFieldFormKeys<TModel> & keyof CustomFieldModelFormTabsMap[TModel]]
  >
  /**
   * Optionally define how to display the custom fields, in an existing container on the entity details page.
   * Alternatively, you can create a new widget to display the custom fields.
   */
  displays?: Array<{
    /**
     * The identifier of the container that the custom fields should be injected into.
     */
    zone: CustomFieldModelContainerMap[TModel]
    /**
     * The component that should be rendered to display the custom fields.
     * This component will receive the entity data as a prop.
     */
    component: ComponentType
  }>
}
