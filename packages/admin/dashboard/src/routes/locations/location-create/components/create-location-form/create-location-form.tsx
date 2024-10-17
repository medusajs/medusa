import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateStockLocation } from "../../../../../hooks/api/stock-locations"

const CreateLocationSchema = zod.object({
  name: zod.string().min(1),
  address: zod.object({
    address_1: zod.string().min(1),
    address_2: zod.string().optional(),
    country_code: zod.string().min(2).max(2),
    city: zod.string().optional(),
    postal_code: zod.string().optional(),
    province: zod.string().optional(),
    company: zod.string().optional(),
    phone: zod.string().optional(),
  }),
})

export const CreateLocationForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateLocationSchema>>({
    defaultValues: {
      name: "",
      address: {
        address_1: "",
        address_2: "",
        city: "",
        company: "",
        country_code: "",
        phone: "",
        postal_code: "",
        province: "",
      },
    },
    resolver: zodResolver(CreateLocationSchema),
  })

  const { mutateAsync, isPending } = useCreateStockLocation()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        address: values.address,
      },
      {
        onSuccess: ({ stock_location }) => {
          toast.success(t("locations.toast.create"))

          handleSuccess(`/settings/locations/${stock_location.id}`)
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
                  {t("stockLocations.create.header")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("stockLocations.create.hint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.name")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
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
                  name="address.address_1"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.address")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.address_2"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.address2")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.postal_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>
                          {t("fields.postalCode")}
                        </Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.city"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.city")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.country_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.country")}</Form.Label>
                        <Form.Control>
                          <CountrySelect {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.province"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.state")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.company"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.company")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address.phone"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t("fields.phone")}</Form.Label>
                        <Form.Control>
                          <Input size="small" {...field} />
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
