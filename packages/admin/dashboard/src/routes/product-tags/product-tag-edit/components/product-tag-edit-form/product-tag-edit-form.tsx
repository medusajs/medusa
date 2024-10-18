import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateProductTag } from "../../../../../hooks/api"

type ProductTagEditFormProps = {
  productTag: HttpTypes.AdminProductTag
}

const ProductTagEditSchema = z.object({
  value: z.string().min(1),
})

export const ProductTagEditForm = ({ productTag }: ProductTagEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof ProductTagEditSchema>>({
    defaultValues: {
      value: productTag.value,
    },
    resolver: zodResolver(ProductTagEditSchema),
  })

  const { mutateAsync, isPending } = useUpdateProductTag(productTag.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ product_tag }) => {
        toast.success(
          t("productTags.edit.successToast", {
            value: product_tag.value,
          })
        )
        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col overflow-auto">
          <Form.Field
            control={form.control}
            name="value"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("productTags.fields.value")}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small" type="button">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
