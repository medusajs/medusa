import { zodResolver } from "@hookform/resolvers/zod"
import { Customer } from "@medusajs/medusa"
import { Button, Drawer, Input } from "@medusajs/ui"
import { useAdminUpdateCustomer } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type EditCustomerFormProps = {
  customer: Customer
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const EditCustomerSchema = zod.object({
  email: zod.string().email(),
  first_name: zod.string().min(1).optional(),
  last_name: zod.string().min(1).optional(),
  phone: zod.string().optional(),
})

export const EditCustomerForm = ({
  customer,
  subscribe,
  onSuccessfulSubmit,
}: EditCustomerFormProps) => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof EditCustomerSchema>>({
    defaultValues: {
      email: customer.email || "",
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      phone: customer.phone || "",
    },
    resolver: zodResolver(EditCustomerSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminUpdateCustomer(customer.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        email: customer.has_account ? undefined : data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      },
      {
        onSuccess: () => {
          onSuccessfulSubmit()
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <Drawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.email")}</Form.Label>
                    <Form.Control>
                      <Input {...field} disabled={customer.has_account} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="first_name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.firstName")}</Form.Label>
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
              name="last_name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.lastName")}</Form.Label>
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
              name="phone"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.phone")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button
              isLoading={isLoading}
              type="submit"
              variant="primary"
              size="small"
            >
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
