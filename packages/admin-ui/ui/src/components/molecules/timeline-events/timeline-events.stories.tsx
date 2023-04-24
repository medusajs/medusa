import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import Avatar from "../../atoms/avatar"
import Button from "../../fundamentals/button"
import AlertIcon from "../../fundamentals/icons/alert-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import BackIcon from "../../fundamentals/icons/back-icon"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import MailIcon from "../../fundamentals/icons/mail-icon"
import PackageIcon from "../../fundamentals/icons/package-icon"
import TruckIcon from "../../fundamentals/icons/truck-icon"
import EventActionables from "./event-actionables"
import EventContainer, { EventIconColor } from "./event-container"
import EventItemContainer from "./event-item-container"

export default {
  title: "Molecules/EventContainer",
  component: EventContainer,
} as ComponentMeta<typeof EventContainer>

const Template: ComponentStory<typeof EventContainer> = (args) => (
  <div className="max-w-md px-xlarge py-large">
    <EventContainer {...args} />
  </div>
)

const eventActions = (
  <EventActionables
    actions={[
      {
        label: "Dummy Action",
        icon: <BackIcon size={20} />,
        onClick: () => {},
      },
    ]}
  />
)

export const NoteCurrentUser = Template.bind({})
NoteCurrentUser.args = {
  icon: <Avatar user={{ email: "kasper@medusajs.com" }} />,
  title: "kasper@medusajs.com",
  topNode: eventActions,
  time: new Date(),
  children: (
    <div className="bg-violet-5 text-violet-90 rounded-2xl px-base py-base">
      Return will be shipped together with return 74421
    </div>
  ),
}

export const NoteOtherUser = Template.bind({})
NoteOtherUser.args = {
  icon: <Avatar user={{ email: "oli@medusajs.com" }} />,
  title: "oli@medusajs.com",
  topNode: eventActions,
  time: new Date(),
  children: (
    <div className="bg-grey-5 rounded-2xl px-base py-base">
      Added discount code: "OLI_DISCOUNT"
    </div>
  ),
}

export const MailNotice = Template.bind({})
MailNotice.args = {
  icon: <MailIcon size={20} />,
  time: new Date(),
  title: "Shipment Notice Sent",
  midNode: (
    <div className="flex items-center">
      <div className="text-grey-40 mr-2xsmall">
        <ArrowRightIcon size={16} />
      </div>
      <span>kasper@medusajs.com</span>
    </div>
  ),
  topNode: eventActions,
}

const bathrobe = {
  title: "Hooded Bathrobe",
  thumbnail:
    "https://images.ctfassets.net/4g6al16haqoj/2f87V5hComRvKsAJGJqXd1/768a1256ed7f51b6833d2fdb270ab861/robe_for_green_2665_copy.jpg?w=1666&h=2082&q=50&fm=webp",
  quantity: 1,
  variant: {
    title: "Extra Small",
  },
}

const sleepwear = {
  title: "Flannel Sleepwear",
  thumbnail:
    "https://images.ctfassets.net/4g6al16haqoj/7DiYDZz6olzxMECmqlFGog/e15481f823dd1a102e80f624d1fe14a5/male_frontal_0003_pj_mid_blu_0541.jpg?w=1678&h=2098&q=50&fm=webp",
  quantity: 2,
  variant: {
    title: "Large",
  },
}

export const ItemsShipped = Template.bind({})
ItemsShipped.args = {
  icon: <TruckIcon size={20} />,
  time: new Date(),
  title: "Items Shipped",
  children: [
    <EventItemContainer item={bathrobe} />,
    <EventItemContainer item={sleepwear} />,
  ],
}

export const ItemsFulfilled = Template.bind({})
ItemsFulfilled.args = {
  icon: <PackageIcon size={20} />,
  time: new Date(),
  title: "Items Fulfilled",
  children: [
    <EventItemContainer item={bathrobe} />,
    <EventItemContainer item={sleepwear} />,
  ],
}

export const OrderPlaced = Template.bind({})
OrderPlaced.args = {
  icon: <CheckCircleIcon size={20} />,
  iconColor: EventIconColor.GREEN,
  time: new Date(),
  title: "Order Placed",
  topNode: <div className="inter-small-semibold">4,756.50 kr.</div>,
}

export const ReturnRequested = Template.bind({})
ReturnRequested.args = {
  icon: <AlertIcon size={20} />,
  iconColor: EventIconColor.ORANGE,
  topNode: eventActions,
  time: new Date(),
  title: "Return Requested",
  noNotification: true,
  children: [
    <EventItemContainer item={bathrobe} />,
    <EventItemContainer item={sleepwear} />,
    <Button variant="secondary" size="small" className="mt-large">
      Receive Return
    </Button>,
  ],
}

const Demo = (args) => (
  <div className="w-full bg-grey-10 p-xlarge">
    <div className="max-w-md px-xlarge py-large flex flex-col gap-y-base bg-grey-0 rounded-rounded border border-grey-20">
      {args.arguments.map((arg, i) => {
        return (
          <EventContainer {...arg} isFirst={i === args.arguments.length - 1} />
        )
      })}
    </div>
  </div>
)

export const InLine = Demo.bind({})
InLine.args = {
  arguments: [
    NoteCurrentUser.args,
    ReturnRequested.args,
    MailNotice.args,
    ItemsShipped.args,
    ItemsFulfilled.args,
    NoteOtherUser.args,
    OrderPlaced.args,
  ],
}
