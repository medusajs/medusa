import { ComponentMeta, ComponentStory } from "@storybook/react"
import React, { useState } from "react"
import Fade from "."
import Button from "../../fundamentals/button"
import FocusModal from "../../molecules/modal/focus-modal"

export default {
  title: "Atoms/Fade",
  component: Fade,
} as ComponentMeta<typeof Fade>

const Template: ComponentStory<typeof Fade> = (args) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button size="small" variant="primary" onClick={() => setOpen(!open)}>
        Fade
      </Button>
      <Fade
        start={args.start}
        end={args.end}
        isVisible={open}
        isFullScreen={!!args.isFullScreen}
      >
        {args.children}
      </Fade>
    </div>
  )
}

export const Standard = Template.bind({})
Standard.args = {
  children: (
    <div className="mt-24">
      <h1 className="inter-xlarge-semibold mb-8">Title</h1>
      <span className="inter-base-semibold mb-4">Subtitle</span>
    </div>
  ),
}

export const CustomAnimation = Template.bind({})
CustomAnimation.args = {
  start: "translate-x-full",
  end: "translate-x-0",
  children: (
    <div className="mt-24">
      <h1 className="inter-xlarge-semibold mb-8">Title</h1>
      <span className="inter-base-semibold mb-4">Subtitle</span>
    </div>
  ),
}

export const FullScreenFade = Template.bind({})
FullScreenFade.args = {
  isFullScreen: true,
  children: (
    <FocusModal>
      <FocusModal.Header>
        <h1>Testing</h1>
      </FocusModal.Header>
      <FocusModal.Main>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <span className="inter-base-regular" key={i}>
            {i}
          </span>
        ))}
      </FocusModal.Main>
    </FocusModal>
  ),
}
