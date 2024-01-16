import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal } from "@medusajs/ui"
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
          <div className="flex items-center gap-x-2 justify-end">
            <FocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("general.cancel")}
              </Button>
            </FocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isLoading}
            >
              {t("general.create")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body></FocusModal.Body>
      </form>
    </Form>
  )
}
