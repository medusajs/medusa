import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { RouteFocusModal, useRouteModal } from "../../../components/modals"
import { useUpdateProductVariantsBatch } from "../../../hooks/api/products"
import { useRegions } from "../../../hooks/api/regions"
import { castNumber } from "../../../lib/cast-number"
import { VariantPricingForm } from "../common/variant-pricing-form"

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

export const PricingEdit = ({
  product,
  variantId,
}: {
  product: HttpTypes.AdminProduct
  variantId?: string
}) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { regions } = useRegions({ limit: 9999 })
  const regionsCurrencyMap = useMemo(() => {
    if (!regions?.length) {
      return {}
    }

    return regions.reduce((acc, reg) => {
      acc[reg.id] = reg.currency_code
      return acc
    }, {})
  }, regions)

  const variants = variantId
    ? product.variants.filter((v) => v.id === variantId)
    : product.variants

  const form = useForm<UpdateVariantPricesSchemaType>({
    defaultValues: {
      variants: variants.map((variant: any) => ({
        title: variant.title,
        prices: variant.prices.reduce((acc: any, price: any) => {
          if (price.rules?.region_id) {
            acc[price.rules.region_id] = price.amount
          } else {
            acc[price.currency_code] = price.amount
          }
          return acc
        }, {}),
      })) as any,
    },

    resolver: zodResolver(UpdateVariantPricesSchema, {}),
  })

  const { mutateAsync, isPending } = useUpdateProductVariantsBatch(product.id)

  const handleSubmit = form.handleSubmit(
    async (values) => {
      const reqData = values.variants.map((variant, ind) => ({
        id: variants[ind].id,
        prices: Object.entries(variant.prices || {}).map(
          ([currencyCodeOrRegionId, value]: any) => {
            const regionId = currencyCodeOrRegionId.startsWith("reg_")
              ? currencyCodeOrRegionId
              : undefined
            const currencyCode = currencyCodeOrRegionId.startsWith("reg_")
              ? regionsCurrencyMap[regionId]
              : currencyCodeOrRegionId

            let existingId = undefined

            if (regionId) {
              existingId = variants[ind].prices.find(
                (p) => p.rules["region_id"] === regionId
              )?.id
            } else {
              existingId = variants[ind].prices.find(
                (p) =>
                  p.currency_code === currencyCode &&
                  Object.keys(p.rules ?? {}).length === 0
              )?.id
            }

            const amount = castNumber(value)

            const pricePayload = existingId
              ? {
                  id: existingId,
                  amount,
                }
              : { currency_code: currencyCode, amount }

            if (regionId && !existingId) {
              pricePayload.rules = { region_id: regionId }
            }

            return pricePayload
          }
        ),
      }))

      await mutateAsync(reqData, {
        onSuccess: () => {
          handleSuccess("..")
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
