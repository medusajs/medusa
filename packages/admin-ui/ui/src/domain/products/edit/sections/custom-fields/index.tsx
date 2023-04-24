import { Product } from "@medusajs/medusa"
import { useAdminUpdateProduct } from "medusa-react"
import Section from "../../../../../components/organisms/section"

import CustomFieldsTable from "./custom-fields-table"

type Props = {
  product: Product
}

export type CustomProductField = {
  value: string
  label: string
  key: string
  [key: string]: any
}

const CustomFieldsSection = ({ product }: Props) => {
  const mutation = useAdminUpdateProduct(product.id)

  const save = (fields: CustomProductField[]) => {
    mutation.mutate({ metadata: { custom_fields: fields } })
  }

  const fields: CustomProductField[] =
    (product.metadata?.custom_fields as CustomProductField[]) ?? []

  if (fields.length === 0) return null

  return (
    <>
      <Section title={"Custom Fields"}>
        <div className="mt-4">
          <CustomFieldsTable fields={fields} actions={{ save }} />
        </div>
      </Section>
    </>
  )
}

export const ProductField = ({ field }: { field: CustomProductField }) => {
  return (
    <div>
      <p>{field.label}</p>
      <p className="inter-base-regular text-grey-50 mt-2 whitespace-pre-wrap">
        {field.value}
      </p>
    </div>
  )
}

export default CustomFieldsSection
