import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { RouteDrawer } from "../../../../components/modals"
import { EDIT_DRAFT_ORDER_PERMISSIONS } from "../../../../lib/permissions"

const CustomItems = () => {
  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit Custom Items</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      <CustomItemsForm />
    </RouteDrawer>
  )
}

const CustomItemsForm = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm className="flex flex-1 flex-col">
        <RouteDrawer.Body></RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex justify-end gap-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit">
              Save
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}

const schema = z.object({
  email: z.string().email(),
})

export const handle = {
  permissions: EDIT_DRAFT_ORDER_PERMISSIONS,
}

export default CustomItems
