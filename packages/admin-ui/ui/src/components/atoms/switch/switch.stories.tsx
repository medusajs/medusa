import { ComponentMeta, ComponentStory } from "@storybook/react"
import React, { useEffect, useState } from "react"

import Switch from "./"

export default {
  title: "Atoms/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>

const Template: ComponentStory<typeof Switch> = (args) => {
  const [checked, setChecked] = useState(args.checked)

  useEffect(() => {
    setChecked(args.checked)
  }, [args.checked])

  return (
    <Switch
      {...args}
      checked={checked}
      onCheckedChange={(c) => setChecked(c)}
    />
  )
}

export const Default = Template.bind({})
Default.args = { checked: true }
