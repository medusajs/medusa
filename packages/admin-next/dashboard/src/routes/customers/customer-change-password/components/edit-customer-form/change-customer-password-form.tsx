import { zodResolver } from "@hookform/resolvers/zod"
import { Customer } from "@medusajs/medusa"
import { Button, Drawer, Input, usePrompt } from "@medusajs/ui"
import { useAdminUpdateCustomer } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type ChangeCustomerPasswordForm = {
  customer: Customer
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const ChangeCustomerPasswordSchema = zod
  .object({
    password: zod.string().min(8),
    password_confirmation: zod.string().min(8),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      return ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["password_confirmation"],
      })
    }
  })

export const EditCustomerForm = ({
  customer,
  subscribe,
  onSuccessfulSubmit,
}: ChangeCustomerPasswordForm) => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof ChangeCustomerPasswordSchema>>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(ChangeCustomerPasswordSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminUpdateCustomer(customer.id)

  const prompt = usePrompt()

  const handleSubmit = form.handleSubmit(async (data) => {
    const res = await prompt({
      variant: "confirmation",
      title: t("customers.changePasswordPromptTitle"),
      description: t("customers.changePasswordPromptDescription", {
        email: customer.email,
      }),
      cancelText: t("general.cancel"),
      confirmText: t("general.confirm"),
    })

    if (!res) {
      return
    }

    await mutateAsync(data, {
      onSuccess: () => {
        onSuccessfulSubmit()
      },
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <Drawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.password")}</Form.Label>
                    <Form.Control>
                      <Input type="password" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="password_confirmation"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.confirmPassword")}</Form.Label>
                    <Form.Control>
                      <Input type="password" {...field} />
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
                {t("general.cancel")}
              </Button>
            </Drawer.Close>
            <Button
              isLoading={isLoading}
              type="submit"
              variant="primary"
              size="small"
            >
              {t("general.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
