import React from "react"
import { Route, Routes } from "react-router-dom"
import { useTranslation } from "react-i18next"
import SettingsCard from "../../components/atoms/settings-card"
import Spacer from "../../components/atoms/spacer"
import SettingContainer from "../../components/extensions/setting-container"
import SettingsPageErrorElement from "../../components/extensions/setting-container/setting-error-element"
import FeatureToggle from "../../components/fundamentals/feature-toggle"
import ArrowUTurnLeft from "../../components/fundamentals/icons/arrow-uturn-left"
import ChannelsIcon from "../../components/fundamentals/icons/channels-icon"
import CoinsIcon from "../../components/fundamentals/icons/coins-icon"
import CrosshairIcon from "../../components/fundamentals/icons/crosshair-icon"
import GearIcon from "../../components/fundamentals/icons/gear-icon"
import HappyIcon from "../../components/fundamentals/icons/happy-icon"
import KeyIcon from "../../components/fundamentals/icons/key-icon"
import MapPinIcon from "../../components/fundamentals/icons/map-pin-icon"
import TaxesIcon from "../../components/fundamentals/icons/taxes-icon"
import UsersIcon from "../../components/fundamentals/icons/users-icon"
import { useSettings } from "../../providers/setting-provider"
import CurrencySettings from "./currencies"
import Details from "./details"
import PersonalInformation from "./personal-information"
import Regions from "./regions"
import ReturnReasons from "./return-reasons"
import Taxes from "./taxes"
import Users from "./users"
import { TranslationText } from "../../types/shared"

type SettingsCardType = {
  heading: TranslationText
  description: TranslationText
  icon?: React.ComponentType
  to: string
  feature_flag?: string
}

const settings: SettingsCardType[] = [
  {
    heading: {
      defaultText: "API Key Management",
      translationKey: "settings-api-key-management",
    },
    description: {
      defaultText: "Create and manage API keys",
      translationKey: "settings-api-key-management-description",
    },
    icon: KeyIcon,
    to: "/a/publishable-api-keys",
    feature_flag: "publishable_api_keys",
  },
  {
    heading: {
      defaultText: "Currencies",
      translationKey: "settings-currencies",
    },
    description: {
      defaultText: "Manage the currencies of your store",
      translationKey: "settings-currencies-description",
    },
    icon: CoinsIcon,
    to: "/a/settings/currencies",
  },
  {
    heading: {
      defaultText: "Personal Information",
      translationKey: "settings-personal-information",
    },
    description: {
      defaultText: "Manage your Medusa profile",
      translationKey: "settings-personal-information-description",
    },
    icon: HappyIcon,
    to: "/a/settings/personal-information",
  },
  {
    heading: {
      defaultText: "Regions",
      translationKey: "settings-regions",
    },
    description: {
      defaultText: "Manage shipping, payment, and fulfillment across regions",
      translationKey: "settings-regions-description",
    },
    icon: MapPinIcon,
    to: "/a/settings/regions",
  },
  {
    heading: {
      defaultText: "Return Reasons",
      translationKey: "settings-return-reasons",
    },
    description: {
      defaultText: "Manage reasons for returned items",
      translationKey: "settings-return-reasons-description",
    },
    icon: ArrowUTurnLeft,
    to: "/a/settings/return-reasons",
  },
  {
    heading: {
      defaultText: "Sales Channels",
      translationKey: "settings-sales-channels",
    },
    description: {
      defaultText: "Control which product are available in which channels",
      translationKey: "settings-sales-channels-description",
    },
    icon: ChannelsIcon,
    feature_flag: "sales_channels",
    to: "/a/sales-channels",
  },
  {
    heading: {
      defaultText: "Store Details",
      translationKey: "settings-store-details",
    },
    description: {
      defaultText: "Manage your business details",
      translationKey: "settings-store-details-description",
    },
    icon: CrosshairIcon,
    to: "/a/settings/details",
  },
  {
    heading: {
      defaultText: "Taxes",
      translationKey: "settings-taxes",
    },
    description: {
      defaultText: "Manage taxes across regions and products",
      translationKey: "settings-taxes-description",
    },
    icon: TaxesIcon,
    to: "/a/settings/taxes",
  },
  {
    heading: {
      defaultText: "The Team",
      translationKey: "settings-the-team",
    },
    description: {
      defaultText: "Manage users of your Medusa Store",
      translationKey: "settings-the-team-description",
    },
    icon: UsersIcon,
    to: "/a/settings/team",
  },
]

const renderCard = ({
  heading,
  description,
  icon,
  to,
  feature_flag,
}: SettingsCardType) => {
  const Icon = icon || GearIcon

  const card = (
    <SettingsCard
      heading={heading}
      description={description}
      icon={<Icon />}
      to={to}
    />
  )

  if (feature_flag) {
    return <FeatureToggle featureFlag={feature_flag}>{card}</FeatureToggle>
  }

  return card
}

const SettingsIndex = () => {
  const { getCards } = useSettings()

  const extensionCards = getCards()

  const { t } = useTranslation()

  return (
    <div className="gap-y-xlarge flex flex-col">
      <div className="gap-y-large flex flex-col">
        <div className="gap-y-2xsmall flex flex-col">
          <h2 className="inter-xlarge-semibold">General</h2>
          <p className="inter-base-regular text-grey-50">
            {t(
              "settings-manage-the-general-settings-for-your-store",
              "Manage the general settings for your store"
            )}
          </p>
        </div>
        <div className="medium:grid-cols-2 gap-y-xsmall grid grid-cols-1 gap-x-4">
          {settings.map((s) => renderCard(s))}
        </div>
      </div>
      {extensionCards.length > 0 && (
        <div className="gap-y-large flex flex-col">
          <div className="gap-y-2xsmall flex flex-col">
            <h2 className="inter-xlarge-semibold">Extensions</h2>
            <p className="inter-base-regular text-grey-50">
              {t(
                "settings-manage-the-settings-for-your-store-apos-s-extensions",
                "Manage the settings for your store&apos;s extensions"
              )}
            </p>
          </div>
          <div className="medium:grid-cols-2 gap-y-xsmall grid grid-cols-1 gap-x-4">
            {getCards().map((s) =>
              renderCard({
                heading: s.label,
                description: s.description,
                icon: s.icon,
                to: `/a/settings${s.path}`,
              })
            )}
          </div>
        </div>
      )}
      <Spacer />
    </div>
  )
}

const Settings = () => {
  const { getSettings } = useSettings()

  return (
    <Routes>
      <Route index element={<SettingsIndex />} />
      <Route path="/details" element={<Details />} />
      <Route path="/regions/*" element={<Regions />} />
      <Route path="/currencies" element={<CurrencySettings />} />
      <Route path="/return-reasons" element={<ReturnReasons />} />
      <Route path="/team" element={<Users />} />
      <Route path="/personal-information" element={<PersonalInformation />} />
      <Route path="/taxes/*" element={<Taxes />} />
      {getSettings().map((s) => (
        <Route
          key={s.path}
          path={s.path}
          element={<SettingContainer Page={s.Page} />}
          errorElement={<SettingsPageErrorElement origin={s.origin} />}
        />
      ))}
    </Routes>
  )
}

export default Settings
