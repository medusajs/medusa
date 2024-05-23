import { Input, Textarea } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"

import { Form } from "../../../../../../../components/common/form"
import { HandleInput } from "../../../../../../../components/inputs/handle-input"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateGeneralSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateGeneralSection = ({
  form,
}: ProductCreateGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <div id="general" className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("products.fields.title.label")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="subtitle"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>
                    {t("products.fields.subtitle.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
        </div>
        <Form.Hint>
          <Trans
            i18nKey="products.fields.title.hint"
            t={t}
            components={[<br key="break" />]}
          />
        </Form.Hint>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Form.Field
          control={form.control}
          name="handle"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label
                  tooltip={t("products.fields.handle.tooltip")}
                  optional
                >
                  {t("fields.handle")}
                </Form.Label>
                <Form.Control>
                  <HandleInput {...field} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
      </div>
      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label optional>
                {t("products.fields.description.label")}
              </Form.Label>
              <Form.Control>
                <Textarea {...field} />
              </Form.Control>
              <Form.Hint>
                <Trans
                  i18nKey={"products.fields.description.hint"}
                  components={[<br key="break" />]}
                />
              </Form.Hint>
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
