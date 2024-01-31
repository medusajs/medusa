import { CustomerDTO } from "@medusajs/types"

export const defaultStoreCustomersRelations = []
export const allowedStoreCustomersRelations = ["addresses", "groups"]
export const defaultStoreCustomersFields: (keyof CustomerDTO)[] = [
  "id",
  "email",
  "company_name",
  "first_name",
  "last_name",
  "phone",
  "metadata",
  "created_by",
  "deleted_at",
  "created_at",
  "updated_at",
]

export const retrieveTransformQueryConfig = {
  defaultFields: defaultStoreCustomersFields as string[],
  defaultRelations: defaultStoreCustomersRelations,
  allowedRelations: allowedStoreCustomersRelations,
  isList: false,
}
