import { zodResolver } from "@hookform/resolvers/zod"
import { AdminCampaign, AdminPromotion } from "@medusajs/types"
import { Button, RadioGroup, Select, Text, toast } from "@medusajs/ui"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdatePromotion } from "../../../../../hooks/api/promotions"
import { CreateCampaignFormFields } from "../../../../campaigns/common/components/create-campaign-form-fields"
import { CampaignDetails } from "./campaign-details"

type EditPromotionFormProps = {
  promotion: AdminPromotion
  campaigns: AdminCampaign[]
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
  campaigns: AdminCampaign[]
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
    <div className="flex flex-col gap-y-8">
      <Form.Field
        control={form.control}
        name="campaign_choice"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{t("promotions.fields.campaign")}</Form.Label>

              <Form.Control>
                <RadioGroup
                  className="grid grid-cols-1 gap-3"
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <RadioGroup.ChoiceBox
                    value={"none"}
                    label={t("promotions.form.campaign.none.title")}
                    description={t("promotions.form.campaign.none.description")}
                  />

                  <RadioGroup.ChoiceBox
                    value={"existing"}
                    label={t("promotions.form.campaign.existing.title")}
                    description={t(
                      "promotions.form.campaign.existing.description"
                    )}
                  />

                  {withNewCampaign && (
                    <RadioGroup.ChoiceBox
                      value={"new"}
                      label={t("promotions.form.campaign.new.title")}
                      description={t(
                        "promotions.form.campaign.new.description"
                      )}
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
                      {!campaigns.length && (
                        <div className="flex h-[120px] flex-col items-center justify-center gap-2 p-2">
                          <span className="txt-small text-ui-fg-subtle font-medium">
                            {t(
                              "promotions.form.campaign.existing.placeholder.title"
                            )}
                          </span>
                          <span className="txt-small text-ui-fg-muted">
                            {t(
                              "promotions.form.campaign.existing.placeholder.desc"
                            )}
                          </span>
                        </div>
                      )}
                      {campaigns.map((c) => (
                        <Select.Item key={c.id} value={c.id}>
                          {c.name?.toUpperCase()}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </Form.Control>

                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  <Trans
                    t={t}
                    i18nKey="campaigns.fields.campaign_id.hint"
                    components={[<br key="break" />]}
                  />
                </Text>
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

  const originalId = campaign?.id

  const form = useForm<zod.infer<typeof EditPromotionSchema>>({
    defaultValues: {
      campaign_id: campaign?.id,
      campaign_choice: campaign?.id ? "existing" : "none",
    },
    resolver: zodResolver(EditPromotionSchema),
  })

  const { setValue } = form

  const { mutateAsync, isPending } = useUpdatePromotion(promotion.id)
  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { campaign_id: data.campaign_id },
      {
        onSuccess: () => {
          toast.success(t("promotions.campaign.edit.successToast"))
          handleSuccess()
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  const watchCampaignChoice = useWatch({
    control: form.control,
    name: "campaign_choice",
  })

  useEffect(() => {
    if (watchCampaignChoice === "none") {
      setValue("campaign_id", null)
    }

    if (watchCampaignChoice === "existing") {
      setValue("campaign_id", originalId)
    }
  }, [watchCampaignChoice, setValue, originalId])

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="size-full overflow-auto">
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
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
