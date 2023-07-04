const computeShippingTotal = (shipping_methods) => {
  if (!shipping_methods) {
    return 0
  }
  return shipping_methods.reduce((acc, method) => acc + method.price, 0)
}

const computeSubtotal = (items) => {
  if (!items) {
    return 0
  }
  return items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0)
}

export { computeShippingTotal, computeSubtotal }
