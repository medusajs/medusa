export const originalAndNewCartTransformer = (context, preparedData, cart) => {
  return {
    cart,
    originalCart: preparedData.cart,
  }
}

export const createMethodsDataTransformer = (
  context,
  preparedData,
  validatedData,
  price
) => {
  return {
    option: preparedData.shippingOption,
    data: validatedData,
    config: preparedData.shippingMethodConfig,
    price: price.price,
  }
}

export const prepareDeleteMethodsDataTransformer = (
  context,
  preparedData,
  shippingMethods
) => {
  const { cart } = preparedData

  if (!cart.shipping_methods?.length) {
    return []
  }

  const toDelete: any[] = []

  for (const method of cart.shipping_methods) {
    if (
      shippingMethods.shippingMethods.some(
        (m) =>
          m.shipping_option.profile_id === method.shipping_option.profile_id
      )
    ) {
      toDelete.push(method)
    }
  }

  return {
    shippingMethods: toDelete,
  }
}
