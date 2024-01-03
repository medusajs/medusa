import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@medusajs/medusa"
import { Button, Drawer, Heading, Input } from "@medusajs/ui"
import { useAdminUpdateStore } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../components/common/form"

type EditStoreDetailsDrawerProps = {
  store: Store
}

const EditStoreDetailsSchema = zod.object({
  name: zod.string().optional(),
  swap_link_template: zod.union([zod.literal(""), zod.string().trim().url()]),
  payment_link_template: zod.union([
    zod.literal(""),
    zod.string().trim().url(),
  ]),
  invite_link_template: zod.union([zod.literal(""), zod.string().trim().url()]),
})

export const EditStoreDetailsDrawer = ({
  store,
}: EditStoreDetailsDrawerProps) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof EditStoreDetailsSchema>>({
    defaultValues: {
      name: store.name,
      swap_link_template: store.swap_link_template ?? "",
      payment_link_template: store.payment_link_template ?? "",
      invite_link_template: store.invite_link_template ?? "",
    },
    resolver: zodResolver(EditStoreDetailsSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateStore()

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }

    setOpen(open)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        swap_link_template: values.swap_link_template || undefined,
        payment_link_template: values.payment_link_template || undefined,
        invite_link_template: values.invite_link_template || undefined,
      },
      {
        onSuccess: ({ store }) => {
          form.reset({
            invite_link_template: store.invite_link_template ?? "",
            payment_link_template: store.payment_link_template ?? "",
            swap_link_template: store.swap_link_template ?? "",
            name: store.name,
          })
          onOpenChange(false)
        },
        onError: (error) => {
          console.log(error)
        },
      }
    )
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>
        <Button variant="secondary">{t("store.editStoreDetails")}</Button>
      </Drawer.Trigger>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Drawer.Content>
            <Drawer.Header>
              <Heading>{t("store.editStoreDetails")}</Heading>
            </Drawer.Header>
            <Drawer.Body>
              <div className="flex flex-col gap-y-8">
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("store.storeName")}</Form.Label>
                      <Form.Control>
                        <Input size="small" {...field} placeholder="ACME" />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="swap_link_template"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("store.swapLinkTemplate")}</Form.Label>
                      <Form.Control>
                        <Input
                          size="small"
                          {...field}
                          placeholder="https://www.store.com/swap={id}"
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="payment_link_template"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("store.paymentLinkTemplate")}</Form.Label>
                      <Form.Control>
                        <Input
                          size="small"
                          {...field}
                          placeholder="https://www.store.com/payment={id}"
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="invite_link_template"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("store.inviteLinkTemplate")}</Form.Label>
                      <Form.Control>
                        <Input
                          size="small"
                          {...field}
                          placeholder="https://www.admin.com/invite?token={invite_token}"
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={onSubmit}
              >
                Save
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </form>
      </Form>
    </Drawer>
  )
}
