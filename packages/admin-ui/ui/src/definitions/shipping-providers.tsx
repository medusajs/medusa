import React from "react"
import EasyShipLogo from "../components/fundamentals/logos/easyship"
import PirateShipLogo from "../components/fundamentals/logos/pirateship"
import ShipHeroLogo from "../components/fundamentals/logos/shiphero"
import ShippoLogo from "../components/fundamentals/logos/shippo"
import ShipStationLogo from "../components/fundamentals/logos/shipstation"
import { UniscoLogo } from "../components/fundamentals/logos/unisco"

export interface ShippingProviderDetails {
  name: string
  logo: React.FC<any>
}

export const shippingProviderDetails: {
  [key: string]: ShippingProviderDetails
} = {
  shipstation: {
    name: "ShipStation",
    logo: ShipStationLogo,
  },
  shippo: {
    name: "Shippo",
    logo: (props) => <ShippoLogo {...props} height="36" />,
  },
  shiphero: {
    name: "ShipHero",
    logo: (props) => <ShipHeroLogo {...props} height="40" />,
  },
  pirateship: {
    name: "PirateShip",
    logo: (props) => <PirateShipLogo {...props} height="40" />,
  },
  easyship: {
    name: "EasyShip",
    logo: (props) => <EasyShipLogo {...props} height="28" />,
  },
  unisco: {
    name: "Unisco",
    logo: (props) => <UniscoLogo {...props} className="h-[40px]" />,
  },
}
