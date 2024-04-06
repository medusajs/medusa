import { zodResolver } from "@hookform/resolvers/zod"
import { CampaignDTO, PromotionDTO } from "@medusajs/types"
import { Button, RadioGroup, Select } from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { CampaignDetails } from "./campaign-details"

import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdatePromotion } from "../../../../../hooks/api/promotions"

type EditPromotionFormProps = {
  promotion: PromotionDTO
  campaigns: CampaignDTO[]
}

const EditPromotionSchema = zod.object({
  campaign_id: zod.string().optional(),
  existing: zod.string().toLowerCase(),
})

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
      existing: "true",
    },
    resolver: zodResolver(EditPromotionSchema),
  })

  const watchCampaignId = useWatch({
    control: form.control,
    name: "campaign_id",
  })

  const selectedCampaign = campaigns.find((c) => c.id === watchCampaignId)
  const { mutateAsync, isPending } = useUpdatePromotion(promotion.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { campaign_id: data.campaign_id },
      { onSuccess: () => handleSuccess() }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="existing"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Method</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          value={"true"}
                          label={t("promotions.form.campaign.existing.title")}
                          description={t(
                            "promotions.form.campaign.existing.description"
                          )}
                        />
                        <RadioGroup.ChoiceBox
                          value={"false"}
                          label={t("promotions.form.campaign.new.title")}
                          description={t(
                            "promotions.form.campaign.new.description"
                          )}
                          disabled
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

            <CampaignDetails campaign={selectedCampaign} />
          </div>
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
