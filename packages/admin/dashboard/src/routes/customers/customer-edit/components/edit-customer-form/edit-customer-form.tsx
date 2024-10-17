import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { ConditionalTooltip } from "../../../../../components/common/conditional-tooltip/index.ts"
import { Form } from "../../../../../components/common/form/index.ts"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/modals/index.ts"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form/keybound-form.tsx"
import { useUpdateCustomer } from "../../../../../hooks/api/customers.tsx"

type EditCustomerFormProps = {
  customer: HttpTypes.AdminCustomer
}

const EditCustomerSchema = zod.object({
  email: zod.string().email(),
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  company_name: zod.string().optional(),
  phone: zod.string().optional(),
})

export const EditCustomerForm = ({ customer }: EditCustomerFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditCustomerSchema>>({
    defaultValues: {
      email: customer.email || "",
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      company_name: customer.company_name || "",
      phone: customer.phone || "",
    },
    resolver: zodResolver(EditCustomerSchema),
  })

  const { mutateAsync, isPending } = useUpdateCustomer(customer.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        email: customer.has_account ? undefined : data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        phone: data.phone || null,
        company_name: data.company_name || null,
      },
      {
        onSuccess: ({ customer }) => {
          toast.success(
            t("customers.edit.successToast", {
              email: customer.email,
            })
          )

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
      <KeyboundForm onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.email")}</Form.Label>
                    <Form.Control>
                      <ConditionalTooltip
                        showTooltip={customer.has_account}
                        content={t("customers.edit.emailDisabledTooltip")}
                      >
                        <Input {...field} disabled={customer.has_account} />
                      </ConditionalTooltip>
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
              name="company_name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.company")}</Form.Label>
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
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button
              isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
