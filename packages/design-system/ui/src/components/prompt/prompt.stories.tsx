import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "@/components/button"
import { Prompt } from "./prompt"

const meta: Meta<typeof Prompt> = {
  title: "Components/Prompt",
  component: Prompt,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof Prompt>

export const Default: Story = {
  render: () => {
    return (
      <Prompt>
        <Prompt.Trigger asChild>
          <Button>Open</Button>
        </Prompt.Trigger>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Delete something</Prompt.Title>
            <Prompt.Description>
              Are you sure? This cannot be undone.
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel>Cancel</Prompt.Cancel>
            <Prompt.Action>Delete</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    )
  },
}
