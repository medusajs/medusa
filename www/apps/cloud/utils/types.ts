export type PricingQueryResult = Array<{
  _id: string
  _type: "heroPricing" | "featureTable"
  featureTableFields: FeatureTableFields | null
  heroPricingFields: HeroPricingFields | null
}>

export type HeroPricingFields = {
  options: Array<{
    _key: string
    _type: "option"
    buttons: Array<{
      _key: string
      _type: "button"
      link: {
        _type: "link"
        label: string
        path?: string
        url?: string
        type: string
      }
      size: string
      variant: string
    }>
    description: string
    features: string[]
    subtitle: string
    title: string
    pre_features?: string
    titleLine2?: string
  }>
}

export type FeatureTableFields = {
  columnHeaders: string[]
  featureSections: Array<{
    _key: string
    header: {
      _type: "sectionHeader"
      icon: {
        _type: "image"
        asset: {
          _ref: string
          _type: "reference"
        }
      }
      subtitle: string
      title: string
    }
    rows: Array<{
      _key: string
      column1: Block[]
      column2: Block[]
      column3: Block[]
      column4: Block[]
    }>
  }>
  links: Array<{
    _key: string
    _type: "button"
    link: {
      _type: "link"
      label: string
      path: string
      type: string
    }
    size: string
    variant: string
  }>
}

export type Block = {
  _key: string
  _type: "block"
  children: Array<Span | TooltipBlock>
  markDefs: any[]
  style: string
}

export type Span = {
  _key: string
  _type: "span"
  marks: string[]
  text: string
}

export type TooltipBlock = {
  _key: string
  _type: "tooltipBlock"
  text: string
}
