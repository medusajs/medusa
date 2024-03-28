import React from "react"
import { useTranslation } from "react-i18next"
import { Control } from "react-hook-form"
import { Region } from "@medusajs/medusa"
import { Button, Heading, Input, Select } from "@medusajs/ui"
import { z } from "zod"

import { Form } from "../../../../../../components/common/form"
import { CreateReturnSchema } from "../schema"
import { SplitView } from "../../../../../../components/layout/split-view"

type OrderCreateClaimShippingDetailsProps = {
  region: Region
  control: Control<z.infer<typeof CreateReturnSchema>>
}

export function OrderCreateClaimShippingDetails({
  control,
  region,
}: OrderCreateClaimShippingDetailsProps) {
  const { t } = useTranslation()

  return (
    <fieldset className="flex size-full w-full flex-col justify-between px-6 py-8">
      <div className="flex flex-col justify-between gap-y-4">
        <Heading>{t("addresses.shippingAddress.header")}</Heading>
        <div className="flex flex-col gap-y-4">
          <Form.Field
            control={control}
            name={`shipping_address.first_name`}
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
            name={`shipping_address.last_name`}
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
            name={`shipping_address.company`}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label
                    optional
                    className="text-ui-fg-subtle font-normal"
                  >
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
            name={`shipping_address.phone`}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label
                    optional
                    className="text-ui-fg-subtle font-normal"
                  >
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
            name={`shipping_address.address_1`}
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
            name={`shipping_address.address_2`}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label
                    optional
                    className="text-ui-fg-subtle font-normal"
                  >
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
            name={`shipping_address.city`}
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
            name={`shipping_address.postal_code`}
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
            name={`shipping_address.province`}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label
                    optional
                    className="text-ui-fg-subtle font-normal"
                  >
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
            name={`shipping_address.country_code`}
            render={({
              field: { onChange, ref, disabled, ...field },
              fieldState: { error },
            }) => {
              return (
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
              )
            }}
          />
        </div>
      </div>
      <SplitView.Close type="button" asChild>
        <Button className="self-end" variant="secondary" size="small">
          {t("general.close")}
        </Button>
      </SplitView.Close>
    </fieldset>
  )
}
