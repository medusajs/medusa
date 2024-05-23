import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignResponse } from "@medusajs/types"
import { Button, CurrencyInput, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateCampaign } from "../../../../../hooks/api/campaigns"
import { getCurrencySymbol } from "../../../../../lib/currencies"

type EditCampaignBudgetFormProps = {
  campaign: CampaignResponse
}

const EditCampaignSchema = zod.object({
  limit: zod.number().min(0).optional().nullable(),
})

export const EditCampaignBudgetForm = ({
  campaign,
}: EditCampaignBudgetFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditCampaignSchema>>({
    defaultValues: {
      limit: campaign?.budget?.limit || undefined,
    },
    resolver: zodResolver(EditCampaignSchema),
  })

  const { mutateAsync, isPending } = useUpdateCampaign(campaign.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        id: campaign.id,
        budget: {
          limit: data.limit ? data.limit : null,
        },
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
              name="limit"
              render={({ field: { onChange, value, ...field } }) => {
                return (
                  <Form.Item className="basis-1/2">
                    <Form.Label>
                      {t("campaigns.budget.fields.limit")}
                    </Form.Label>

                    <Form.Control>
                      {campaign.budget?.type === "spend" ? (
                        <CurrencyInput
                          min={0}
                          onValueChange={(value) =>
                            onChange(value ? parseInt(value) : null)
                          }
                          code={campaign.budget?.currency_code}
                          symbol={
                            campaign.budget?.currency_code
                              ? getCurrencySymbol(
                                  campaign.budget?.currency_code
                                )
                              : ""
                          }
                          {...field}
                          value={value || undefined}
                        />
                      ) : (
                        <Input
                          key="usage"
                          min={0}
                          {...field}
                          value={value}
                          onChange={(e) => {
                            onChange(
                              e.target.value === ""
                                ? null
                                : parseInt(e.target.value)
                            )
                          }}
                        />
                      )}
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
