import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Heading, Input, toast } from "@zjedene-medusa/ui"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"
import { Form } from "../../../../components/common/form"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import { useUpdateDraftOrder } from "../../../../hooks/api/draft-orders"
import { useOrder } from "../../../../hooks/api/orders"

const Email = () => {
  const { id } = useParams()
  const { order, isPending, isError, error } = useOrder(id!, {
    fields: "+email",
  })

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!order

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit Email</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description asChild>
          <span className="sr-only">Edit the email for the draft order</span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {isReady && <EmailForm order={order} />}
    </RouteDrawer>
  )
}

interface EmailFormProps {
  order: HttpTypes.AdminOrder
}

const EmailForm = ({ order }: EmailFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: order.email ?? "",
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useUpdateDraftOrder(order.id)
  const { handleSuccess } = useRouteModal()

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { email: data.email },
      {
        onSuccess: () => {
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
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={onSubmit}
      >
        <RouteDrawer.Body className="flex flex-col gap-y-6 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="email"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Email</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex justify-end gap-2">
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

const schema = z.object({
  email: z.string().email(),
})

export default Email
