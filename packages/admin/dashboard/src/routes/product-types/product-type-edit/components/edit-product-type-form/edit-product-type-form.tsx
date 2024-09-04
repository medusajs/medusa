import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useUpdateProductType } from "../../../../../hooks/api/product-types"

const EditProductTypeSchema = z.object({
  value: z.string().min(1),
})

type EditProductTypeFormProps = {
  productType: HttpTypes.AdminProductType
}

export const EditProductTypeForm = ({
  productType,
}: EditProductTypeFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditProductTypeSchema>>({
    defaultValues: {
      value: productType.value,
    },
    resolver: zodResolver(EditProductTypeSchema),
  })

  const { mutateAsync, isPending } = useUpdateProductType(productType.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        value: data.value,
      },
      {
        onSuccess: ({ product_type }) => {
          toast.success(
            t("productTypes.edit.successToast", {
              value: product_type.value,
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="value"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("productTypes.fields.value")}</Form.Label>
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
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
