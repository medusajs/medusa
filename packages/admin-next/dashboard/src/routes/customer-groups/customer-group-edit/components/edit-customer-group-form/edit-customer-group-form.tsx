import { zodResolver } from "@hookform/resolvers/zod"
import { CustomerGroup } from "@medusajs/medusa"
import { Button, Drawer, Input } from "@medusajs/ui"
import { useAdminUpdateCustomerGroup } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"
import { Form } from "../../../../../components/common/form"

type EditCustomerGroupFormProps = {
  group: CustomerGroup
  onSuccessfulSubmit: () => void
  subscribe: (state: boolean) => void
}

const EditCustomerGroupSchema = z.object({
  name: z.string().min(1),
})

export const EditCustomerGroupForm = ({
  group,
  onSuccessfulSubmit,
  subscribe,
}: EditCustomerGroupFormProps) => {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof EditCustomerGroupSchema>>({
    defaultValues: {
      name: group.name || "",
    },
    resolver: zodResolver(EditCustomerGroupSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminUpdateCustomerGroup(group.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        onSuccessfulSubmit()
      },
    })
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col overflow-hidden flex-1"
      >
        <Drawer.Body className="flex flex-col gap-y-8 overflow-y-auto flex-1 max-w-full">
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
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("general.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("general.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
