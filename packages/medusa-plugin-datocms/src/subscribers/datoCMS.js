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
      console.log(data)
      await this.datoCMSService_.createRegionInDatoCMS(data)
    })

    this.eventBus_.subscribe("region.updated", async (data) => {
      await this.datoCMSService_.updateRegionInDatoCMS(data)
    })

    this.eventBus_.subscribe("region.deleted", async (data) => {
      await this.datoCMSService_.deleteRegionInDatoCMS(data)
    })

    // this.eventBus_.subscribe("product-variant.created", async (data) => {
    //   await this.datoCMSService_.createProductVariantInDatoCMS(data)
    // })

    this.eventBus_.subscribe("product-variant.updated", async (data) => {
      await this.datoCMSService_.updateProductVariantInDatoCMS(data)
    })

    this.eventBus_.subscribe("product-variant.deleted", async (data) => {
      await this.datoCMSService_.deleteProductVariantInDatoCMS(data)
    })

    this.eventBus_.subscribe("product.created", async (data) => {
      await this.datoCMSService_.createProductInDatoCMS(data)
    })

    this.eventBus_.subscribe("product.updated", async (data) => {
      await this.datoCMSService_.updateProductInDatoCMS(data)
    })

    this.eventBus_.subscribe("product.deleted", async (data) => {
      await this.datoCMSService_.deleteProductInDatoCMS(data)
    })
  }
}

export default DatoCMSSubscriber
