import { Heading, Input, Select, clx } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { HttpTypes } from "@zjedene-medusa/types"
import { Control } from "react-hook-form"
import { AddressSchema } from "../../../lib/schemas"
import { Form } from "../../common/form"
import { CountrySelect } from "../../inputs/country-select"
import { useDocumentDirection } from "../../../hooks/use-document-direction"

type AddressFieldValues = z.infer<typeof AddressSchema>

type AddressFormProps = {
  control: Control<AddressFieldValues>
  countries?: HttpTypes.AdminRegionCountry[]
  layout: "grid" | "stack"
}

export const AddressForm = ({
  control,
  countries,
  layout,
}: AddressFormProps) => {
  const { t } = useTranslation()
  const direction = useDocumentDirection()
  const style = clx("gap-4", {
    "flex flex-col": layout === "stack",
    "grid grid-cols-2": layout === "grid",
  })

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-4">
        <Heading level="h2">{t("addresses.contactHeading")}</Heading>
        <fieldset className={style}>
          <Form.Field
            control={control}
            name="first_name"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.firstName")}</Form.Label>
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
            name="last_name"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.lastName")}</Form.Label>
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
            name="company"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.company")}</Form.Label>
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
            name="phone"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.phone")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </fieldset>
      </div>
      <div className="flex flex-col gap-y-4">
        <Heading level="h2">{t("addresses.locationHeading")}</Heading>
        <fieldset className={style}>
          <Form.Field
            control={control}
            name="address_1"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.address")}</Form.Label>
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
            name="address_2"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.address2")}</Form.Label>
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
            name="city"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.city")}</Form.Label>
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
            name="postal_code"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.postalCode")}</Form.Label>
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
            name="province"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>{t("fields.province")}</Form.Label>
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
            name="country_code"
            render={({ field: { ref, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.country")}</Form.Label>
                  <Form.Control>
                    {countries ? (
                      <Select
                        dir={direction}
                        {...field}
                        onValueChange={onChange}
                      >
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {countries.map((country) => {
                            /**
                             * If a country does not have an ISO 2 code, it is not
                             * a valid country and should not be selectable.
                             */
                            if (!country.iso_2) {
                              return null
                            }

                            return (
                              <Select.Item
                                key={country.iso_2}
                                value={country.iso_2}
                              >
                                {country.display_name}
                              </Select.Item>
                            )
                          })}
                        </Select.Content>
                      </Select>
                    ) : (
                      <CountrySelect {...field} ref={ref} onChange={onChange} /> // When no countries are provided, use the country select component that has a built-in list of all countries
                    )}
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </fieldset>
      </div>
    </div>
  )
}
