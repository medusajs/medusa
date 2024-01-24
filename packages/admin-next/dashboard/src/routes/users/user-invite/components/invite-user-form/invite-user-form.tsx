import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal, Heading, Input, Select, Text } from "@medusajs/ui"
import { useAdminCreateInvite } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type InviteUserFormProps = {
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

enum UserRole {
  MEMBER = "member",
  ADMIN = "admin",
  DEVELOPER = "developer",
}

const InviteUserSchema = zod.object({
  user: zod.string().email(),
  role: zod.nativeEnum(UserRole),
})

export const InviteUserForm = ({
  subscribe,
  onSuccessfulSubmit,
}: InviteUserFormProps) => {
  const form = useForm<zod.infer<typeof InviteUserSchema>>({
    defaultValues: {
      user: "",
      role: UserRole.MEMBER,
    },
    resolver: zodResolver(InviteUserSchema),
  })
  const { mutateAsync, isLoading } = useAdminCreateInvite()

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { t } = useTranslation()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        role: values.role,
        user: values.user,
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
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("general.cancel")}
              </Button>
            </FocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("general.save")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading>{t("users.inviteUser")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("users.inviteUserHint")}
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="user"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.email")}</Form.Label>
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
                  name="role"
                  render={({ field: { ref, onChange, ...field } }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.role")}</Form.Label>
                        <Form.Control>
                          <Select {...field} onValueChange={onChange}>
                            <Select.Trigger ref={ref}>
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Content>
                              {Object.values(UserRole).map((role) => (
                                <Select.Item key={role} value={role}>
                                  {t(`users.roles.${role}`)}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
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
