import {
  DatePicker,
  Heading,
  Input,
  RadioGroup,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import type { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SplitView } from "../../../../../components/layout/split-view"
import type { PricingCreateSchemaType } from "./schema"

type PricingDetailsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

export const PricingDetailsForm = ({ form }: PricingDetailsFormProps) => {
  const { t } = useTranslation()

  return (
    <SplitView>
      <SplitView.Content>
        <div className="flex flex-1 flex-col items-center overflow-y-auto">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
            <div>
              <Heading>Create Price List</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Create a new price list to manage the prices of your products.
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
                        <Form.Label>{t("fields.type")}</Form.Label>
                        <Form.Hint>
                          Choose the type of price list you want to create.
                        </Form.Hint>
                      </div>
                      <Form.Control>
                        <RadioGroup
                          onValueChange={onChange}
                          {...rest}
                          className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                          <RadioGroup.ChoiceBox
                            value={"sale"}
                            label="Sale"
                            description="Choose this if you are creating a sale"
                          />
                          <RadioGroup.ChoiceBox
                            value={"override"}
                            label="Override"
                            description="Choose this if you are creating an override"
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
              <div className="grid grid-cols-2 gap-4">
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
              render={({ field: { value, onChange, ...rest } }) => {
                const handleSwitchChange = (checked: boolean) => {
                  if (!checked) {
                    onChange(null)
                    return
                  }

                  const now = new Date()

                  onChange(now)
                }

                return (
                  <Form.Item>
                    <Collapsible.Root
                      open={!!value}
                      onOpenChange={handleSwitchChange}
                    >
                      <div className="grid grid-cols-[1fr_32px] gap-4">
                        <div>
                          <Text size="small" leading="compact" weight="plus">
                            Does the price list have a start date?
                          </Text>
                          <Text size="small" className="text-ui-fg-subtle">
                            Schedule the price list to activate in the future.
                          </Text>
                        </div>
                        <Collapsible.Trigger asChild>
                          <Switch checked={!!value} />
                        </Collapsible.Trigger>
                      </div>
                      <Collapsible.Content>
                        <div className="flex flex-col gap-y-2 pt-4">
                          <Form.Label className="!txt-small text-ui-fg-subtle">
                            {t("fields.startDate")}
                          </Form.Label>
                          <Form.Control>
                            <DatePicker
                              value={value || undefined}
                              onChange={onChange}
                              {...rest}
                            />
                          </Form.Control>
                        </div>
                      </Collapsible.Content>
                      <Form.ErrorMessage />
                    </Collapsible.Root>
                  </Form.Item>
                )
              }}
            />
            <Divider />
            <Form.Field
              control={form.control}
              name="ends_at"
              render={({ field: { value, onChange, ...rest } }) => {
                const handleSwitchChange = (checked: boolean) => {
                  if (!checked) {
                    onChange(null)
                    return
                  }

                  const inAWeek = new Date(
                    new Date().setDate(new Date().getDate() + 7)
                  )

                  onChange(inAWeek)
                }

                return (
                  <Form.Item>
                    <Collapsible.Root
                      open={!!value}
                      onOpenChange={handleSwitchChange}
                    >
                      <div className="grid grid-cols-[1fr_32px] gap-4">
                        <div>
                          <Text size="small" leading="compact" weight="plus">
                            Does the price list have an end date?
                          </Text>
                          <Text size="small" className="text-ui-fg-subtle">
                            Schedule the price list to deactivate in the future.
                          </Text>
                        </div>
                        <Collapsible.Trigger asChild>
                          <Switch checked={!!value} />
                        </Collapsible.Trigger>
                      </div>
                      <Collapsible.Content>
                        <div className="flex flex-col gap-y-2 pt-4">
                          <Form.Label className="!txt-small text-ui-fg-subtle">
                            {t("fields.endDate")}
                          </Form.Label>
                          <Form.Control>
                            <DatePicker
                              value={value || undefined}
                              onChange={onChange}
                              {...rest}
                            />
                          </Form.Control>
                        </div>
                      </Collapsible.Content>
                      <Form.ErrorMessage />
                    </Collapsible.Root>
                  </Form.Item>
                )
              }}
            />
            <Divider />
            <div></div>
          </div>
        </div>
      </SplitView.Content>
      <SplitView.Drawer>
        <CustomerGroupDrawer />
      </SplitView.Drawer>
    </SplitView>
  )
}

const CustomerGroupDrawer = () => {
  return <div className="flex size-full flex-col overflow-hidden"></div>
}
