
import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { SiteClient } from "datocms-client"


const IGNORE_THRESHOLD = 2 // seconds

class DatoCMSService extends BaseService {
  constructor(
    {
      regionService,
      productService,
      redisClient,
      productVariantService,
      eventBusService,
    },
    options
  ) {
    super()

    this.productService_ = productService

    this.productVariantService_ = productVariantService

    this.regionService_ = regionService

    this.eventBus_ = eventBusService

    this.options_ = options

    /*
      * Pass environment if required.
      this.datoCMSClient_ = new SiteClient(options.access_token, {environment: ENV})});
    */
    this.datoCMSClient_ = new SiteClient(options.access_token);
    this.redis_ = redisClient
  }

// ======== Start of Subscriber functions

  async createProductInDatoCMS(product) {
    try {
      // Implement createProductInDatoCMS
      return
    } catch (error) {
      throw error
    }
  }

  async createProductVariantInContentful(variant) {
    try {
      // Implement createProductVariantInContentful
      return
    } catch (error) {
      throw error
    }
  }


  async createRegionInContentful(region) {
    try {
      // Implement createRegionInContentful
      return
    } catch (error) {
      throw error
    }
  }

  async updateRegionInContentful(data) {
    try {
      // Implement updateRegionInContentful
      return
    } catch (error) {
      throw error
    }
  }

  async updateProductInContentful(data) {
    try {
      // Implement updateProductInContentful
      return
    } catch (error) {
      throw error
    }
  }

  async updateProductVariantInContentful(variant) {
    try {
      // Implement updateProductVariantInContentful
      return
    } catch (error) {
      throw error
    }
  }

  async archiveProductVariantInContentful(variant) {
    try {
      // Implement archiveProductVariantInContentful
      return
    } catch (error) {
      throw error
    }
  }

  async archiveProductInContentful(product) {
    try {
      // Implement archiveProductInContentful
      return
    } catch (error) {
      throw error
    }
  }

  async archiveRegionInContentful(region) {
    try {
      // Implement archiveRegionInContentful
      return
    } catch (error) {
      throw error
    }
  }

// ======== End of Subscriber functions



// ======== Start of hooks functions

  async sendContentfulProductToAdmin(productId) {
    try {
      // Implement sendContentfulProductToAdmin
      return
    } catch (error) {
      throw error
    }
  }

  async sendContentfulProductVariantToAdmin(variantId) {
    try {
      // Implement sendContentfulProductVariantToAdmin
    } catch (error) {
      throw error
    }
  }

  async sendContentfulRegionToAdmin(regionId) {
    try {
     // Implement sendContentfulRegionToAdmin
      return
    } catch (error) {
      throw error
    }
  }

// ======== End of hooks functions
}

export default DatoCMSService
