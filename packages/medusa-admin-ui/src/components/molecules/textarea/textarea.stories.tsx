import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import TextArea from "."

export default {
  title: "Molecules/Textarea",
  component: TextArea,
} as ComponentMeta<typeof TextArea>

const Template: ComponentStory<typeof TextArea> = (args) => (
  <TextArea {...args} />
)

export const Short = Template.bind({})
Short.args = {
  rows: 2,
  label: "Description",
  placeholder: "Normal",
  value: "Lorem ipsum something pretty basic ",
  required: false,
}

export const Overflow = Template.bind({})
Overflow.args = {
  rows: 2,
  label: "Description",
  placeholder: "Long description",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis lacus vitae velit tristique varius at sed sapien. Sed bibendum interdum imperdiet. Etiam et maximus libero. Ut fringilla velit non ultricies pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed placerat metus a dui viverra, ut elementum tortor rutrum. Suspendisse pote Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  required: false,
}

export const DynamicClamping = Template.bind({})
DynamicClamping.args = {
  rows: 4,
  label: "Description",
  placeholder: "Long description",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis lacus vitae velit tristique varius at sed sapien. Sed bibendum interdum imperdiet. Etiam et maximus libero. Ut fringilla velit non ultricies pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed placerat metus a dui viverra, ut elementum tortor rutrum. Suspendisse pote Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis lacus vitae velit tristique varius at sed sapien. Sed bibendum interdum imperdiet. Etiam et maximus libero. Ut fringilla velit non ultricies pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed placerat metus a dui viverra, ut elementum tortor rutrum. Suspendisse pote lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis lacus vitae velit tristique varius at sed sapien. Sed bibendum interdum imperdiet. Etiam et maximus libero. Ut fringilla velit non ultricies pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed placerat metus a dui viverra, ut elementum tortor rutrum. Suspendisse pote Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis lacus vitae velit tristique varius at sed sapien. Sed bibendum interdum imperdiet. Etiam et maximus libero. Ut fringilla velit non ultricies pulvinar. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed placerat metus a dui viverra, ut elementum tortor rutrum. Suspendisse pote ",
  required: false,
}
