import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Accordion from "."
import InputField from "../../molecules/input"

export default {
  title: "Organisms/Accordion",
  component: Accordion,
} as ComponentMeta<typeof Accordion>

const Template: ComponentStory<typeof Accordion> = (args) => (
  <div className="max-w-3xl max-h-6xlarge">
    <Accordion {...args}>
      <Accordion.Item
        title={"General"}
        required
        value={"item.1"}
        description="test 12342 "
      >
        <div className="flex flex-col gap-y-small">
          <InputField label="First Name" />
          <InputField label="Last Name" />
        </div>
      </Accordion.Item>
      <Accordion.Item
        title="Configuration"
        description="The price overrides apply from the time you hit the publish button and forever if left untouched."
        tooltip="You could add some useful information here."
        value={"item.2"}
      >
        <div className="flex flex-col gap-y-small">
          <InputField label="Limit" />
          <InputField label="Amount" />
          <InputField label="Scale" />
        </div>
      </Accordion.Item>
      <Accordion.Item
        title="Prices"
        description="The price overrides apply from the time you hit the publish button and forever if left untouched."
        value={"item.3"}
      >
        <div className="flex flex-col gap-y-small">
          <InputField label="Limit" />
          <InputField label="Amount" />
          <InputField label="Scale" />
        </div>
      </Accordion.Item>
      <Accordion.Item
        forceMountContent
        title="Metadata"
        description="The price overrides apply from the time you hit the publish button and forever if left untouched."
        tooltip="You could add some useful information here."
        value={"item.4"}
      >
        <div className="flex flex-col gap-y-small">
          <InputField label="Limit" />
          <InputField label="Amount" />
          <InputField label="Scale" />
        </div>
      </Accordion.Item>
    </Accordion>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  defaultValue: ["item.1"],
  type: "multiple",
}
