import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { RouteFocusModal, useRouteModal } from "../../../components/route-modal"
import { useUpdateProductVariantsBatch } from "../../../hooks/api/products"
import { ExtendedProductDTO } from "../../../types/api-responses"
import { VariantPricingForm } from "../common/variant-pricing-form"
import {
  getDbAmount,
  getPresentationalAmount,
} from "../../../lib/money-amount-helpers.ts"
import { castNumber } from "../../../lib/cast-number.ts"

export const UpdateVariantPricesSchema = zod.object({
  variants: zod.array(
    zod.object({
      prices: zod
        .record(zod.string(), zod.string().or(zod.number()).optional())
        .optional(),
    })
  ),
})

export type UpdateVariantPricesSchemaType = zod.infer<
  typeof UpdateVariantPricesSchema
>

export const PricingEdit = ({ product }: { product: ExtendedProductDTO }) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const form = useForm<UpdateVariantPricesSchemaType>({
    defaultValues: {
      variants: product.variants.map((variant: any) => ({
        title: variant.title,
        prices: variant.prices.reduce((acc: any, price: any) => {
          acc[price.currency_code] = getPresentationalAmount(
            price.amount,
            price.currency_code
          )
          return acc
        }, {}),
      })) as any,
    },

    resolver: zodResolver(UpdateVariantPricesSchema, {}),
  })

  const { mutateAsync, isPending } = useUpdateProductVariantsBatch(product.id)

  const handleSubmit = form.handleSubmit(
    async (values) => {
      const reqData = {
        update: values.variants.map((variant, ind) => ({
          id: product.variants[ind].id,
          prices: Object.entries(variant.prices || {}).map(
            ([key, value]: any) => ({
              currency_code: key,
              amount: getDbAmount(castNumber(value), key),
            })
          ),
        })),
      }
      await mutateAsync(reqData, {
        onSuccess: () => {
          handleSuccess(`/products/${product.id}`)
        },
      })
    },
    (err) => {
      console.log(err)
    }
  )

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex w-full items-center justify-end gap-x-2">
            <div className="flex items-center gap-x-4">
              <RouteFocusModal.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                type="submit"
                variant="primary"
                size="small"
                isLoading={isPending}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body>
          <VariantPricingForm form={form as any} />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
