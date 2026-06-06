import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast } from "@zjedene-medusa/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateCustomerAddress } from "../../../../../hooks/api/customers"

const CreateCustomerAddressSchema = zod.object({
  address_name: zod.string().min(1),
  address_1: zod.string().min(1),
  address_2: zod.string().optional(),
  country_code: zod.string().min(2).max(2),
  city: zod.string().optional(),
  postal_code: zod.string().optional(),
  province: zod.string().optional(),
  company: zod.string().optional(),
  phone: zod.string().optional(),
})

export const CreateCustomerAddressForm = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateCustomerAddressSchema>>({
    defaultValues: {
      address_name: "",
      address_1: "",
      address_2: "",
      city: "",
      company: "",
      country_code: "",
      phone: "",
      postal_code: "",
      province: "",
    },
    resolver: zodResolver(CreateCustomerAddressSchema),
  })

  const { mutateAsync, isPending } = useCreateCustomerAddress(id!)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        address_name: values.address_name,
        address_1: values.address_1,
        address_2: values.address_2,
        country_code: values.country_code,
        city: values.city,
        postal_code: values.postal_code,
        province: values.province,
        company: values.company,
        phone: values.phone,
      },
      {
        onSuccess: () => {
          toast.success(t("customers.addresses.create.successToast"))

          handleSuccess(`/customers/${id}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading className="capitalize">
                  {t("customers.addresses.create.header")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("customers.addresses.create.hint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="address_name"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("customers.addresses.fields.addressName")}
                        </Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="address_name"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="address_1"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.address")}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="address_1"
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
                  name="address_2"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.address2")}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="address_2"
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
                  name="postal_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>
                          {t("fields.postalCode")}
                        </Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="postal_code"
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
                  name="city"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.city")}</Form.Label>
                        <Form.Control>
                          <Input size="small" autoComplete="city" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="country_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.country")}</Form.Label>
                        <Form.Control>
                          <CountrySelect
                            autoComplete="country_code"
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
                  name="province"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.state")}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="province"
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
                  name="company"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.company")}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="company"
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
                  name="phone"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.phone")}</Form.Label>
                        <Form.Control>
                          <Input size="small" autoComplete="phone" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
