import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Heading } from "@/components/heading"
import { Text } from "@/components/text"
import { Container } from "./container"

const meta: Meta<typeof Container> = {
  title: "Components/Container",
  component: Container,
}

export default meta

type Story = StoryObj<typeof Container>

export const Default: Story = {
  args: {
    children: <Text>Hello World</Text>,
  },
  parameters: {
    layout: "centered",
  },
}

export const InLayout: Story = {
  render: () => (
    <div className="flex h-screen w-screen">
      <div className="border-ui-border-base w-full max-w-[216px] border-r p-4">
        <Heading level="h3">Menubar</Heading>
      </div>
      <div className="flex w-full flex-col gap-y-3 px-8 pb-8 pt-6">
        <Container>
          <Heading>Section 1</Heading>
        </Container>
        <Container>
          <Heading>Section 2</Heading>
        </Container>
        <Container>
          <Heading>Section 3</Heading>
        </Container>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
}
