import { zodResolver } from "@hookform/resolvers/zod"
import { AdminCampaign } from "@medusajs/types"
import { Button, DatePicker, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateCampaign } from "../../../../../hooks/api/campaigns"

type CampaignConfigurationFormProps = {
  campaign: AdminCampaign
}

const CampaignConfigurationSchema = z.object({
  starts_at: z.date().nullable(),
  ends_at: z.date().nullable(),
})

export const CampaignConfigurationForm = ({
  campaign,
}: CampaignConfigurationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CampaignConfigurationSchema>>({
    defaultValues: {
      starts_at: campaign.starts_at ? new Date(campaign.starts_at) : undefined,
      ends_at: campaign.ends_at ? new Date(campaign.ends_at) : undefined,
    },
    resolver: zodResolver(CampaignConfigurationSchema),
  })

  const { mutateAsync, isPending } = useUpdateCampaign(campaign.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        starts_at: data.starts_at || null,
        ends_at: data.ends_at || null,
      },
      {
        onSuccess: ({ campaign }) => {
          toast.success(
            t("campaigns.configuration.edit.successToast", {
              name: campaign.name,
            })
          )

          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="starts_at"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.fields.start_date")}</Form.Label>

                    <Form.Control>
                      <DatePicker
                        granularity="minute"
                        hourCycle={12}
                        shouldCloseOnSelect={false}
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
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.fields.end_date")}</Form.Label>

                    <Form.Control>
                      <DatePicker
                        granularity="minute"
                        shouldCloseOnSelect={false}
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
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
