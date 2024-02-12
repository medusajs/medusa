import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal, Heading, Input, Text } from "@medusajs/ui"
import { useAdminCreateCustomer } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type CreateCustomerFormProps = {
  subscribe: (state: boolean) => void
}

const CreateCustomerSchema = zod
  .object({
    email: zod.string().email(),
    first_name: zod.string().min(1),
    last_name: zod.string().min(1),
    phone: zod.string().min(1).optional(),
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

export const CreateCustomerForm = ({ subscribe }: CreateCustomerFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm<zod.infer<typeof CreateCustomerSchema>>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(CreateCustomerSchema),
  })
  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminCreateCustomer()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        password: data.password,
      },
      {
        onSuccess: ({ customer }) => {
          navigate(`/customers/${customer.id}`, { replace: true })
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </FocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isLoading}
            >
              {t("actions.create")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("customers.createCustomer")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("customers.createCustomerHint")}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="first_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.firstName")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
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
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.email")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
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
                      <Form.Label optional>{t("fields.phone")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <Text size="small" leading="compact" weight="plus">
                  {t("fields.password")}
                </Text>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("customers.passwordHint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.password")}</Form.Label>
                        <Form.Control>
                          <Input
                            autoComplete="off"
                            type="password"
                            {...field}
                          />
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
                          <Input
                            autoComplete="off"
                            type="password"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </FocusModal.Body>
      </form>
    </Form>
  )
}
