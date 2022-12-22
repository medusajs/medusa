import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import NoteInput from "."

export default {
  title: "Molecules/NoteInput",
  component: NoteInput,
} as ComponentMeta<typeof NoteInput>

const Template: ComponentStory<typeof NoteInput> = (args) => {
  const [note, setNote] = useState<string | undefined>("note", undefined)
  return (
    <div className="max-w-md px-xlarge py-large">
      <NoteInput {...args} onSubmit={setNote} />
      <div>{note}</div>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {}
