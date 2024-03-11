import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Select, Text } from "@medusajs/ui"
import {
  useAdminCreateDraftOrder,
  useAdminRegions,
  useAdminShippingOptions,
} from "medusa-react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"

const AddressPayload = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address_1: z.string().min(1),
  address_2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().optional(),
  postal_code: z.string().min(1),
  country_code: z.string().min(1),
  phone: z.string().optional(),
  company: z.string().optional(),
})

const CreateDraftOrderFormSchema = z.object({
  email: z.string().email(),
  region_id: z.string().min(1),
  customer_id: z.string().optional(),
  shipping_methods: z.array(
    z.object({
      option_id: z.string().min(1),
      price: z.number().optional(),
    })
  ),
  shipping_address: AddressPayload,
  billing_address: AddressPayload.nullable(),
})

export const CreateDraftOrderForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateDraftOrderFormSchema>>({
    defaultValues: {
      email: "",
      region_id: "",
      shipping_methods: [],
      shipping_address: {
        address_1: "",
        address_2: "",
        city: "",
        company: "",
        country_code: "",
        first_name: "",
        last_name: "",
        phone: "",
        postal_code: "",
        province: "",
      },
      billing_address: null,
    },
    resolver: zodResolver(CreateDraftOrderFormSchema),
  })

  const watchRegionId = useWatch({
    control: form.control,
    name: "region_id",
  })

  const { regions, isLoading: isLoadingRegions } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const { shipping_options, isLoading: isLoadingShippingOptions } =
    useAdminShippingOptions(
      {
        region_id: watchRegionId,
        limit: 1000,
        fields: "id,name,amount,includes_tax",
      },
      {
        enabled: !!watchRegionId,
      }
    )

  const { mutateAsync, isLoading } = useAdminCreateDraftOrder()

  const handleSubmit = form.handleSubmit(async (values) => {
    let { shipping_address, billing_address, ...rest } = values

    if (!billing_address) {
      billing_address = shipping_address
    }

    await mutateAsync(
      {
        ...rest,
        shipping_address,
        billing_address,
      },
      {
        onSuccess: ({ draft_order }) => {
          handleSuccess(`../${draft_order.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit}>
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body>
          <div className="flex flex-col gap-y-8">
            <fieldset className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="region_id"
                render={({ field: { ref, onChange, disabled, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="!h2-core">
                        {t("fields.region")}
                      </Form.Label>
                      <Form.Hint>Choose region</Form.Hint>
                      <Form.Control>
                        <Select
                          {...field}
                          onValueChange={onChange}
                          disabled={isLoadingRegions || disabled}
                        >
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {regions?.map((r) => (
                              <Select.Item key={r.id} value={r.id}>
                                {r.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
            </fieldset>
            <fieldset className="flex flex-col gap-y-4">
              <Heading level="h2">{t("fields.items")}</Heading>
              <Text></Text>
            </fieldset>
            <fieldset>
              <Heading level="h2">{t("fields.shipping")}</Heading>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* <Form.Field control={form.control} name="shipping_methods" /> */}
              </div>
            </fieldset>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
