import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { FocusModal } from "./focus-modal"

const meta: Meta<typeof FocusModal> = {
  title: "Components/FocusModal",
  component: FocusModal,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof FocusModal>

export const Default: Story = {
  render: () => {
    return (
      <FocusModal>
        <FocusModal.Trigger asChild>
          <Button>Edit Variant</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <Button>Save</Button>
          </FocusModal.Header>
          <FocusModal.Body></FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    )
  },
}
