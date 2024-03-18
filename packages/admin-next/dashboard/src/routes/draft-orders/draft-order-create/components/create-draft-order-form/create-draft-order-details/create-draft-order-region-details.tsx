import { Select } from "@medusajs/ui"
import { useAdminRegions } from "medusa-react"
import { useTranslation } from "react-i18next"
import { json } from "react-router-dom"

import { Form } from "../../../../../../components/common/form"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderRegionDetails = () => {
  const { t } = useTranslation()
  const { form, setRegion } = useCreateDraftOrder()

  const { regions, isLoading, isError, error } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const handleRegionChange = (regId: string) => {
    const region = regions?.find((r) => r.id === regId)

    if (!region) {
      throw json({ message: "Region not found" }, 400)
    }

    setRegion(region)
  }

  if (isError) {
    throw error
  }

  return (
    <fieldset className="grid grid-cols-2 gap-4">
      <Form.Field
        control={form.control}
        name="region_id"
        render={({ field: { ref, onChange, disabled, ...field } }) => {
          return (
            <Form.Item>
              <Form.Label className="!h2-core">{t("fields.region")}</Form.Label>
              <Form.Hint>{t("draftOrders.create.chooseRegionHint")}</Form.Hint>
              <Form.Control>
                <Select
                  {...field}
                  onValueChange={(id) => {
                    onChange(id)
                    handleRegionChange(id)
                  }}
                  disabled={isLoading || disabled}
                >
                  <Select.Trigger ref={ref}>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {regions?.map((r) => (
                      <Select.Item key={r.id} value={r.id}>
                        {r.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
            </Form.Item>
          )
        }}
      />
    </fieldset>
  )
}
