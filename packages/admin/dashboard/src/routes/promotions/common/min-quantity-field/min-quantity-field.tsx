import { Input, Text } from "@medusajs/ui"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Form } from "../../../../components/common/form"

type MinQuantityFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  className?: string
}

export const MinQuantityField = <TFieldValues extends FieldValues>({
  control,
  name,
  className,
}: MinQuantityFieldProps<TFieldValues>) => {
  const { t } = useTranslation()

  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => {
        return (
          <Form.Item className={className}>
            <Form.Label optional>
              {t("promotions.form.min_quantity.title")}
            </Form.Label>

            <Form.Control>
              <Input
                type="number"
                min={1}
                placeholder="3"
                value={value ?? ""}
                onChange={(e) => {
                  const value = e.target.value

                  if (value === "") {
                    onChange(null)
                  } else {
                    onChange(Number(value))
                  }
                }}
                {...field}
              />
            </Form.Control>

            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              <Trans
                t={t}
                i18nKey="promotions.form.min_quantity.description"
                components={[<br key="break" />]}
              />
            </Text>
            <Form.ErrorMessage />
          </Form.Item>
        )
      }}
    />
  )
}
