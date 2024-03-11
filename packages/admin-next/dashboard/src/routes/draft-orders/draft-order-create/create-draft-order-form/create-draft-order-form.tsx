import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Checkbox,
  Heading,
  Input,
  Label,
  Select,
  Text,
} from "@medusajs/ui"
import {
  useAdminCreateDraftOrder,
  useAdminRegions,
  useMedusa,
} from "medusa-react"
import { useState } from "react"
import { Control, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { Form } from "../../../../components/common/form"
import { SplitView } from "../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"
import { AddVariantDrawer } from "./add-product-drawer"

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

const ExistingItemSchema = z.object({
  product_title: z.string().optional(),
  variant_label: z.string().optional(),
  variant_id: z.string().min(1),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
})

const CustomItemSchema = z.object({
  title: z.string().min(1),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
})

const CreateDraftOrderSchema = z.object({
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
  existing_items: z.array(ExistingItemSchema).optional(),
  custom_items: z.array(CustomItemSchema).optional(),
})

type View = "existing_items" | "shipping_methods"

export const CreateDraftOrderForm = () => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const { t } = useTranslation()
  const { client } = useMedusa()
  const [, setSearchParams] = useSearchParams()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateDraftOrderSchema>>({
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
      existing_items: [],
      custom_items: [],
    },
    resolver: zodResolver(CreateDraftOrderSchema),
  })

  const {
    watchedExistingItems,
    watchedCustomItems,
    watchedRegionId,
    watchedCustomerId,
  } = useWatchItems(form.control)

  const { regions, isLoading: isLoadingRegions } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const currencyCode = regions?.find((r) => r.id === watchedRegionId)
    ?.currency_code

  const { mutateAsync, isLoading } = useAdminCreateDraftOrder()

  const handleSubmit = form.handleSubmit(async (values) => {
    let {
      shipping_address,
      billing_address,
      existing_items,
      custom_items,
      ...rest
    } = values

    if (!billing_address) {
      billing_address = shipping_address
    }

    await mutateAsync(
      {
        ...rest,
        shipping_address,
        billing_address,
        items: [],
      },
      {
        onSuccess: ({ draft_order }) => {
          handleSuccess(`../${draft_order.id}`)
        },
      }
    )
  })

  const handleOpenDrawer = (view: View) => {
    setView(view)
    setOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView(null)
      setSearchParams(
        {},
        {
          replace: true,
        }
      )
    }

    setOpen(open)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
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
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
          <SplitView open={open} onOpenChange={handleOpenChange}>
            <SplitView.Content>
              <div className="flex h-full w-full flex-col items-center overflow-y-auto p-16">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <fieldset className="grid grid-cols-2 gap-4">
                    <Form.Field
                      control={form.control}
                      name="region_id"
                      render={({
                        field: { ref, onChange, disabled, ...field },
                      }) => {
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
                    <div className="flex items-center justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleOpenDrawer("existing_items")}
                      >
                        Add existing product
                      </Button>
                    </div>
                  </fieldset>
                  <fieldset>
                    <Heading level="h2">{t("fields.shipping")}</Heading>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* <Form.Field control={form.control} name="shipping_methods" /> */}
                    </div>
                  </fieldset>
                  <div className="w-full h-px bg-ui-border-base" />
                  <div className="flex flex-col gap-y-4">
                    <Heading level="h2">{t("fields.address")}</Heading>
                    <Text size="small" leading="compact" weight="plus">
                      Shipping address
                    </Text>
                    <AddressFieldset
                      field="shipping_address"
                      control={form.control}
                    />
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                      <Text size="small" leading="compact" weight="plus">
                        Billing address
                      </Text>
                      <Label className="flex items-center gap-x-2 cursor-pointer">
                        <Checkbox
                          checked={sameAsShipping}
                          onCheckedChange={(checked) =>
                            setSameAsShipping(checked === true)
                          }
                        />
                        Same as shipping address
                      </Label>
                    </div>
                    {!sameAsShipping && (
                      <AddressFieldset
                        field="billing_address"
                        control={form.control}
                      />
                    )}
                  </div>
                </div>
              </div>
            </SplitView.Content>
            <SplitView.Drawer>
              <Drawer
                view={view}
                variants={{
                  onSave: () => {},
                  customerId: watchedCustomerId,
                  regionId: watchedRegionId,
                  currencyCode,
                }}
                shippingMethods={{
                  regionId: watchedRegionId,
                  onSave: () => {},
                }}
              />
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const Drawer = ({
  view,
  variants,
}: {
  view: View | null
  variants: {
    regionId?: string
    customerId?: string
    currencyCode?: string
    onSave: () => void
  }
  shippingMethods: {
    regionId: string
    onSave: () => void
  }
}) => {
  if (view === "existing_items") {
    return <AddVariantDrawer {...variants} />
  }

  return null
}

const useWatchItems = (
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
) => {
  const watchedExistingItems = useWatch({
    control,
    name: "existing_items",
    defaultValue: [],
  })

  const watchedCustomItems = useWatch({
    control,
    name: "custom_items",
    defaultValue: [],
  })

  const watchedRegionId = useWatch({
    control,
    name: "region_id",
  })

  const watchedCustomerId = useWatch({
    control,
    name: "customer_id",
  })

  return {
    watchedExistingItems,
    watchedCustomItems,
    watchedRegionId,
    watchedCustomerId,
  }
}

const AddressFieldset = ({
  field,
  control,
}: {
  field: "shipping_address" | "billing_address"
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
}) => {
  const { t } = useTranslation()

  return (
    <fieldset className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Form.Label className="text-ui-fg-subtle font-normal">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          render={({ field: { onChange, ref, ...field } }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.country")}
                </Form.Label>
                <Form.Control>
                  <Select onValueChange={onChange} {...field}>
                    <Select.Trigger ref={ref}>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content></Select.Content>
                  </Select>
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
    </fieldset>
  )
}
