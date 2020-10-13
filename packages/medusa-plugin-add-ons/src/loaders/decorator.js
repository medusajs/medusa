export default (container, config) => {
  const cartService = container.resolve("cartService")
  const addOnLineItemService = container.resolve("addOnLineItemService")

  cartService.addDecorator(async (cart) => {
    try {
      cart.items = await Promise.all(
        cart.items.map((item) => {
          if (item.metadata && item.metadata.add_ons) {
            return addOnLineItemService.decorate(
              item,
              ["title", "quantity", "thumbnail", "content", "should_merge"],
              ["add_ons"]
            )
          } else {
            return item
          }
        })
      )

      return cart
    } catch (error) {
      return cart
    }
  })
}
