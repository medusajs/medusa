import {
  clx,
  CurrencyInput,
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Select,
  Text,
} from "@medusajs/ui"
import { useEffect } from "react"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import { useStore } from "../../../../../hooks/api/store"
import { currencies, getCurrencySymbol } from "../../../../../lib/currencies"

export const CreateCampaignFormFields = ({ form, fieldScope = "" }) => {
  const { t } = useTranslation()
  const { store } = useStore()

  const watchValueType = useWatch({
    control: form.control,
    name: `${fieldScope}budget.type`,
  })

  const isTypeSpend = watchValueType === "spend"

  const currencyValue = useWatch({
    control: form.control,
    name: `${fieldScope}budget.currency_code`,
  })

  const watchPromotionCurrencyCode = useWatch({
    control: form.control,
    name: "application_method.currency_code",
  })

  useEffect(() => {
    form.setValue(`${fieldScope}budget.limit`, null)

    if (watchValueType === "spend") {
      form.setValue(`campaign.budget.currency_code`, watchPromotionCurrencyCode)
    }

    if (watchValueType === "usage") {
      form.setValue(`campaign.budget.currency_code`, null)
    }
  }, [watchValueType])

  if (watchPromotionCurrencyCode) {
    const formCampaignBudget = form.getValues().campaign?.budget
    const formCampaignCurrency = formCampaignBudget?.currency_code

    if (
      formCampaignBudget?.type === "spend" &&
      formCampaignCurrency !== watchPromotionCurrencyCode
    ) {
      form.setValue("campaign.budget.currency_code", watchPromotionCurrencyCode)
    }
  }

  return (
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
          name={`${fieldScope}name`}
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
          name={`${fieldScope}description`}
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
          name={`${fieldScope}campaign_identifier`}
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

        <div></div>

        <Form.Field
          control={form.control}
          name={`${fieldScope}starts_at`}
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
          name={`${fieldScope}ends_at`}
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

      <div>
        <Heading>{t("campaigns.budget.create.header")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("campaigns.budget.create.hint")}
        </Text>
      </div>

      <Form.Field
        control={form.control}
        name={`${fieldScope}budget.type`}
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
                    className={clx("basis-1/2 border", {
                      "border border-ui-border-interactive":
                        "spend" === field.value,
                    })}
                    value={"spend"}
                    label={t("campaigns.budget.type.spend.title")}
                    description={t("campaigns.budget.type.spend.description")}
                  />

                  <RadioGroup.ChoiceBox
                    className={clx("basis-1/2 border", {
                      "border border-ui-border-interactive":
                        "usage" === field.value,
                    })}
                    value={"usage"}
                    label={t("campaigns.budget.type.usage.title")}
                    description={t("campaigns.budget.type.usage.description")}
                  />
                </RadioGroup>
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isTypeSpend && (
          <Form.Field
            control={form.control}
            name={`${fieldScope}budget.currency_code`}
            render={({ field: { onChange, ref, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label
                    tooltip={
                      fieldScope.length
                        ? t("promotions.campaign_currency.tooltip")
                        : undefined
                    }
                  >
                    {t("fields.currency")}
                  </Form.Label>
                  <Form.Control>
                    <Select
                      {...field}
                      onValueChange={onChange}
                      disabled={!!fieldScope.length}
                    >
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
        )}

        <Form.Field
          control={form.control}
          name={`${fieldScope}budget.limit`}
          render={({ field: { onChange, value, ...field } }) => {
            return (
              <Form.Item className="basis-1/2">
                <Form.Label
                  tooltip={
                    currencyValue
                      ? undefined
                      : t("promotions.fields.amount.tooltip")
                  }
                >
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
                        currencyValue ? getCurrencySymbol(currencyValue) : ""
                      }
                      {...field}
                      value={value}
                      disabled={!currencyValue}
                    />
                  ) : (
                    <Input
                      type="number"
                      key="usage"
                      {...field}
                      min={0}
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
  )
}
