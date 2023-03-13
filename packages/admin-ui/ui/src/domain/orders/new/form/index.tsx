import { Product, Region, ShippingOption } from "@medusajs/medusa"
import {
  useAdminRegion,
  useAdminShippingOption,
  useAdminShippingOptions,
  useMedusa,
} from "medusa-react"
import { createContext, ReactNode, useContext, useEffect, useMemo } from "react"
import {
  FormProvider,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { AddressPayload } from "../../../../components/templates/address-form"
import { Option } from "../../../../types/shared"
import { extractUnitPrice } from "../../../../utils/prices"

export type NewOrderForm = {
  shipping_address: AddressPayload
  shipping_address_id?: string
  billing_address: AddressPayload
  billing_address_id?: string
  region: Option
  items: {
    quantity: number
    variant_id?: string
    title: string
    unit_price: number
    thumbnail?: string | null
    product_title?: string
  }[]
  shipping_option: Option
  customer_id?: Option | null
  email: string
  custom_shipping_price?: number
  discount_code?: string
  same_as_shipping?: boolean
}

type NewOrderContextValue = {
  validCountries: Option[]
  region: Region | undefined
  selectedShippingOption: ShippingOption | undefined
  items: UseFieldArrayReturn<NewOrderForm, "items", "id">
  shippingOptions: ShippingOption[]
}

const NewOrderContext = createContext<NewOrderContextValue | null>(null)

const NewOrderFormProvider = ({ children }: { children?: ReactNode }) => {
  const form = useForm<NewOrderForm>({
    defaultValues: {
      items: [],
      billing_address: undefined,
      shipping_address: undefined,
    },
  })

  const items = useFieldArray({
    control: form.control,
    name: "items",
  })

  const selectedRegion = useWatch({ control: form.control, name: "region" })
  const { region } = useAdminRegion(selectedRegion?.value!, {
    enabled: !!selectedRegion,
  })

  const selectedShippingOption = useWatch({
    control: form.control,
    name: "shipping_option",
  })

  const { shipping_option } = useAdminShippingOption(
    selectedShippingOption?.value!,
    {
      enabled: !!selectedShippingOption?.value,
    }
  )

  useEffect(() => {
    if (selectedShippingOption) {
      form.resetField("shipping_option")
      form.resetField("custom_shipping_price")
    }
  }, [selectedRegion])

  const validCountries = useMemo(() => {
    if (!region) {
      return []
    }

    return region.countries.map((country) => ({
      label: country.display_name,
      value: country.iso_2,
    }))
  }, [region])

  const { client } = useMedusa()

  useEffect(() => {
    const updateItems = async () => {
      if (items.fields.length) {
        const itemsMap = items.fields.reduce((acc, next) => {
          if (next.variant_id) {
            acc[next.variant_id] = next
          }
          return acc
        }, {} as { [key: string]: any })

        const variantIds = items.fields
          .map((v) => v.variant_id)
          .filter(Boolean) as string[]

        const { variants } = await client.admin.variants.list({
          id: variantIds,
          region_id: region?.id,
        })

        items.replace(
          variants.map((variant) => ({
            quantity: itemsMap[variant.id as string].quantity,
            variant_id: variant.id,
            title: variant.title as string,
            unit_price: extractUnitPrice(variant, region as Region, false),
            product_title: (variant.product as Product)?.title,
            thumbnail: (variant.product as Product)?.thumbnail,
          }))
        )
      }
    }

    updateItems()
  }, [region])

  const { shipping_options } = useAdminShippingOptions(
    {
      region_id: region?.id,
      is_return: false,
    },
    {
      enabled: !!region,
    }
  )

  const validShippingOptions = useMemo(() => {
    if (!shipping_options) {
      return []
    }

    const total = items.fields.reduce((acc, next) => {
      return acc + next.quantity * next.unit_price
    }, 0)

    return shipping_options.reduce((acc, next) => {
      if (next.requirements) {
        const minSubtotal = next.requirements.find(
          (req) => req.type === "min_subtotal"
        )
        const maxSubtotal = next.requirements.find(
          (req) => req.type === "max_subtotal"
        )

        if (
          (minSubtotal && total <= minSubtotal.amount) ||
          (maxSubtotal && total >= maxSubtotal.amount)
        ) {
          return acc
        }
      }
      acc.push(next)
      return acc
    }, [] as ShippingOption[])
  }, [shipping_options, items])

  return (
    <NewOrderContext.Provider
      value={{
        validCountries,
        region,
        selectedShippingOption: shipping_option,
        items,
        shippingOptions: validShippingOptions,
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </NewOrderContext.Provider>
  )
}

export const useNewOrderForm = () => {
  const context = useContext(NewOrderContext)
  const form = useFormContext<NewOrderForm>()

  if (!context) {
    throw new Error("useNewOrderForm must be used within NewOrderFormProvider")
  }

  return { context, form }
}

export default NewOrderFormProvider
