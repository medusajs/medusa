import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { Container } from "../container"
import { ProgressTabs } from "./progress-tabs"

const meta: Meta<typeof ProgressTabs> = {
  title: "Components/ProgressTabs",
  component: ProgressTabs,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof ProgressTabs>

const Demo = () => {
  return (
    <div className="h-screen max-h-[500px] w-screen max-w-[700px] overflow-hidden p-4">
      <Container className="h-full w-full overflow-hidden p-0">
        <ProgressTabs defaultValue="tab1">
          <ProgressTabs.List>
            <ProgressTabs.Trigger value="tab1">Tab 1</ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="tab2">Tab 2</ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="tab3" disabled>
              Tab 3
            </ProgressTabs.Trigger>
          </ProgressTabs.List>
          <div className="txt-compact-medium text-ui-fg-base border-ui-border-base h-full border-t p-3">
            <ProgressTabs.Content value="tab1">
              Tab 1 content
            </ProgressTabs.Content>
            <ProgressTabs.Content value="tab2">
              Tab 2 content
            </ProgressTabs.Content>
            <ProgressTabs.Content value="tab3">
              Tab 3 content
            </ProgressTabs.Content>
          </div>
        </ProgressTabs>
      </Container>
    </div>
  )
}

export const Default: Story = {
  render: () => <Demo />,
}
