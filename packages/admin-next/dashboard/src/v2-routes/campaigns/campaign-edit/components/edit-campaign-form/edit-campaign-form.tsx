import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignResponse } from "@medusajs/types"
import { Button, DatePicker, Input, Select, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateCampaign } from "../../../../../hooks/api/campaigns"
import { useStore } from "../../../../../hooks/api/store"
import { currencies } from "../../../../../lib/currencies"

type EditCampaignFormProps = {
  campaign: CampaignResponse
}

const EditCampaignSchema = zod.object({
  name: zod.string(),
  description: zod.string().optional(),
  currency: zod.string().optional(),
  campaign_identifier: zod.string().optional(),
  starts_at: zod.date().optional(),
  ends_at: zod.date().optional(),
})

export const EditCampaignForm = ({ campaign }: EditCampaignFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { store } = useStore()

  const form = useForm<zod.infer<typeof EditCampaignSchema>>({
    defaultValues: {
      name: campaign.name || "",
      description: campaign.description || "",
      currency: campaign.currency || "",
      campaign_identifier: campaign.campaign_identifier || "",
      starts_at: campaign.starts_at ? new Date(campaign.starts_at) : undefined,
      ends_at: campaign.ends_at ? new Date(campaign.ends_at) : undefined,
    },
    resolver: zodResolver(EditCampaignSchema),
  })

  const { mutateAsync, isPending } = useUpdateCampaign(campaign.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        id: campaign.id,
        name: data.name,
        description: data.description,
        currency: data.currency,
        campaign_identifier: data.campaign_identifier,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
      },
      {
        onSuccess: ({ campaign }) => {
          toast.success(t("general.success"), {
            description: t("campaigns.edit.successToast", {
              name: campaign.name,
            }),
            dismissLabel: t("actions.close"),
          })

          handleSuccess()
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.name")}</Form.Label>

                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.description")}</Form.Label>

                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="campaign_identifier"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.fields.identifier")}</Form.Label>

                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="currency"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.currency")}</Form.Label>
                    <Form.Control>
                      <Select {...field} onValueChange={onChange}>
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>

                        <Select.Content>
                          {Object.values(currencies)
                            .filter((currency) =>
                              store?.supported_currency_codes?.includes(
                                currency.code.toLocaleLowerCase()
                              )
                            )
                            .map((currency) => (
                              <Select.Item
                                value={currency.code.toLowerCase()}
                                key={currency.code}
                              >
                                {currency.name}
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

            <Form.Field
              control={form.control}
              name="starts_at"
              render={({ field: { value, onChange, ref: _ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.fields.start_date")}</Form.Label>

                    <Form.Control>
                      <DatePicker
                        showTimePicker
                        value={value ?? undefined}
                        onChange={(v) => {
                          onChange(v ?? null)
                        }}
                        {...field}
                      />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="ends_at"
              render={({ field: { value, onChange, ref: _ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.fields.end_date")}</Form.Label>

                    <Form.Control>
                      <DatePicker
                        showTimePicker
                        value={value ?? undefined}
                        onChange={(v) => onChange(v ?? null)}
                        {...field}
                      />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button
              isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
