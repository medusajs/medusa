import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { Text } from "@/components/text"
import { useToggleState } from "./use-toggle-state"

const Demo = () => {
  const { state, open, close, toggle } = useToggleState()

  return (
    <div className="flex flex-col items-center gap-y-4">
      <Text>State: {state ? "True" : "False"}</Text>
      <div className="flex items-center gap-x-4">
        <Button onClick={open}>Open</Button>
        <Button onClick={close}>Close</Button>
        <Button onClick={toggle}>Toggle</Button>
      </div>
    </div>
  )
}

const meta: Meta<typeof Demo> = {
  title: "Hooks/useToggleState",
  component: Demo,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Demo>

export const Default: Story = {}
