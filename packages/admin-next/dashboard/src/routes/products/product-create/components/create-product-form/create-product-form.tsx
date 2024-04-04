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
  description: zod.string().optional(),
  discountable: zod.boolean(),
  type_id: zod.string().optional(),
  collection_id: zod.string().optional(),
  category_ids: zod.array(zod.string()).optional(),
  tags: zod.array(zod.string()).optional(),
  sales_channels: zod.array(zod.string()).optional(),
  origin_country: zod.string().optional(),
  material: zod.string().optional(),
  width: zod.string().optional(),
  length: zod.string().optional(),
  height: zod.string().optional(),
  weight: zod.string().optional(),
  mid_code: zod.string().optional(),
  hs_code: zod.string().optional(),
  variants: zod.array(
    zod.object({
      variant_rank: zod.number(),
    })
  ),
  images: zod.array(zod.string()).optional(),
  thumbnail: zod.string().optional(),
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
      description: "",
      discountable: true,
      tags: [],
      sales_channels: [],
      variants: [],
      images: [],
    },
    resolver: zodResolver(CreateProductSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateProduct()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        ...values,
        is_giftcard: false,
        tags: values.tags?.map((tag) => ({ value: tag })),
        sales_channels: values.sales_channels?.map((sc) => ({ id: sc })),
        width: values.width ? parseFloat(values.width) : undefined,
        length: values.length ? parseFloat(values.length) : undefined,
        height: values.height ? parseFloat(values.height) : undefined,
        weight: values.weight ? parseFloat(values.weight) : undefined,
        variants: values.variants.map((v) => ({ title: "", prices: [] })),
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
              {t("actions.saveAsDraft")}
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
