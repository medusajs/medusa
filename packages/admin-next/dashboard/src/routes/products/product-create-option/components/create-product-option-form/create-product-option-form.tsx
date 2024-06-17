import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { ChipInput } from "../../../../../components/inputs/chip-input"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateProductOption } from "../../../../../hooks/api/products"
import { HttpTypes } from "@medusajs/types"

type EditProductOptionsFormProps = {
  product: HttpTypes.AdminProduct
}

const CreateProductOptionSchema = z.object({
  title: z.string().min(1),
  values: z.array(z.string()).optional(),
})

export const CreateProductOptionForm = ({
  product,
}: EditProductOptionsFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateProductOptionSchema>>({
    defaultValues: {
      title: "",
      values: [],
    },
    resolver: zodResolver(CreateProductOptionSchema),
  })

  const { mutateAsync, isPending } = useCreateProductOption(product.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(values, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("products.options.create.successToast", {
            title: values.title,
          }),
          dismissLabel: t("general.close"),
        })
        handleSuccess()
      },
      onError: async (err) => {
        toast.error(t("general.error"), {
          description: err.message,
          dismissLabel: t("general.close"),
        })
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-4 overflow-auto">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("products.fields.options.optionTitle")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder={t(
                        "products.fields.options.optionTitlePlaceholder"
                      )}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="values"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("products.fields.options.variations")}
                  </Form.Label>
                  <Form.Control>
                    <ChipInput
                      {...field}
                      placeholder={t(
                        "products.fields.options.variantionsPlaceholder"
                      )}
                    />
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
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
