import { ComponentMeta } from "@storybook/react"
import React from "react"
import PageDescription from "."

export default {
  title: "Atoms/PageDescription",
  component: PageDescription,
} as ComponentMeta<typeof PageDescription>

const Template = args => <PageDescription {...args} />

export const TitleAndSubtitle = Template.bind({})
TitleAndSubtitle.args = {
  title: "Region",
  subtitle: "Manage your regions",
}

export const TitleOnly = Template.bind({})
TitleOnly.args = {
  title: "Region",
}

export const SubtitleOnly = Template.bind({})
SubtitleOnly.args = {
  subtitle: "Manage your regions",
}
