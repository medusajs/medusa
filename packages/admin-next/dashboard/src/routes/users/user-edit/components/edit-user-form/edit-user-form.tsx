import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@medusajs/medusa"
import { Button, Drawer, Input } from "@medusajs/ui"
import { useAdminUpdateUser } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type EditUserFormProps = {
  user: Omit<User, "password_hash">
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const EditUserFormSchema = zod.object({
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
})

export const EditUserForm = ({
  user,
  subscribe,
  onSuccessfulSubmit,
}: EditUserFormProps) => {
  const form = useForm<zod.infer<typeof EditUserFormSchema>>({
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    },
    resolver: zodResolver(EditUserFormSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { t } = useTranslation()

  const { mutateAsync, isLoading } = useAdminUpdateUser(user.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        onSuccessfulSubmit()
      },
    })
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
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
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
