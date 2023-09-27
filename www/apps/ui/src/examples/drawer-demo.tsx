import { Button, Drawer, Text } from "@medusajs/ui"

export default function DrawerDemo() {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Edit Variant</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Variant</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <Text>This is where you edit the variant&apos;s details</Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
