import { MagnifyingGlass, XMarkMini } from "@medusajs/icons"
import {
  Button,
  DatePicker,
  Heading,
  IconButton,
  Input,
  RadioGroup,
  Select,
  Text,
  Textarea,
  clx,
} from "@medusajs/ui"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { StackedFocusModal } from "../../../../../components/modals/stacked-focus-modal"
import { useStackedModal } from "../../../../../components/modals/stacked-modal-provider"
import { PriceListCustomerGroupRuleForm } from "../../../common/components/price-list-customer-group-rule-form"
import type {
  PricingCreateSchemaType,
  PricingCustomerGroupsArrayType,
} from "./schema"

type PriceListDetailsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

export const PriceListDetailsForm = ({ form }: PriceListDetailsFormProps) => {
  const { t } = useTranslation()

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "rules.customer_group_id",
    keyName: "cg_id",
  })

  const { setIsOpen } = useStackedModal()

  const handleAddCustomerGroup = (groups: PricingCustomerGroupsArrayType) => {
    const newIds = groups.map((group) => group.id)

    const fieldsToAdd = groups.filter(
      (group) => !fields.some((field) => field.id === group.id)
    )

    for (const field of fields) {
      if (!newIds.includes(field.id)) {
        remove(fields.indexOf(field))
      }
    }

    append(fieldsToAdd)
    setIsOpen("cg", false)
  }

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-8 py-16">
        <div>
          <Heading>{t("priceLists.create.header")}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {t("priceLists.create.subheader")}
          </Text>
        </div>
        <Form.Field
          control={form.control}
          name="type"
          render={({ field: { onChange, ...rest } }) => {
            return (
              <Form.Item>
                <div className="flex flex-col gap-y-4">
                  <div>
                    <Form.Label>{t("priceLists.fields.type.label")}</Form.Label>
                    <Form.Hint>{t("priceLists.fields.type.hint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <RadioGroup
                      onValueChange={onChange}
                      {...rest}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <RadioGroup.ChoiceBox
                        value={"sale"}
                        label={t("priceLists.fields.type.options.sale.label")}
                        description={t(
                          "priceLists.fields.type.options.sale.description"
                        )}
                      />
                      <RadioGroup.ChoiceBox
                        value={"override"}
                        label={t(
                          "priceLists.fields.type.options.override.label"
                        )}
                        description={t(
                          "priceLists.fields.type.options.override.description"
                        )}
                      />
                    </RadioGroup>
                  </Form.Control>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1  gap-4 md:grid-cols-2">
            <Form.Field
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.title")}</Form.Label>
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
              name="status"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {t("priceLists.fields.status.label")}
                    </Form.Label>
                    <Form.Control>
                      <Select {...field} onValueChange={onChange}>
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="active">
                            {t("priceLists.fields.status.options.active")}
                          </Select.Item>
                          <Select.Item value="draft">
                            {t("priceLists.fields.status.options.draft")}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.description")}</Form.Label>
                  <Form.Control>
                    <Textarea {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>
        <Divider />
        <Form.Field
          control={form.control}
          name="starts_at"
          render={({ field }) => {
            return (
              <Form.Item>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-col">
                    <Form.Label optional>
                      {t("priceLists.fields.startsAt.label")}
                    </Form.Label>
                    <Form.Hint>
                      {t("priceLists.fields.startsAt.hint")}
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    <DatePicker
                      granularity="minute"
                      shouldCloseOnSelect={false}
                      {...field}
                    />
                  </Form.Control>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Divider />
        <Form.Field
          control={form.control}
          name="ends_at"
          render={({ field }) => {
            return (
              <Form.Item>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-col">
                    <Form.Label optional>
                      {t("priceLists.fields.endsAt.label")}
                    </Form.Label>
                    <Form.Hint>{t("priceLists.fields.endsAt.hint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <DatePicker
                      granularity="minute"
                      shouldCloseOnSelect={false}
                      {...field}
                    />
                  </Form.Control>
                </div>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Divider />
        <Form.Field
          control={form.control}
          name="rules.customer_group_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <div>
                  <Form.Label optional>
                    {t("priceLists.fields.customerAvailability.label")}
                  </Form.Label>
                  <Form.Hint>
                    {t("priceLists.fields.customerAvailability.hint")}
                  </Form.Hint>
                </div>
                <Form.Control>
                  <div
                    className={clx(
                      "bg-ui-bg-component shadow-elevation-card-rest transition-fg grid gap-1.5 rounded-xl py-1.5",
                      "aria-[invalid='true']:shadow-borders-error"
                    )}
                    role="application"
                    ref={field.ref}
                  >
                    <div className="text-ui-fg-subtle grid gap-1.5 px-1.5 md:grid-cols-2">
                      <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                        {t("priceLists.fields.customerAvailability.attribute")}
                      </div>
                      <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                        {t("operators.in")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-1.5">
                      <StackedFocusModal id="cg">
                        <StackedFocusModal.Trigger asChild>
                          <button
                            type="button"
                            className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover shadow-borders-base txt-compact-small text-ui-fg-muted transition-fg focus-visible:shadow-borders-interactive-with-active flex flex-1 items-center gap-x-2 rounded-md px-2 py-1.5 outline-none"
                          >
                            <MagnifyingGlass />
                            {t(
                              "priceLists.fields.customerAvailability.placeholder"
                            )}
                          </button>
                        </StackedFocusModal.Trigger>
                        <StackedFocusModal.Trigger asChild>
                          <Button variant="secondary">
                            {t("actions.browse")}
                          </Button>
                        </StackedFocusModal.Trigger>
                        <StackedFocusModal.Content>
                          <StackedFocusModal.Header />
                          <PriceListCustomerGroupRuleForm
                            state={fields}
                            setState={handleAddCustomerGroup}
                            type="focus"
                          />
                        </StackedFocusModal.Content>
                      </StackedFocusModal>
                    </div>
                    {fields.length > 0 ? (
                      <div className="flex flex-col gap-y-1.5">
                        <Divider variant="dashed" />
                        <div className="flex flex-col gap-y-1.5 px-1.5">
                          {fields.map((field, index) => {
                            return (
                              <div
                                key={field.cg_id}
                                className="bg-ui-bg-field-component shadow-borders-base flex items-center justify-between gap-2 rounded-md px-2 py-0.5"
                              >
                                <Text size="small" leading="compact">
                                  {field.name}
                                </Text>
                                <IconButton
                                  size="small"
                                  variant="transparent"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  <XMarkMini />
                                </IconButton>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
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
