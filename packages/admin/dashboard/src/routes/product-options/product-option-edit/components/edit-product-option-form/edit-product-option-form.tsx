import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateProductOption } from "../../../../../hooks/api"
import { EditProductOptionDetails } from "./edit-product-option-details"
import { EditProductOptionOrganize } from "./edit-product-option-organize"
import { EditProductOptionSchema } from "./schema"

type EditProductOptionFormProps = {
  productOption: HttpTypes.AdminProductOption
}

export const EditProductOptionForm = ({
  productOption,
}: EditProductOptionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { sortedValues, existingRanks } = useMemo(() => {
    if (!productOption.values) {
      return { sortedValues: [], existingRanks: {} }
    }

    const ranks: Record<string, number> = {}
    productOption.values.forEach((v: any) => {
      if (v.rank !== undefined && v.rank !== null) {
        ranks[v.value] = v.rank
      }
    })

    const sorted = [...productOption.values].sort((a: any, b: any) => {
      const rankA = a.rank ?? Number.MAX_VALUE
      const rankB = b.rank ?? Number.MAX_VALUE
      return rankA - rankB
    })

    return {
      sortedValues: sorted.map((v: any) => v.value),
      existingRanks: ranks,
    }
  }, [productOption.values])

  const form = useForm<EditProductOptionSchema>({
    defaultValues: {
      title: productOption.title,
      values: sortedValues,
      value_ranks: existingRanks,
    },
    resolver: zodResolver(EditProductOptionSchema),
  })

  const { mutateAsync, isPending } = useUpdateProductOption(productOption.id)

  const handleSubmit = form.handleSubmit((data) => {
    const { title, values, value_ranks } = data

    mutateAsync(
      {
        title,
        values,
        ranks: value_ranks,
      },
      {
        onSuccess: ({ product_option }) => {
          toast.success(
            t("productOptions.edit.successToast", {
              title: product_option.title,
            })
          )

          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-col gap-y-4 overflow-auto p-4">
          <EditProductOptionDetails form={form} />
          <EditProductOptionOrganize form={form} />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
