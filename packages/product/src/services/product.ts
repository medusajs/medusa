import { ProductVariantService } from "@services"

class Product {
  protected readonly productVariantService: ProductVariantService
  constructor({ productVariantService }) {
    this.productVariantService = productVariantService
  }

  async listVariants() {
    return await this.productVariantService.list()
  }
}

export default Product
