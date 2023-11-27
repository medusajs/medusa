export const specs = {
  workflows: {
    "create-cart": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\tsubgraph parallel1kMN [Parallel]\n\t\t\n\t\tfindOrCreateCustomer(findOrCreateCustomer)\n\t\tfindSalesChannel(findSalesChannel)\n\t\tsetContext(setContext)\n\t\tfindRegion(findRegion)\n\t\tend\n\t\t\n\t\t\n\t\tfindOrCreateAddresses(findOrCreateAddresses)\n\t\t\n\t\tcreateCart(createCart)\n\t\t\n\t\tattachLineItems(attachLineItems)\n\n\t\tfindRegion --> findOrCreateAddresses\n\t\t\n\t\tfindOrCreateAddresses --> createCart\n\t\t\n\t\tcreateCart --> attachLineItems",
      code: null,
    },
    "create-inventory-items": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tcreateInventoryItems(createInventoryItems)\n",
      code: null,
    },
    "create-product-variants": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tcreateProductVariants(createProductVariants)\n\t\t\n\t\t\n\t\tupsertPrices(upsertPrices)\n\n\t\tprepare --> createProductVariants\n\t\t\n\t\tcreateProductVariants --> upsertPrices",
      code: null,
    },
    "create-products": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tcreateProducts(createProducts)\n\t\t\n\t\tsubgraph parallel9xEo [Parallel]\n\t\t\n\t\tattachShippingProfile(attachShippingProfile)\n\t\tattachToSalesChannel(attachToSalesChannel)\n\t\tcreatePrices(createPrices)\n\t\tend\n\t\t\n\t\t\n\t\tcreateInventoryItems(createInventoryItems)\n\t\t\n\t\tattachInventoryItems(attachInventoryItems)\n\n\t\tprepare --> createProducts\n\t\t\n\t\tcreateProducts --> attachShippingProfile\n\t\t\n\t\tcreateProducts --> attachToSalesChannel\n\t\t\n\t\tcreateProducts --> createPrices\n\t\t\n\t\tcreatePrices --> createInventoryItems\n\t\t\n\t\tcreateInventoryItems --> attachInventoryItems",
      code: null,
    },
    "remove-price-list-prices": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tremovePriceListPrices(removePriceListPrices)\n\n\t\tprepare --> removePriceListPrices",
      code: null,
    },
    "remove-price-list-products": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tremovePriceListPriceSetPrices(removePriceListPriceSetPrices)\n\n\t\tprepare --> removePriceListPriceSetPrices",
      code: null,
    },
    "create-price-list": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tcreatePriceList(createPriceList)\n\n\t\tprepare --> createPriceList",
      code: null,
    },
    "delete-price-lists": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tremovePriceList(removePriceList)\n",
      code: null,
    },
    "remove-price-list-variants": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tremovePriceListPriceSetPrices(removePriceListPriceSetPrices)\n\n\t\tprepare --> removePriceListPriceSetPrices",
      code: null,
    },
    "update-price-lists": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\tprepare(prepare)\n\t\t\n\t\t\n\t\tupdatePriceList(updatePriceList)\n\n\t\tprepare --> updatePriceList",
      code: null,
    },
    "update-product-variants": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tupdateProductVariants(updateProductVariants)\n\t\t\n\t\t\n\t\tupsertPrices(upsertPrices)\n\n\t\tprepare --> updateProductVariants\n\t\t\n\t\tupdateProductVariants --> upsertPrices",
      code: null,
    },
    "update-products": {
      diagram:
        "%%{\n    init: {\n      'theme': 'base',\n      'themeVariables': {\n        'background': '#FFFFFF',\n        'mainBkg': '#FFFFFF',\n        'primaryColor': '#FFFFFF',\n        'primaryTextColor': '#030712',\n        'primaryBorderColor': '#D1D5DB',\n        'nodeBorder': '#D1D5DB',\n        'lineColor': '#11181C',\n        'fontFamily': 'Inter',\n        'fontSize': '13px',\n        'tertiaryColor': '#F3F4F6',\n        'tertiaryBorderColor': '#D1D5DB',\n        'tertiaryTextColor': '#030712'\n      }\n    }\n  }%%\n\tflowchart TB\n\t\t\n\t\tprepare(prepare)\n\t\t\n\t\tupdateProducts(updateProducts)\n\t\t\n\t\tsubgraph parallelZyiA [Parallel]\n\t\t\n\t\tupsertPrices(upsertPrices)\n\t\tattachSalesChannels(attachSalesChannels)\n\t\tdetachSalesChannels(detachSalesChannels)\n\t\tcreateInventoryItems(createInventoryItems)\n\t\tdetachInventoryItems(detachInventoryItems)\n\t\tend\n\t\t\n\t\t\n\t\tattachInventoryItems(attachInventoryItems)\n\t\t\n\t\tremoveInventoryItems(removeInventoryItems)\n\n\t\tprepare --> updateProducts\n\t\t\n\t\tupdateProducts --> upsertPrices\n\t\t\n\t\tupdateProducts --> attachSalesChannels\n\t\t\n\t\tupdateProducts --> detachSalesChannels\n\t\t\n\t\tupdateProducts --> createInventoryItems\n\t\t\n\t\tupdateProducts --> detachInventoryItems\n\t\t\n\t\tcreateInventoryItems --> attachInventoryItems\n\t\t\n\t\tdetachInventoryItems --> removeInventoryItems",
      code: null,
    },
  },
}
