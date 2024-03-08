import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button } from "@medusajs/ui"
import { useAdminCreateDiscount } from "medusa-react"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CreateDiscountDetails } from "./create-discount-details.tsx"

const CreateDiscountSchema = zod.object({
  code: zod.string(),
})

type Schema = zod.infer<typeof CreateDiscountSchema>
export type CreateDiscountFormReturn = UseFormReturn<Schema>

export const CreateDiscountForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<Schema>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(CreateDiscountSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateDiscount()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        code: values.code,
      },
      {
        onSuccess: ({ discount }) => {
          handleSuccess(`../${discount.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex h-full w-full">
              <CreateDiscountDetails form={form} />
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
