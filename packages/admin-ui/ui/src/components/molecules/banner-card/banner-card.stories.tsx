import { ComponentMeta } from "@storybook/react"
import React from "react"
import BannerCard from "."
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"

export default {
  title: "Molecules/BannerCard",
  component: BannerCard,
} as ComponentMeta<typeof BannerCard>

const Template = ({ cardArgs, descriptionArgs, text }) => (
  <BannerCard {...cardArgs}>
    <BannerCard.Description {...descriptionArgs}>{text}</BannerCard.Description>
  </BannerCard>
)

export const CTA = Template.bind({})
CTA.args = {
  cardArgs: {
    title: "You’re ready to sell your first gift card?",
  },
  descriptionArgs: {
    cta: {
      label: "Create Gift Card",
      onClick: () => {},
    },
  },
  text: `No gift card has been added yet. Click the "Create Gift Card" button to add one. This is a growth opportunity!`,
}

export const GiftCard = Template.bind({})
GiftCard.args = {
  cardArgs: {
    title: "Tekla Gift Card",
    thumbnail:
      "https://images.ctfassets.net/4g6al16haqoj/kZT0jwrTOTGbDpK3XlRZQ/acb10c53c1acdd53cf1336b5f26fbb10/giftcard.jpg",
    actions: [
      {
        label: "Edit",
        onClick: () => {},
        icon: <EditIcon size={16} />,
      },
      {
        label: "Unpublish",
        onClick: () => {},
        icon: <UnpublishIcon size={16} />,
      },
      {
        label: "Delete",
        onClick: () => {},
        icon: <TrashIcon size={16} />,
        variant: "danger",
      },
    ],
  },
  text:
    "For the one partial to blank canvases, spontaneity, chance encounters and plot twists. The Tekla Gift Card is available in either digital or hard-copy format.",
}

export const GiftCardWithLongText = Template.bind({})
GiftCardWithLongText.args = {
  cardArgs: {
    title: "Tekla Gift Card",
    thumbnail:
      "https://images.ctfassets.net/4g6al16haqoj/kZT0jwrTOTGbDpK3XlRZQ/acb10c53c1acdd53cf1336b5f26fbb10/giftcard.jpg",
    actions: [
      {
        label: "Edit",
        onClick: () => {},
        icon: <EditIcon size={16} />,
      },
      {
        label: "Unpublish",
        onClick: () => {},
        icon: <UnpublishIcon size={16} />,
      },
      {
        label: "Delete",
        onClick: () => {},
        icon: <TrashIcon size={16} />,
        variant: "danger",
      },
    ],
  },
  text:
    "For the one partial to blank canvases, spontaneity, chance encounters and plot twists. The Tekla Gift Card is available in either digital or hard-copy format. For the one partial to blank canvases, spontaneity, chance encounters and plot twists. The Tekla Gift Card is available in either digital or hard-copy format. For the one partial to blank canvases, spontaneity, chance encounters and plot twists. The Tekla Gift Card is available in either digital or hard-copy format.",
}
