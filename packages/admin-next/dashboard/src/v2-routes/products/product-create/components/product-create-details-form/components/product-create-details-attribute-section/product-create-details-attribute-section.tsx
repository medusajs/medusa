import { Heading, Input } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../../../components/common/form"
import { CountrySelect } from "../../../../../../../components/inputs/country-select"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateAttributeSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateAttributeSection = ({
  form,
}: ProductCreateAttributeSectionProps) => {
  const { t } = useTranslation()

  return (
    <div id="attributes" className="flex flex-col gap-y-8">
      <Heading level="h2">{t("products.attributes")}</Heading>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        <Form.Field
          control={form.control}
          name="origin_country"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.countryOrigin.label")}
                </Form.Label>
                <Form.Control>
                  <CountrySelect {...field} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="material"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.material.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8">
        <Form.Field
          control={form.control}
          name="width"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.width.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} type="number" min={0} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="length"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.length.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} type="number" min={0} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="height"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.height.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} type="number" min={0} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="weight"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.weight.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} type="number" min={0} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="mid_code"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.mid_code.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="hs_code"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.hs_code.label")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
