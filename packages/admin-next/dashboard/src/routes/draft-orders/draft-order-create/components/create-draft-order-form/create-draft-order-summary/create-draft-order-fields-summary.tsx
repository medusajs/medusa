import { Switch } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../../components/common/form"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderFieldsSummary = () => {
  const { t } = useTranslation()
  const { form } = useCreateDraftOrder()

  return (
    <div>
      <Form.Field
        control={form.control}
        name="notification_order"
        render={({ field: { value, onChange, ...field } }) => {
          return (
            <Form.Item>
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-between">
                  <Form.Label>
                    {t("draftOrders.create.sendNotificationLabel")}
                  </Form.Label>
                  <Form.Control>
                    <Switch
                      {...field}
                      onCheckedChange={onChange}
                      checked={value}
                    />
                  </Form.Control>
                </div>
                <Form.Hint>
                  {t("draftOrders.create.sendNotificationHint")}
                </Form.Hint>
              </div>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
