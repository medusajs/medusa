import { ComponentMeta } from "@storybook/react"
import React from "react"
import ArrowLeftIcon from "./arrow-left-icon"
import ArrowRightIcon from "./arrow-right-icon"
import BellIcon from "./bell-icon"
import BellNotiIcon from "./bell-noti-icon"
import ChevronRightIcon from "./chevron-right-icon"
import CoinsIcon from "./coins-icon"
import CrosshairIcon from "./crosshair-icon"
import CustomerIcon from "./customer-icon"
import DollarSignIcon from "./dollar-sign-icon"
import EditIcon from "./edit-icon"
import GearIcon from "./gear-icon"
import GiftIcon from "./gift-icon"
import HappyIcon from "./happy-icon"
import MailIcon from "./mail-icon"
import MapPinIcon from "./map-pin-icon"
import MinusIcon from "./minus-icon"
import PercentIcon from "./percent-icon"
import PlusIcon from "./plus-icon"
import PublishIcon from "./publish-icon"
import SearchIcon from "./search-icon"
import SidedMouthFaceIcon from "./sided-mouth-face"
import TagIcon from "./tag-icon"
import TruckIcon from "./truck-icon"
import IconProps from "./types/icon-type"
import UnpublishIcon from "./unpublish-icon"
import UsersIcon from "./users-icon"

export default {
  title: "Fundamentals/Icons/Overview",
  component: TagIcon,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["24", "20", "16"],
      },
    },
  },
} as ComponentMeta<typeof TagIcon>

const icons = [
  <TagIcon />,
  <ArrowLeftIcon />,
  <ArrowRightIcon />,
  <BellIcon />,
  <BellNotiIcon />,
  <ChevronRightIcon />,
  <CoinsIcon />,
  <CrosshairIcon />,
  <CustomerIcon />,
  <DollarSignIcon />,
  <GearIcon />,
  <GiftIcon />,
  <HappyIcon />,
  <MailIcon />,
  <MapPinIcon />,
  <MinusIcon />,
  <PercentIcon />,
  <PlusIcon />,
  <SearchIcon />,
  <TruckIcon />,
  <UsersIcon />,
  <EditIcon />,
  <UnpublishIcon />,
  <PublishIcon />,
  <SidedMouthFaceIcon />,
]

const Template = (args: IconProps) => (
  <div className="grid grid-cols-6 gap-base">
    {icons.map((icon, key) => {
      return (
        <div
          key={key}
          className="bg-grey-10 rounded-base flex items-center justify-center p-base"
        >
          <div>{React.cloneElement(icon, args)}</div>
        </div>
      )
    })}
  </div>
)

export const Overview = Template.bind({})
// @ts-ignore
Overview.args = {
  size: "24",
  color: "currentColor",
}
