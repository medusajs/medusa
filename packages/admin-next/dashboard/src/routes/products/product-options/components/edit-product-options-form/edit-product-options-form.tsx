import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { RouteDrawer } from "../../../../../components/route-modal"

type EditProductOptionsFormProps = {
  product: Product
}

const EditProductOptionsSchema = zod.object({})

export const EditProductOptionsForm = (props: EditProductOptionsFormProps) => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof EditProductOptionsSchema>>({
    resolver: zodResolver(EditProductOptionsSchema),
  })

  return (
    <RouteDrawer.Form form={form}>
      <form className="flex flex-1 flex-col overflow-hidden">
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto"></RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
