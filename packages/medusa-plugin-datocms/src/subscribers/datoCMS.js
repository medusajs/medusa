class DatoCMSSubscriber {
  constructor({
    datoCMSService,
    productVariantService,
    productService,
    eventBusService,
  }) {
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.datoCMSService_ = datoCMSService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("region.created", async (data) => {
      await this.datoCMSService_.createRegionInContentful(data)
    })

    this.eventBus_.subscribe("region.updated", async (data) => {
      await this.datoCMSService_.updateRegionInContentful(data)
    })

    this.eventBus_.subscribe("region.deleted", async (data) => {
      await this.datoCMSService_.archiveRegionInContentful(data)
    })

    this.eventBus_.subscribe("product-variant.updated", async (data) => {
      await this.datoCMSService_.updateProductVariantInContentful(data)
    })

    this.eventBus_.subscribe("product-variant.deleted", async (data) => {
      await this.datoCMSService_.archiveProductVariantInContentful(data)
    })

    this.eventBus_.subscribe("product.updated", async (data) => {
      await this.datoCMSService_.updateProductInContentful(data)
    })

    this.eventBus_.subscribe("product.created", async (data) => {
      await this.datoCMSService_.createProductInDatoCMS(data)
    })

    this.eventBus_.subscribe("product.deleted", async (data) => {
      await this.datoCMSService_.archiveProductInContentful(data)
    })
  }
}

export default DatoCMSSubscriber
