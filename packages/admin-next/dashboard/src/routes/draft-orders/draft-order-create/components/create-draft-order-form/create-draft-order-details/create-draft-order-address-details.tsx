import { Region } from "@medusajs/medusa"
import { Checkbox, Heading, Input, Label, Select, Text } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Control } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { ConditionalTooltip } from "../../../../../../components/common/conditional-tooltip"
import { Form } from "../../../../../../components/common/form"
import { CreateDraftOrderSchema } from "../constants"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderAddressDetails = () => {
  const { t } = useTranslation()
  const { form, region, sameAsShipping, setSameAsShipping } =
    useCreateDraftOrder()

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-4">
        <Heading level="h2">{t("fields.address")}</Heading>
        <Text size="small" leading="compact" weight="plus">
          {t("addresses.shippingAddress.label")}
        </Text>
        <AddressFieldset
          field="shipping_address"
          region={region}
          control={form.control}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <Text size="small" leading="compact" weight="plus">
            {t("addresses.billingAddress.label")}
          </Text>
          <Label className="flex cursor-pointer items-center gap-x-2">
            <Checkbox
              checked={sameAsShipping}
              onCheckedChange={(checked) => setSameAsShipping(checked === true)}
            />
            {t("addresses.billingAddress.sameAsShipping")}
          </Label>
        </div>
        <Collapsible.Root open={!sameAsShipping}>
          <Collapsible.Content>
            <AddressFieldset
              field="billing_address"
              region={region}
              control={form.control}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  )
}

const AddressFieldset = ({
  field,
  control,
  region,
}: {
  field: "shipping_address" | "billing_address"
  region: Region | null
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
}) => {
  const { t } = useTranslation()

  return (
    <fieldset className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={control}
          name={`${field}.first_name`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.firstName")}
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
          control={control}
          name={`${field}.last_name`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.lastName")}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={control}
          name={`${field}.company`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.company")}
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
          control={control}
          name={`${field}.phone`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.phone")}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={control}
          name={`${field}.address_1`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.address")}
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
          control={control}
          name={`${field}.address_2`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.address2")}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={control}
          name={`${field}.city`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.city")}
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
          control={control}
          name={`${field}.postal_code`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.postalCode")}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={control}
          name={`${field}.province`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.province")}
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
          control={control}
          name={`${field}.country_code`}
          render={({
            field: { onChange, ref, disabled, ...field },
            fieldState: { error },
          }) => {
            return (
              <ConditionalTooltip
                showTooltip={!region}
                content={t("draftOrders.create.chooseRegionTooltip")}
              >
                <Form.Item>
                  <Form.Label className="text-ui-fg-subtle font-normal">
                    {t("fields.country")}
                  </Form.Label>
                  <Form.Control>
                    <Select
                      disabled={!region || disabled}
                      onValueChange={onChange}
                      {...field}
                    >
                      <Select.Trigger aria-invalid={!!error} ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {region?.countries.map((c) => (
                          <Select.Item key={c.iso_2} value={c.iso_2}>
                            {c.display_name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              </ConditionalTooltip>
            )
          }}
        />
      </div>
    </fieldset>
  )
}
