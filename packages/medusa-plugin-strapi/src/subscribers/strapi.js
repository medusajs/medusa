class StrapiSubscriber {
  constructor({
    strapiService,
    productVariantService,
    productService,
    eventBusService,
  }) {
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.strapiService_ = strapiService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("region.created", async (data) => {
      await this.strapiService_.createRegionInStrapi(data)
    })

    this.eventBus_.subscribe("region.updated", async (data) => {
      await this.strapiService_.updateRegionInStrapi(data)
    })

    this.eventBus_.subscribe("product-variant.updated", async (data) => {
      await this.strapiService_.updateProductVariantInStrapi(data)
    })

    this.eventBus_.subscribe("product.updated", async (data) => {
      await this.strapiService_.updateProductInStrapi(data)
    })

    this.eventBus_.subscribe("product.created", async (data) => {
      await this.strapiService_.createProductInStrapi(data)
    })
  }
}

export default StrapiSubscriber
