import { Select } from "@medusajs/ui"
import { useAdminRegions, useMedusa } from "medusa-react"
import { useTranslation } from "react-i18next"
import { json } from "react-router-dom"

import { useWatch } from "react-hook-form"
import { Form } from "../../../../../../components/common/form"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderRegionDetails = () => {
  const { t } = useTranslation()
  const {
    form,
    setRegion,
    variants: { rebase },
  } = useCreateDraftOrder()
  const { client } = useMedusa()

  const existingItems = useWatch({
    control: form.control,
    name: "existing_items",
  })

  const { regions, isLoading, isError, error } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const handleRebaseUnitPrices = async (regionId: string) => {
    if (!existingItems?.length) {
      return
    }

    const { variants } = await client.admin.variants
      .list({
        region_id: regionId,
        id: existingItems.map((i) => i.variant_id),
      })
      .catch((_err) => {
        // Show toast with error message
        return { variants: [] }
      })

    rebase(variants)
  }

  const handleResetShippingDetails = () => {
    form.resetField("shipping_method")
    form.resetField("shipping_address")
    form.resetField("billing_address")
  }

  const handleRegionChange = (regId: string) => {
    const region = regions?.find((r) => r.id === regId)

    if (!region) {
      throw json({ message: "Region not found" }, 400)
    }

    setRegion(region)
  }

  const onValueChange = (fn: (...event: any[]) => void) => {
    return async (id: string) => {
      fn(id)
      await handleRebaseUnitPrices(id)
      handleResetShippingDetails()
      handleRegionChange(id)
    }
  }

  if (isError) {
    throw error
  }

  return (
    <fieldset className="grid grid-cols-2 gap-4">
      <Form.Field
        control={form.control}
        name="region_id"
        render={({
          field: { ref, onChange, disabled, ...field },
          fieldState: { error },
        }) => {
          return (
            <Form.Item>
              <Form.Label className="!h2-core">{t("fields.region")}</Form.Label>
              <Form.Hint>{t("draftOrders.create.chooseRegionHint")}</Form.Hint>
              <Form.Control>
                <Select
                  {...field}
                  onValueChange={onValueChange(onChange)}
                  disabled={isLoading || disabled}
                >
                  <Select.Trigger aria-invalid={!!error} ref={ref}>
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
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </fieldset>
  )
}
