import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateCustomerGroup } from "../../../../../hooks/api/customer-groups"
import { HttpTypes } from "@medusajs/types"

type EditCustomerGroupFormProps = {
  group: HttpTypes.AdminCustomerGroup
}

export const EditCustomerGroupSchema = z.object({
  name: z.string().min(1),
})

export const EditCustomerGroupForm = ({
  group,
}: EditCustomerGroupFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditCustomerGroupSchema>>({
    defaultValues: {
      name: group.name || "",
    },
    resolver: zodResolver(EditCustomerGroupSchema),
  })

  const { mutateAsync, isPending } = useUpdateCustomerGroup(group.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ customer_group }) => {
        toast.success(t("general.success"), {
          description: t("customerGroups.edit.successToast", {
            name: customer_group.name,
          }),
          dismissLabel: t("actions.close"),
        })

        handleSuccess()
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.name")}</Form.Label>
                  <Form.Control>
                    <Input {...field} size="small" />
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
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
