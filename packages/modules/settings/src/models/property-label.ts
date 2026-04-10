import { model } from "@medusajs/framework/utils"

/**
 * PropertyLabel stores custom display labels for entity properties.
 * Labels are global (shared across all admin users) and provide
 * consistent terminology throughout the admin interface.
 */
export const PropertyLabel = model
  .define("property_label", {
    id: model.id({ prefix: "plbl" }).primaryKey(),
    /**
     * The entity this label applies to (e.g., "Order", "Product")
     */
    entity: model.text().searchable(),
    /**
     * The property path (e.g., "display_id", "customer.email")
     */
    property: model.text().searchable(),
    /**
     * Custom display name for the property
     */
    label: model.text().translatable(),
    /**
     * Optional description providing context about the property
     */
    description: model.text().translatable().nullable(),
  })
  .indexes([
    {
      on: ["entity", "property"],
      unique: true,
    },
    {
      on: ["entity"],
    },
  ])
