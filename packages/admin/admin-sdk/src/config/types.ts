import type {
  Entrypoint,
  EntrypointContainerMap,
  EntrypointFormTabsMap,
  FormKeys,
  InjectionZone,
} from "@medusajs/admin-shared"
import type { ComponentType } from "react"
import { z, infer as ZodInfer, ZodObject, ZodSchema } from "zod"

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

interface FormField {
  rules: ZodObject<any, any, any, any>
}

const a: FormField = {
  rules: z.object({
    name: z.string(),
  }),
}

// Define the main configuration type
export interface CustomFieldConfig<TEntity extends Entrypoint> {
  /**
   * The name of the entrypoint that the custom fields belong to.
   * This should be the name of one of the built-in models, such as `product` or `customer`.
   *
   * @example
   * ```ts
   * entryPoint: "product"
   * ```
   */
  entryPoint: TEntity
  /**
   * The name of the custom model(s) that the custom fields belong to.
   * This is used to ensure that the custom fields are fetched when
   * querying the entrypoint model.
   *
   * @example
   * ```ts
   * export default unstable_defineCustomFieldsConfig({
   *   entryPoint: "product",
   *   link: "brand"
   *   // ...
   * })
   * ```
   * or
   * ```ts
   * export default unstable_defineCustomFieldsConfig({
   *   entryPoint: "product",
   *   link: ["brand", "seller"]
   *   // ...
   * })
   * ```
   */
  link: string | string[]
  forms: Array<
    {
      [K in FormKeys<TEntity> & keyof EntrypointFormTabsMap[TEntity]]: {
        /**
         * The form to extend.
         *
         * @example
         * ```ts
         * export default unstable_defineCustomFieldsConfig({
         *   entryPoint: "product",
         *   link: "brand",
         *   forms: [
         *     {
         *       form: "create",
         *       // ...
         *     }
         *   ],
         *   // ...
         * })
         * ```
         */
        form: K
        /**
         * The schema to validate the form values.
         *
         * @example
         * ```ts
         * export default unstable_defineCustomFieldsConfig({
         *   entryPoint: "product",
         *   link: ["brand", "seller"],
         *   forms: [
         *     {
         *       form: "edit",
         *       schema: z.object({
         *         brand_id: z.string(),
         *         seller_id: z.string(),
         *       }),
         *       // ...
         *     }
         *   ],
         *   // ...
         * })
         * ```
         */
        schema: ZodSchema
        /**
         * The default values to use when the form is rendered.
         *
         * @example
         * ```ts
         * export default unstable_defineCustomFieldsConfig({
         *   entryPoint: "product",
         *   link: ["brand", "seller"],
         *   forms: [
         *     {
         *       form: "create",
         *       defaultValues: {
         *         brand_id: "",
         *         seller_id: "",
         *       }
         *       // ...
         *     }
         *   ],
         *   // ...
         * })
         * ```
         * or
         * ```ts
         * export default unstable_defineCustomFieldsConfig({
         *   entryPoint: "product",
         *   link: ["brand", "seller"],
         *   forms: [
         *     {
         *       form: "edit",
         *       defaultValues: (data) => {
         *         brand_id: data.brand.id,
         *         seller_id: data.seller.id,
         *       }
         *       // ...
         *     }
         *   ],
         *   // ...
         * })
         * ```
         */
        defaultValues: ZodInfer<ZodSchema>
        /**
         * The component that should be rendered to display the custom fields.
         */
        component: ComponentType
      } & (EntrypointFormTabsMap[TEntity][K] extends never
        ? {}
        : { tab: EntrypointFormTabsMap[TEntity][K] })
    }[FormKeys<TEntity> & keyof EntrypointFormTabsMap[TEntity]]
  >
  /**
   * Optionally define how to display the custom fields, in an existing container on the entity details page.
   * Alternatively, you can create a new widget to display the custom fields.
   */
  display?: Array<{
    /**
     * The identifier of the container that the custom fields should be injected into.
     */
    container: EntrypointContainerMap[TEntity]
    /**
     * The component that should be rendered to display the custom fields.
     * This component will receive the entity data as a prop.
     */
    component: ComponentType
  }>
}
