import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@medusajs/medusa"
import { Button, Drawer } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type EditProductOptionsFormProps = {
  product: Product
  handleSuccess: () => void
  subscribe: (state: boolean) => void
}

const EditProductOptionsSchema = zod.object({})

export const EditProductOptionsForm = (props: EditProductOptionsFormProps) => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof EditProductOptionsSchema>>({
    resolver: zodResolver(EditProductOptionsSchema),
  })

  /**
   * TODO
   *
   * The current API for dealing with product options requires that we fire of individual requests
   * for each product option. This is not ideal, and furthermore we can't update the options values.
   * Also requests to delete a product option is not possible as long as a product has one or more
   * variants. The design needs to be rethought, as we aren't likely to change the API before 2.0.
   *
   * Quick suggestions:
   *
   * - Add a modal (not a drawer as proportions would be off), with a single Title field,
   *   for creating a new product option.
   *
   * - Add some way to delete options, in a separate modal, or clicking an option and then
   *   clicking a delete button. We need to catch the error on trying to delete an option
   *   with variants, and show a message human readable (and translated) message to the user.
   *
   * cc: @ludvig18
   */

  return (
    <Form {...form}>
      <form className="flex flex-1 flex-col overflow-hidden">
        <Drawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto"></Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button type="submit" size="small">
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
