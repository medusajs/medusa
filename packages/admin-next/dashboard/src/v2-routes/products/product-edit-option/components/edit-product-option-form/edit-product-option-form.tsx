import { zodResolver } from "@hookform/resolvers/zod"
import { ProductOption } from "@medusajs/medusa"
import { Button, Input } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateProductOption } from "../../../../../hooks/api/products"

type EditProductOptionFormProps = {
  option: ProductOption
}

const CreateProductOptionSchema = z.object({
  title: z.string().min(1),
  values: z.array(z.string()).optional(),
})

export const CreateProductOptionForm = ({
  option,
}: EditProductOptionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateProductOptionSchema>>({
    defaultValues: {
      title: option.title,
      values: option.values.map((v: any) => v.value),
    },
    resolver: zodResolver(CreateProductOptionSchema),
  })

  const { mutateAsync, isLoading } = useUpdateProductOption(
    option.product_id,
    option.id
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(
      {
        id: option.id,
        ...values,
      },
      {
        onSuccess: () => {
          handleSuccess()
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
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
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
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="values"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>
                    {t("products.fields.options.variations")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      value={(value ?? []).join(",")}
                      onChange={(e) => {
                        const val = e.target.value
                        onChange(val.split(",").map((v) => v.trim()))
                      }}
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
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
