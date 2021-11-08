class SanitySubscriber {
  constructor({
    sanityService,
    productVariantService,
    productService,
    eventBusService,
  }) {
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.sanityService_ = sanityService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("region.created", async (data) => {
      await this.sanityService_.createRegionInSanity(data)
    })

    this.eventBus_.subscribe("region.updated", async (data) => {
      await this.sanityService_.updateRegionInSanity(data)
    })

    this.eventBus_.subscribe("region.deleted", async (data) => {
      await this.sanityService_.updateRegionInSanity(data)
    })

    this.eventBus_.subscribe("product-variant.updated", async (data) => {
      await this.sanityService_.updateProductVariantInSanity(data)
    })

    this.eventBus_.subscribe("product-variant.deleted", async (data) => {
      await this.sanityService_.archiveProductVariantInSanity(data)
    })

    this.eventBus_.subscribe("product.updated", async (data) => {
      await this.sanityService_.updateProductInSanity(data)
    })

    this.eventBus_.subscribe("product.created", async (data) => {
      await this.sanityService_.createProductInSanity(data)
    })

    this.eventBus_.subscribe("product.deleted", async (data) => {
      await this.sanityService_.archiveProductInSanity(data)
    })
  }
}

export default SanitySubscriber
