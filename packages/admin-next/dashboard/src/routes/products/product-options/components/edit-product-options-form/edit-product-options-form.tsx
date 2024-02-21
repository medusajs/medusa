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
