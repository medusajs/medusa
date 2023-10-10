import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Container } from "@/components/container"
import { ProgressAccordion } from "./progress-accordion"

const meta: Meta<typeof ProgressAccordion> = {
  title: "Components/ProgressAccordion",
  component: ProgressAccordion,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta

type Story = StoryObj<typeof ProgressAccordion>

const AccordionDemo = () => {
  const [value, setValue] = React.useState(["1"])

  return (
    <div className="flex items-center justify-center p-8">
      <Container className="p-0">
        <ProgressAccordion
          value={value}
          onValueChange={setValue}
          type="multiple"
          className="w-full"
        >
          <ProgressAccordion.Item value="1">
            <ProgressAccordion.Header>Trigger 1</ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <div className="pb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                recusandae officiis aliquam quia, natus saepe obcaecati eligendi
                non animi fuga culpa, cum unde consequuntur architecto quos
                reiciendis deleniti eos iste!
              </div>
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>
          <ProgressAccordion.Item value="2">
            <ProgressAccordion.Header>Trigger 2</ProgressAccordion.Header>
            <ProgressAccordion.Content>
              <div className="pb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                recusandae officiis aliquam quia, natus saepe obcaecati eligendi
                non animi fuga culpa, cum unde consequuntur architecto quos
                reiciendis deleniti eos iste!
              </div>
            </ProgressAccordion.Content>
          </ProgressAccordion.Item>
        </ProgressAccordion>
      </Container>
    </div>
  )
}

export const Default: Story = {
  render: () => {
    return <AccordionDemo />
  },
  args: {},
}
