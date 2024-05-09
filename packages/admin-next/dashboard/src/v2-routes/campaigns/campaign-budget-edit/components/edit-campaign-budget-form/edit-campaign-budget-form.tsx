import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignResponse } from "@medusajs/types"
import {
  Button,
  clx,
  CurrencyInput,
  Input,
  RadioGroup,
  toast,
} from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
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
  limit: zod.number().min(0),
  type: zod.enum(["spend", "usage"]).optional(),
})

export const EditCampaignBudgetForm = ({
  campaign,
}: EditCampaignBudgetFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditCampaignSchema>>({
    defaultValues: {
      limit: campaign?.budget?.limit,
      type: campaign?.budget?.type || "spend",
    },
    resolver: zodResolver(EditCampaignSchema),
  })

  const { mutateAsync, isPending } = useUpdateCampaign(campaign.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        id: campaign.id,
        budget: {
          limit: data.limit,
          type: data.type,
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

  const watchValueType = useWatch({
    control: form.control,
    name: "type",
  })

  const isTypeSpend = watchValueType === "spend"

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.budget.fields.type")}</Form.Label>

                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "spend" === field.value,
                          })}
                          value={"spend"}
                          label={t("campaigns.budget.type.spend.title")}
                          description={t(
                            "campaigns.budget.type.spend.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "usage" === field.value,
                          })}
                          value={"usage"}
                          label={t("campaigns.budget.type.usage.title")}
                          description={t(
                            "campaigns.budget.type.usage.description"
                          )}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

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
                      {isTypeSpend ? (
                        <CurrencyInput
                          min={0}
                          onValueChange={(value) =>
                            onChange(value ? parseInt(value) : "")
                          }
                          code={campaign.currency}
                          symbol={getCurrencySymbol(campaign.currency)}
                          {...field}
                          value={value}
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
