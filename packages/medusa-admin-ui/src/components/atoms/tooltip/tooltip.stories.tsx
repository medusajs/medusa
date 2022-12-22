import { ComponentMeta, ComponentStory } from "@storybook/react"
import clsx from "clsx"
import React from "react"
import Tooltip from "."

export default {
  title: "Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    triggerPosition: {
      options: [
        "top left",
        "top right",
        "top center",
        "center center",
        "center right",
        "center left",
        "bottom left",
        "bottom right",
        "bottom center",
      ],
      control: {
        type: "select",
      },
      defaultValue: "top left",
    },
  },
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<any> = ({ triggerPosition, ...props }) => {
  return (
    <div
      className={clsx(
        {
          ["justify-start content-start"]: triggerPosition === "top left",
          ["justify-center content-start"]: triggerPosition === "top center",
          ["justify-end content-start"]: triggerPosition === "top right",
          ["justify-start content-center"]: triggerPosition === "center left",
          ["place-content-center"]: triggerPosition === "center center",
          ["justify-end content-center"]: triggerPosition === "center right",
          ["justify-start content-end"]: triggerPosition === "bottom left",
          ["justify-center content-end"]: triggerPosition === "bottom center",
          ["justify-end content-end"]: triggerPosition === "bottom right",
        },
        "min-h-full grid"
      )}
    >
      <Tooltip {...props}>
        <button className="btn btn-secondary btn-medium">hover!</button>
      </Tooltip>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  content: "Tags are one word descriptors for the product used for searches",
  sideOffset: 10,
}

export const Controlled = Template.bind({})
Controlled.args = {
  open: true,
  content: "Tags are one word descriptors for the product used for searches",
  sideOffset: 10,
}
