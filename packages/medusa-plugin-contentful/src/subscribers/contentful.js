class ContentfulSubscriber {
  constructor({ contentfulService, eventBusService }) {
    this.contentfulService_ = contentfulService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("product-variant.updated", async (data) => {
      await this.contentfulService_.updateProductVariantInContentful(data)
    })

    this.eventBus_.subscribe("product.updated", async (data) => {
      await this.contentfulService_.updateProductInContentful(data)
    })

    this.eventBus_.subscribe("product.created", async (data) => {
      await this.contentfulService_.createProductInContentful(data)
    })
  }
}

export default ContentfulSubscriber
