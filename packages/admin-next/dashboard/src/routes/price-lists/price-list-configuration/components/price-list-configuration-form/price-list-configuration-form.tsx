import { zodResolver } from "@hookform/resolvers/zod"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  DatePicker,
  Heading,
  IconButton,
  Text,
  clx,
  toast,
} from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { StackedDrawer } from "../../../../../components/modals/stacked-drawer"
import { useStackedModal } from "../../../../../components/modals/stacked-modal-provider"
import { useUpdatePriceList } from "../../../../../hooks/api/price-lists"
import { PriceListCustomerGroupRuleForm } from "../../../common/components/price-list-customer-group-rule-form"
import { PricingCustomerGroupsArrayType } from "../../../price-list-create/components/price-list-create-form/schema"

type PriceListConfigurationFormProps = {
  priceList: HttpTypes.AdminPriceList
  customerGroups: { id: string; name: string }[]
}

const PriceListConfigurationSchema = z.object({
  ends_at: z.date().nullable(),
  starts_at: z.date().nullable(),
  customer_group_id: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
})

const STACKED_MODAL_ID = "cg"

// TODO: Fix DatePickers once new version is merged.
export const PriceListConfigurationForm = ({
  priceList,
  customerGroups,
}: PriceListConfigurationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { setIsOpen } = useStackedModal()

  const form = useForm<z.infer<typeof PriceListConfigurationSchema>>({
    defaultValues: {
      ends_at: priceList.ends_at ? new Date(priceList.ends_at) : null,
      starts_at: priceList.starts_at ? new Date(priceList.starts_at) : null,
      customer_group_id: customerGroups,
    },
    resolver: zodResolver(PriceListConfigurationSchema),
  })

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "customer_group_id",
    keyName: "cg_id",
  })

  const handleAddCustomerGroup = (groups: PricingCustomerGroupsArrayType) => {
    if (!groups.length) {
      form.setValue("customer_group_id", [])
      setIsOpen(STACKED_MODAL_ID, false)
      return
    }

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
    setIsOpen(STACKED_MODAL_ID, false)
  }

  const { mutateAsync } = useUpdatePriceList(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        starts_at: values.starts_at?.toISOString() || null,
        ends_at: values.ends_at?.toISOString() || null,
        rules: {
          customer_group_id: values.customer_group_id.map((group) => group.id),
        },
      },
      {
        onSuccess: () => {
          toast.success(t("priceLists.configuration.edit.successToast"))
          handleSuccess()
        },
        onError: (error) => toast.error(error.message),
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <RouteDrawer.Description className="sr-only">
        {t("priceLists.configuration.edit.description")}
      </RouteDrawer.Description>
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <Form.Field
            control={form.control}
            name="starts_at"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col">
                      <Form.Label optional>
                        {t("priceLists.fields.startsAt.label")}
                      </Form.Label>
                      <Form.Hint>
                        {t("priceLists.fields.startsAt.hint")}
                      </Form.Hint>
                    </div>
                    <Form.Control>
                      {/* TODO: Add timepicker see CORE-2382 */}
                      <DatePicker
                        mode="single"
                        {...field}
                        onChange={(value) => onChange(value ?? null)}
                        value={value ?? undefined}
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
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col">
                      <Form.Label optional>
                        {t("priceLists.fields.endsAt.label")}
                      </Form.Label>
                      <Form.Hint>
                        {t("priceLists.fields.endsAt.hint")}
                      </Form.Hint>
                    </div>
                    <Form.Control>
                      <DatePicker
                        mode="single"
                        {...field}
                        onChange={(value) => onChange(value ?? null)}
                        value={value ?? undefined}
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
            name="customer_group_id"
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
                          {t(
                            "priceLists.fields.customerAvailability.attribute"
                          )}
                        </div>
                        <div className="bg-ui-bg-field shadow-borders-base txt-compact-small rounded-md px-2 py-1.5">
                          {t("operators.in")}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-1.5">
                        <StackedDrawer id={STACKED_MODAL_ID}>
                          <StackedDrawer.Trigger asChild>
                            <button
                              type="button"
                              className="bg-ui-bg-field shadow-borders-base txt-compact-small text-ui-fg-muted flex flex-1 items-center gap-x-2 rounded-md px-2 py-1.5"
                            >
                              <MagnifyingGlass />
                              {t(
                                "priceLists.fields.customerAvailability.placeholder"
                              )}
                            </button>
                          </StackedDrawer.Trigger>
                          <StackedDrawer.Trigger asChild>
                            <Button variant="secondary">
                              {t("actions.browse")}
                            </Button>
                          </StackedDrawer.Trigger>
                          <StackedDrawer.Content>
                            <StackedDrawer.Header>
                              <StackedDrawer.Title asChild>
                                <Heading>
                                  {t(
                                    "priceLists.fields.customerAvailability.header"
                                  )}
                                </Heading>
                              </StackedDrawer.Title>
                              <StackedDrawer.Description className="sr-only">
                                {t(
                                  "priceLists.fields.customerAvailability.hint"
                                )}
                              </StackedDrawer.Description>
                            </StackedDrawer.Header>
                            <PriceListCustomerGroupRuleForm
                              type="drawer"
                              setState={handleAddCustomerGroup}
                              state={fields}
                            />
                          </StackedDrawer.Content>
                        </StackedDrawer>
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
                                    <XMark />
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
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
