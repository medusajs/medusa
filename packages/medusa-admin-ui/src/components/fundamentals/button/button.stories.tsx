import { ComponentMeta } from "@storybook/react"
import React from "react"
import Button from "."
import HappyIcon from "../icons/happy-icon"

export default {
  title: "Fundamentals/Button",
  component: Button,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["large", "medium", "small"],
      },
    },
    variant: {
      control: {
        type: "select",
        options: ["primary", "secondary", "ghost"],
      },
    },
  },
} as ComponentMeta<typeof Button>

const Template = args => <Button {...args}>Action</Button>

export const PrimaryLarge = Template.bind({})
PrimaryLarge.args = {
  variant: "primary",
  size: "large",
}

export const PrimaryLargeLoading = Template.bind({})
PrimaryLargeLoading.args = {
  variant: "primary",
  size: "large",
  loading: true,
  children: "Loading",
}

export const PrimaryMedium = Template.bind({})
PrimaryMedium.args = {
  variant: "primary",
  size: "medium",
}

export const PrimaryMediumLoading = Template.bind({})
PrimaryMediumLoading.args = {
  variant: "primary",
  size: "medium",
  loading: true,
}

export const PrimarySmall = Template.bind({})
PrimarySmall.args = {
  variant: "primary",
  size: "small",
}

export const PrimarySmallLoading = Template.bind({})
PrimarySmallLoading.args = {
  variant: "primary",
  size: "small",
  loading: true,
}

export const SecondaryLarge = Template.bind({})
SecondaryLarge.args = {
  variant: "secondary",
  size: "large",
}

export const SecondaryLargeLoading = Template.bind({})
SecondaryLargeLoading.args = {
  variant: "secondary",
  size: "large",
  loading: true,
  children: "Loading",
}

export const SecondaryMedium = Template.bind({})
SecondaryMedium.args = {
  variant: "secondary",
  size: "medium",
}

export const SecondaryMediumLoading = Template.bind({})
SecondaryMediumLoading.args = {
  variant: "secondary",
  size: "medium",
  loading: true,
}

export const SecondarySmall = Template.bind({})
SecondarySmall.args = {
  variant: "secondary",
  size: "small",
}

export const SecondarySmallLoading = Template.bind({})
SecondarySmallLoading.args = {
  variant: "secondary",
  size: "small",
  loading: true,
}

export const GhostLarge = Template.bind({})
GhostLarge.args = {
  variant: "ghost",
  size: "large",
}

export const GhostLargeLoading = Template.bind({})
GhostLargeLoading.args = {
  variant: "ghost",
  size: "large",
  loading: true,
  children: "Loading",
}

export const GhostMedium = Template.bind({})
GhostMedium.args = {
  variant: "ghost",
  size: "medium",
}

export const GhostMediumLoading = Template.bind({})
GhostMediumLoading.args = {
  variant: "ghost",
  size: "medium",
  loading: true,
}

export const GhostSmall = Template.bind({})
GhostSmall.args = {
  variant: "ghost",
  size: "small",
}

export const GhostSmallLoading = Template.bind({})
GhostSmallLoading.args = {
  variant: "ghost",
  size: "small",
  loading: true,
}

const TemplateWithIcon = args => (
  <Button {...args}>
    <HappyIcon size={20} /> Action
  </Button>
)

export const PrimaryLargeIcon = TemplateWithIcon.bind({})
PrimaryLargeIcon.args = {
  variant: "primary",
  size: "large",
}

export const PrimaryMediumIcon = TemplateWithIcon.bind({})
PrimaryMediumIcon.args = {
  variant: "primary",
  size: "medium",
}

export const PrimarySmallIcon = TemplateWithIcon.bind({})
PrimarySmallIcon.args = {
  variant: "primary",
  size: "small",
}

export const SecondaryLargeIcon = TemplateWithIcon.bind({})
SecondaryLargeIcon.args = {
  variant: "secondary",
  size: "large",
}

export const SecondaryMediumIcon = TemplateWithIcon.bind({})
SecondaryMediumIcon.args = {
  variant: "secondary",
  size: "medium",
}

export const SecondarySmallIcon = TemplateWithIcon.bind({})
SecondarySmallIcon.args = {
  variant: "secondary",
  size: "small",
}

export const GhostLargeIcon = TemplateWithIcon.bind({})
GhostLargeIcon.args = {
  variant: "ghost",
  size: "large",
}

export const GhostMediumIcon = TemplateWithIcon.bind({})
GhostMediumIcon.args = {
  variant: "ghost",
  size: "medium",
}

export const GhostSmallIcon = TemplateWithIcon.bind({})
GhostSmallIcon.args = {
  variant: "ghost",
  size: "small",
}
