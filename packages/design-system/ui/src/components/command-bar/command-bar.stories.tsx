import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Button } from "../button"
import { CommandBar } from "./command-bar"

const meta: Meta<typeof CommandBar> = {
  title: "Components/CommandBar",
  component: CommandBar,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

type Story = StoryObj<typeof CommandBar>

const CommandBarDemo = () => {
  const [active, setActive] = React.useState(false)

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button onClick={() => setActive(!active)}>
        {active ? "Hide" : "Show"}
      </Button>
      <CommandBar open={active}>
        <CommandBar.Bar>
          <CommandBar.Value>1 selected</CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            label="Edit"
            action={() => {
              console.log("Edit")
            }}
            shortcut="e"
          />
          <CommandBar.Seperator />
          <CommandBar.Command
            label="Delete"
            action={() => {
              console.log("Delete")
            }}
            shortcut="d"
          />
        </CommandBar.Bar>
      </CommandBar>
    </div>
  )
}

export const Default: Story = {
  render: () => <CommandBarDemo />,
}
