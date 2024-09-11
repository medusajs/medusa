import { FORM_IDS, ProductForms } from "./constants"

export type FormId = (typeof FORM_IDS)[number]

export type EntityFormMap = {
  product: ProductForms
}

// Helper type to get form names for a specific entity
export type FormNames<TEntity extends keyof EntityFormMap> =
  keyof EntityFormMap[TEntity]

// Helper type to get tab names for a specific form
export type TabNames<
  TEntity extends keyof EntityFormMap,
  TForm extends FormNames<TEntity>
> = EntityFormMap[TEntity][TForm] extends { tabs: readonly string[] }
  ? EntityFormMap[TEntity][TForm]["tabs"][number]
  : never
