import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { Drawer } from "./drawer"

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => {
    return (
      <Drawer>
        <Drawer.Trigger asChild>
          <Button>Edit Variant</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Variant</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body></Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Drawer.Close>
            <Button>Save</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    )
  },
}
