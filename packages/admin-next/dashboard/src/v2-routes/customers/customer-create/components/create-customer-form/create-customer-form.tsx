import * as zod from "zod"

import {
  AdminCustomersCreateRes,
  AdminPostCustomersReq,
} from "@medusajs/medusa"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { adminCustomerKeys, useAdminCustomPost } from "medusa-react"

import { Form } from "../../../../../components/common/form"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"

const CreateCustomerSchema = zod.object({
  email: zod.string().email(),
  first_name: zod.string().min(1),
  last_name: zod.string().min(1),
  phone: zod.string().min(1).optional(),
})

export const CreateCustomerForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync, isLoading } = useAdminCustomPost<
    AdminPostCustomersReq,
    AdminCustomersCreateRes
  >("/admin/customers", adminCustomerKeys.lists())

  const form = useForm<zod.infer<typeof CreateCustomerSchema>>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
    },
    resolver: zodResolver(CreateCustomerSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      },
      {
        onSuccess: ({ customer }) => {
          handleSuccess(`/customers/${customer.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit}>
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
              isLoading={isLoading}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col items-center py-16">
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
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
