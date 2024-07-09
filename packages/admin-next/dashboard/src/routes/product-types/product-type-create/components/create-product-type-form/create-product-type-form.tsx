import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { useCreateProductType } from "../../../../../hooks/api/product-types"

const CreateProductTypeSchema = z.object({
  value: z.string().min(1),
})

export const CreateProductTypeForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateProductTypeSchema>>({
    defaultValues: {
      value: "",
    },
    resolver: zodResolver(CreateProductTypeSchema),
  })

  const { mutateAsync, isPending } = useCreateProductType()

  const handleSubmit = form.handleSubmit(
    async (values: z.infer<typeof CreateProductTypeSchema>) => {
      await mutateAsync(values, {
        onSuccess: ({ product_type }) => {
          toast.success(
            t("productTypes.create.successToast", {
              value: product_type.value,
            })
          )

          handleSuccess(`/settings/product-types/${product_type.id}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      })
    }
  )

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
        <RouteFocusModal.Header>
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
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col items-center overflow-y-auto p-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("productTypes.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("productTypes.create.hint")}
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
