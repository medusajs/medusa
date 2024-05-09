import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  clx,
  CurrencyInput,
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Select,
  Text,
  toast,
} from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateCampaign } from "../../../../../hooks/api/campaigns"
import { currencies, getCurrencySymbol } from "../../../../../lib/currencies"

const CreateCampaignSchema = zod.object({
  name: zod.string(),
  description: zod.string().optional(),
  currency: zod.string(),
  campaign_identifier: zod.string(),
  starts_at: zod.date().optional(),
  ends_at: zod.date().optional(),
  budget: zod.object({
    limit: zod.number().min(0),
    type: zod.enum(["spend", "usage"]).optional(),
  }),
})

export const CreateCampaignForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync, isPending } = useCreateCampaign()

  const form = useForm<zod.infer<typeof CreateCampaignSchema>>({
    defaultValues: {
      name: "",
      description: "",
      currency: "",
      campaign_identifier: "",
      starts_at: undefined,
      ends_at: undefined,
      budget: {
        type: "spend",
        limit: undefined,
      },
    },
    resolver: zodResolver(CreateCampaignSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
        description: data.description,
        currency: data.currency,
        campaign_identifier: data.campaign_identifier,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        budget: {
          type: data.budget.type,
          limit: data.budget.limit,
        },
      },
      {
        onSuccess: ({ campaign }) => {
          toast.success(t("general.success"), {
            description: t("campaigns.create.successToast", {
              name: campaign.name,
            }),
            dismissLabel: t("actions.close"),
          })
          handleSuccess(`/campaigns/${campaign.id}`)
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
    name: "budget.type",
  })

  const isTypeSpend = watchValueType === "spend"

  const currencyValue = useWatch({
    control: form.control,
    name: "currency",
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit}>
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>

            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("campaigns.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("campaigns.create.hint")}
              </Text>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      <Form.Label>
                        {t("campaigns.fields.identifier")}
                      </Form.Label>

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
                            {Object.values(currencies).map((currency) => (
                              <Select.Item
                                value={currency.code}
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
                render={({
                  field: { value, onChange, ref: _ref, ...field },
                }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("campaigns.fields.start_date")}
                      </Form.Label>

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
                render={({
                  field: { value, onChange, ref: _ref, ...field },
                }) => {
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

            <div>
              <Heading>{t("campaigns.budget.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("campaigns.budget.create.hint")}
              </Text>
            </div>

            <Form.Field
              control={form.control}
              name="budget.type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("campaigns.budget.fields.type")}</Form.Label>

                    <Form.Control>
                      <RadioGroup
                        className="flex gap-y-3"
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="budget.limit"
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
                            code={currencyValue}
                            symbol={
                              currencyValue
                                ? getCurrencySymbol(currencyValue)
                                : ""
                            }
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
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
