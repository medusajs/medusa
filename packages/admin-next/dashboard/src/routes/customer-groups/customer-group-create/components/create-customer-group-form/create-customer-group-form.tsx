import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal, Heading, Input, Text } from "@medusajs/ui"
import { useAdminCreateCustomerGroup } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type CreateCustomerGroupFormProps = {
  subscribe: (state: boolean) => void
}

const CreateCustomerGroupSchema = zod.object({
  name: zod.string().min(1),
})

export const CreateCustomerGroupForm = ({
  subscribe,
}: CreateCustomerGroupFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm<zod.infer<typeof CreateCustomerGroupSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateCustomerGroupSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminCreateCustomerGroup()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        name: data.name,
      },
      {
        onSuccess: ({ customer_group }) => {
          navigate(`/customer-groups/${customer_group.id}`)
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
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </FocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isLoading}
            >
              {t("actions.create")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center pt-[72px]">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("customerGroups.createCustomerGroup")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("customerGroups.createCustomerGroupHint")}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.name")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </FocusModal.Body>
      </form>
    </Form>
  )
}
