import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Select, Text, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { z } from "@medusajs/framework/zod"
import { Form } from "../../../../../../components/form"
import { KeyboundForm } from "../../../../../../components/keybound-form"
import { RouteDrawer, useRouteModal } from "../../../../../../components/modals"
import { useUpdateProduct } from "../../../../../../hooks/api/products"

type GiftCardProductEditFormProps = {
  product: HttpTypes.AdminProduct
}

const EditProductSchema = z.object({
  status: z.enum(["draft", "published", "proposed", "rejected"]),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  handle: z.string().min(1),
  description: z.string().optional(),
})

export const GiftCardProductEditForm = ({
  product,
}: GiftCardProductEditFormProps) => {
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditProductSchema>>({
    defaultValues: {
      status: product.status,
      title: product.title,
      subtitle: product.subtitle || "",
      handle: product.handle || "",
      description: product.description || "",
    },
    resolver: zodResolver(EditProductSchema),
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data: any) => {
    const { title, handle, status, ...optional } = data

    await mutateAsync(
      {
        ...optional,
        title,
        handle,
        status,
      },
      {
        onSuccess: ({ product }) => {
          toast.success(
            `Gift card product ${product.title} updated successfully`
          )
          handleSuccess()
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="status"
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>Status</Form.Label>
                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref} className="capitalize">
                            <Select.Value />
                          </Select.Trigger>

                          <Select.Content>
                            {(
                              [
                                "draft",
                                "published",
                                "proposed",
                                "rejected",
                              ] as const
                            ).map((status) => {
                              return (
                                <Select.Item
                                  key={status}
                                  value={status}
                                  className="capitalize"
                                >
                                  {status}
                                </Select.Item>
                              )
                            })}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>Title</Form.Label>
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
                name="subtitle"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>Subtitle</Form.Label>
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
                name="handle"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>Handle</Form.Label>
                      <Form.Control>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center border-r">
                            <Text
                              className="text-ui-fg-muted"
                              size="small"
                              leading="compact"
                              weight="plus"
                            >
                              /
                            </Text>
                          </div>
                          <Input {...field} className="pl-10" />
                        </div>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>Description</Form.Label>
                      <Form.Control>
                        <Textarea {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              Save
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
