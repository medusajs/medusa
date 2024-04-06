import { Input, RadioGroup, Textarea } from "@medusajs/ui"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import type { PricingCreateSchemaType } from "./schema"

type PricingDetailsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

export const PricingDetailsForm = ({ form }: PricingDetailsFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
        <Form.Field
          control={form.control}
          name="type"
          render={({ field: { onChange, ...rest } }) => {
            return (
              <Form.Item>
                <div className="flex flex-col gap-y-4">
                  <div>
                    <Form.Label>{t("fields.type")}</Form.Label>
                    <Form.Hint>
                      Choose the type of price list you want to create.
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    <RadioGroup
                      onValueChange={onChange}
                      {...rest}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <RadioGroup.ChoiceBox
                        value={"sale"}
                        label="Sale"
                        description="Choose this if you are creating a sale"
                      />
                      <RadioGroup.ChoiceBox
                        value={"override"}
                        label="Override"
                        description="Choose this if you are creating an override"
                      />
                    </RadioGroup>
                  </Form.Control>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Field
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.title")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
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
                  <Form.Label>{t("fields.description")}</Form.Label>
                  <Form.Control>
                    <Textarea {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>
        <Divider />
        <Form.Field
          control={form.control}
          name="starts_at"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{t("fields.startDate")}</Form.Label>
                <Form.Control></Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Divider />
        <Form.Field
          control={form.control}
          name="ends_at"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{t("fields.endDate")}</Form.Label>
                <Form.Control></Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
