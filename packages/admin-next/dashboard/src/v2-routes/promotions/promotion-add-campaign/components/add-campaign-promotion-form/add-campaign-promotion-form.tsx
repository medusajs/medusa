import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignResponse, PromotionDTO } from "@medusajs/types"
import { Button, clx, RadioGroup, Select } from "@medusajs/ui"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdatePromotion } from "../../../../../hooks/api/promotions"
import { CreateCampaignFormFields } from "../../../../campaigns/common/components/create-campaign-form-fields"
import { CampaignDetails } from "./campaign-details"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  campaigns: CampaignResponse[]
}

const EditPromotionSchema = zod.object({
  campaign_id: zod.string().optional().nullable(),
  campaign_choice: zod.enum(["none", "existing"]).optional(),
})

export const AddCampaignPromotionFields = ({
  form,
  campaigns,
  withNewCampaign = true,
}: {
  form: any
  campaigns: CampaignResponse[]
  withNewCampaign?: boolean
}) => {
  const { t } = useTranslation()
  const watchCampaignId = useWatch({
    control: form.control,
    name: "campaign_id",
  })

  const watchCampaignChoice = useWatch({
    control: form.control,
    name: "campaign_choice",
  })

  const selectedCampaign = campaigns.find((c) => c.id === watchCampaignId)

  return (
    <div className="flex h-full flex-col gap-y-8">
      <Form.Field
        control={form.control}
        name="campaign_choice"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>Method</Form.Label>

              <Form.Control>
                <RadioGroup
                  className="flex gap-y-3"
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <RadioGroup.ChoiceBox
                    value={"none"}
                    label={t("promotions.form.campaign.none.title")}
                    description={t("promotions.form.campaign.none.description")}
                    className={clx("border", {
                      "border border-ui-border-interactive":
                        "none" === field.value,
                    })}
                  />

                  <RadioGroup.ChoiceBox
                    value={"existing"}
                    label={t("promotions.form.campaign.existing.title")}
                    description={t(
                      "promotions.form.campaign.existing.description"
                    )}
                    className={clx("border", {
                      "border border-ui-border-interactive":
                        "existing" === field.value,
                    })}
                  />

                  {withNewCampaign && (
                    <RadioGroup.ChoiceBox
                      value={"new"}
                      label={t("promotions.form.campaign.new.title")}
                      description={t(
                        "promotions.form.campaign.new.description"
                      )}
                      className={clx("border", {
                        "border border-ui-border-interactive":
                          "new" === field.value,
                      })}
                    />
                  )}
                </RadioGroup>
              </Form.Control>

              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />

      {watchCampaignChoice === "existing" && (
        <Form.Field
          control={form.control}
          name="campaign_id"
          render={({ field: { onChange, ref, ...field } }) => {
            return (
              <Form.Item>
                <Form.Label>
                  {t("promotions.form.campaign.existing.title")}
                </Form.Label>

                <Form.Control>
                  <Select onValueChange={onChange} {...field}>
                    <Select.Trigger ref={ref}>
                      <Select.Value />
                    </Select.Trigger>

                    <Select.Content>
                      {campaigns.map((c) => (
                        <Select.Item key={c.id} value={c.id}>
                          {c.name?.toUpperCase()}
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
      )}

      {watchCampaignChoice === "new" && (
        <CreateCampaignFormFields form={form} fieldScope="campaign." />
      )}

      <CampaignDetails campaign={selectedCampaign} />
    </div>
  )
}

export const AddCampaignPromotionForm = ({
  promotion,
  campaigns,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { campaign } = promotion

  const form = useForm<zod.infer<typeof EditPromotionSchema>>({
    defaultValues: {
      campaign_id: campaign?.id,
      campaign_choice: campaign?.id ? "existing" : "none",
    },
    resolver: zodResolver(EditPromotionSchema),
  })

  const { mutateAsync, isPending } = useUpdatePromotion(promotion.id)
  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { campaign_id: data.campaign_id },
      { onSuccess: () => handleSuccess() }
    )
  })

  const watchCampaignChoice = useWatch({
    control: form.control,
    name: "campaign_choice",
  })

  useEffect(() => {
    if (watchCampaignChoice === "none") {
      form.setValue("campaign_id", null)
    }

    if (watchCampaignChoice === "existing") {
      form.setValue("campaign_id", campaign?.id)
    }
  }, [watchCampaignChoice])

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <AddCampaignPromotionFields
            form={form}
            campaigns={campaigns}
            withNewCampaign={false}
          />
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
