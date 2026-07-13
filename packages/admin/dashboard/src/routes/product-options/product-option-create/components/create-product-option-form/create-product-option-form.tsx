import { zodResolver } from "@hookform/resolvers/zod"
import { Button, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateProductOption } from "../../../../../hooks/api"
import { CreateProductOptionDetails } from "./create-product-option-details"
import { CreateProductOptionOrganize } from "./create-product-option-organize"
import { CreateProductOptionSchema } from "./schema"

export const CreateProductOptionForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<CreateProductOptionSchema>({
    defaultValues: {
      title: "",
      values: [],
      value_ranks: {},
    },
    resolver: zodResolver(CreateProductOptionSchema),
  })

  const hasValues = (form.watch("values")?.length ?? 0) > 0

  const { mutateAsync, isPending } = useCreateProductOption()

  const handleSubmit = form.handleSubmit((data) => {
    const { title, values, value_ranks } = data

    const ranks = value_ranks ?? {}

    // populate default ranks as what user saw by default (i.e. in order that values were entered)
    if (!Object.keys(ranks).length) {
      values.forEach((value, index) => (ranks[value] = index + 1))
    }

    mutateAsync(
      {
        title,
        values,
        ranks,
      },
      {
        onSuccess: ({ product_option }) => {
          toast.success(
            t("productOptions.create.successToast", {
              title: product_option.title,
            })
          )

          handleSuccess(`/product-options/${product_option.id}`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex size-full flex-col gap-y-16 overflow-auto">
          <CreateProductOptionDetails form={form} />
          {hasValues && <CreateProductOptionOrganize form={form} />}
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
