import { Input, clx } from "@medusajs/ui"
import { Control } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { EmailSchema } from "../../../lib/schemas"
import { Form } from "../../common/form"

type EmailFieldValues = z.infer<typeof EmailSchema>

type EmailFormProps = {
  control: Control<EmailFieldValues>
  layout?: "grid" | "stack"
}

export const EmailForm = ({ control, layout = "stack" }: EmailFormProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={clx("gap-4", {
        "flex flex-col": layout === "stack",
        "grid grid-cols-2": layout === "grid",
      })}
    >
      <Form.Field
        control={control}
        name="email"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{t("fields.email")}</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
