import { Switch } from "@medusajs/ui"
import { Form } from "../../../../../../components/common/form"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderFieldsSummary = () => {
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
                  <Form.Label>Send notification</Form.Label>
                  <Form.Control>
                    <Switch
                      {...field}
                      onCheckedChange={onChange}
                      checked={value}
                    />
                  </Form.Control>
                </div>
                <Form.Hint>Notify the customer of this draft order.</Form.Hint>
              </div>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
