import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@medusajs/ui"
import { useAdminCreateProduct } from "medusa-react"
import { UseFormReturn, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CreateProductDetails } from "./create-product-details"

const CreateProductSchema = zod.object({
  title: zod.string(),
  subtitle: zod.string().optional(),
  handle: zod.string().optional(),
  material: zod.string().optional(),
  description: zod.string().optional(),
  discountable: zod.boolean(),
  sales_channels: zod.array(zod.string()).optional(),
  width: zod.string().optional(),
  length: zod.string().optional(),
  height: zod.string().optional(),
  weight: zod.string().optional(),
  origin_country: zod.string().optional(),
  mid_code: zod.string().optional(),
  hs_code: zod.string().optional(),
  variants: zod.array(
    zod.object({
      variant_rank: zod.number(),
    })
  ),
})

type Schema = zod.infer<typeof CreateProductSchema>
export type CreateProductFormReturn = UseFormReturn<Schema>

export const CreateProductForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<Schema>({
    defaultValues: {
      title: "",
      subtitle: "",
      handle: "",
      material: "",
      description: "",
      discountable: true,
      height: "",
      length: "",
      weight: "",
      width: "",
      origin_country: "",
      mid_code: "",
      hs_code: "",
      sales_channels: [],
      variants: [],
    },
    resolver: zodResolver(CreateProductSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateProduct()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        title: values.title,
        discountable: values.discountable,
        is_giftcard: false,
        width: values.width ? parseFloat(values.width) : undefined,
        length: values.length ? parseFloat(values.length) : undefined,
        height: values.height ? parseFloat(values.height) : undefined,
        weight: values.weight ? parseFloat(values.weight) : undefined,
      },
      {
        onSuccess: ({ product }) => {
          handleSuccess(`../${product.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
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
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex h-full w-full">
              <CreateProductDetails form={form} />
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
