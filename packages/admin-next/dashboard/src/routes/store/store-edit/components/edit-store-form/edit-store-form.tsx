import { zodResolver } from "@hookform/resolvers/zod"
import type { Store } from "@medusajs/medusa"
import { Button, Drawer, Input } from "@medusajs/ui"
import { useAdminUpdateStore } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type EditStoreFormProps = {
  store: Store
  onSuccess: () => void
}

const EditStoreSchema = zod.object({
  name: zod.string().optional(),
  swap_link_template: zod.union([zod.literal(""), zod.string().trim().url()]),
  payment_link_template: zod.union([
    zod.literal(""),
    zod.string().trim().url(),
  ]),
  invite_link_template: zod.union([zod.literal(""), zod.string().trim().url()]),
})

export const EditStoreForm = ({ store, onSuccess }: EditStoreFormProps) => {
  const { mutateAsync, isLoading } = useAdminUpdateStore()

  const form = useForm<zod.infer<typeof EditStoreSchema>>({
    defaultValues: {
      name: store.name,
      swap_link_template: store.swap_link_template ?? "",
      payment_link_template: store.payment_link_template ?? "",
      invite_link_template: store.invite_link_template ?? "",
    },
    resolver: zodResolver(EditStoreSchema),
  })

  const { t } = useTranslation()

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(
      {
        name: values.name,
        invite_link_template: values.invite_link_template || undefined,
        swap_link_template: values.swap_link_template || undefined,
        payment_link_template: values.payment_link_template || undefined,
      },
      {
        onSuccess: () => {
          onSuccess()
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <Drawer.Body>
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("fields.name")}</Form.Label>
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
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" isLoading={isLoading} type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
