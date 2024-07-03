import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Select, Text, clx, toast } from "@medusajs/ui"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { MagnifyingGlass } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { PercentageInput } from "../../../../../components/inputs/percentage-input"
import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../../components/modals"
import { useCreateTaxRate } from "../../../../../hooks/api/tax-rates"
import { RuleReferenceType } from "../../../common/constants"
import { Reference, TargetSchema } from "../../../common/schemas"
import { createTaxRulePayload } from "../../../common/utils"
import { TargetForm } from "./target-form"
import { TargetItem } from "./target-item"

const TaxRegionCreateTaxOverrideSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  rate: z
    .object({
      float: z.number().optional(),
      value: z.string().optional(),
    })
    .optional(),
  is_combinable: z.boolean().optional(),
  target: TargetSchema,
})

type TaxRegionCreateTaxOverrideFormProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

const STACKED_MODAL_ID = "tr"

export const TaxRegionCreateTaxOverrideForm = ({
  taxRegion,
}: TaxRegionCreateTaxOverrideFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { setIsOpen } = useStackedModal()

  const form = useForm<z.infer<typeof TaxRegionCreateTaxOverrideSchema>>({
    defaultValues: {
      name: "",
      code: "",
      is_combinable: false,
      rate: {
        value: "",
      },
      target: {
        reference_type: RuleReferenceType.PRODUCT,
        references: [],
      },
    },
    resolver: zodResolver(TaxRegionCreateTaxOverrideSchema),
  })

  const { mutateAsync, isPending } = useCreateTaxRate()

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(
      {
        name: values.name,
        tax_region_id: taxRegion.id,
        rate: values.rate?.float,
        code: values.code,
        is_combinable: values.is_combinable,
        rules: createTaxRulePayload(values.target),
        is_default: false,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "target.references",
    keyName: "ref_id",
  })

  const referenceTypeOptions = [
    {
      value: RuleReferenceType.PRODUCT,
      label: t("taxRegions.fields.target.options.product"),
    },
    {
      value: RuleReferenceType.PRODUCT_COLLECTION,
      label: t("taxRegions.fields.target.options.productCollection"),
    },
    {
      value: RuleReferenceType.PRODUCT_TAG,
      label: t("taxRegions.fields.target.options.productTag"),
    },
    {
      value: RuleReferenceType.PRODUCT_TYPE,
      label: t("taxRegions.fields.target.options.productType"),
    },
    {
      value: RuleReferenceType.CUSTOMER_GROUP,
      label: t("taxRegions.fields.target.options.customerGroup"),
    },
  ]

  const selectedReferenceType = useWatch({
    control: form.control,
    name: "target.reference_type",
  })

  const searchPlaceholder = {
    [RuleReferenceType.PRODUCT]: t(
      "taxRegions.fields.target.placeholders.product"
    ),
    [RuleReferenceType.PRODUCT_COLLECTION]: t(
      "taxRegions.fields.target.placeholders.productCollection"
    ),
    [RuleReferenceType.PRODUCT_TAG]: t(
      "taxRegions.fields.target.placeholders.productTag"
    ),
    [RuleReferenceType.PRODUCT_TYPE]: t(
      "taxRegions.fields.target.placeholders.productType"
    ),
    [RuleReferenceType.CUSTOMER_GROUP]: t(
      "taxRegions.fields.target.placeholders.customerGroup"
    ),
  }[selectedReferenceType]

  const setFields = (references: Reference[]) => {
    if (!references.length) {
      form.setValue("target.references", [])
      setIsOpen(STACKED_MODAL_ID, false)
      return
    }

    const newIds = references.map((reference) => reference.value)

    const fieldsToAdd = references.filter(
      (reference) => !fields.some((field) => field.value === reference.value)
    )

    for (const field of fields) {
      if (!newIds.includes(field.value)) {
        remove(fields.indexOf(field))
      }
    }

    append(fieldsToAdd)
    setIsOpen(STACKED_MODAL_ID, false)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading className="capitalize">
                  {t("taxRegions.taxOverrides.create.header")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("taxRegions.taxOverrides.create.hint")}
                </Text>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-y-4">
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
                      name="rate"
                      render={({ field: { value, onChange, ...field } }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t("taxRegions.fields.taxRate")}
                            </Form.Label>
                            <Form.Control>
                              <PercentageInput
                                {...field}
                                placeholder="0.00"
                                value={value?.value}
                                onValueChange={(value, _name, values) =>
                                  onChange({
                                    value: value,
                                    float: values?.float,
                                  })
                                }
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                    <Form.Field
                      control={form.control}
                      name="code"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("taxRegions.fields.taxCode")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
              <SwitchBox
                control={form.control}
                name="is_combinable"
                label={t("taxRegions.fields.isCombinable.label")}
                description={t("taxRegions.fields.isCombinable.hint")}
              />
              <div>
                <Form.Field
                  control={form.control}
                  name="target"
                  render={({
                    field: { value: _value, onChange: _onChange, ...field },
                  }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("taxRegions.fields.target.label")}
                        </Form.Label>
                        <div
                          className={clx(
                            "bg-ui-bg-component shadow-elevation-card-rest transition-fg grid gap-1.5 rounded-xl py-1.5",
                            "aria-[invalid='true']:shadow-borders-error"
                          )}
                          role="application"
                          {...field}
                        >
                          <div className="text-ui-fg-subtle grid gap-1.5 px-1.5 md:grid-cols-2">
                            <Form.Field
                              control={form.control}
                              name="target.reference_type"
                              render={({
                                field: { ref, onChange, ...field },
                              }) => {
                                return (
                                  <Select
                                    {...field}
                                    onValueChange={(values) => {
                                      form.setValue("target.references", [])
                                      onChange(values)
                                    }}
                                  >
                                    <Select.Trigger
                                      className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                                      ref={ref}
                                    >
                                      <Select.Value />
                                    </Select.Trigger>
                                    <Select.Content>
                                      {referenceTypeOptions.map((option) => {
                                        return (
                                          <Select.Item
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </Select.Item>
                                        )
                                      })}
                                    </Select.Content>
                                  </Select>
                                )
                              }}
                            />
                            <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                              {t("taxRegions.fields.target.operators.in")}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 px-1.5">
                            <StackedFocusModal id={STACKED_MODAL_ID}>
                              <StackedFocusModal.Trigger asChild>
                                <button
                                  type="button"
                                  className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover shadow-borders-base txt-compact-small text-ui-fg-muted transition-fg focus-visible:shadow-borders-interactive-with-active flex flex-1 items-center gap-x-2 rounded-md px-2 py-1.5 outline-none"
                                >
                                  <MagnifyingGlass />
                                  {searchPlaceholder}
                                </button>
                              </StackedFocusModal.Trigger>
                              <StackedFocusModal.Trigger asChild>
                                <Button variant="secondary">
                                  {t("actions.browse")}
                                </Button>
                              </StackedFocusModal.Trigger>
                              <StackedFocusModal.Content>
                                <StackedFocusModal.Header />
                                <TargetForm
                                  type="focus"
                                  referenceType={selectedReferenceType}
                                  state={fields}
                                  setState={setFields}
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
                                    <TargetItem
                                      key={field.ref_id}
                                      index={index}
                                      label={field.label}
                                      onRemove={remove}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
