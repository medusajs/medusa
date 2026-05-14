import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client, FetchError } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Product {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method creates a product import. The products are only imported after
   * the import is confirmed using the {@link confirmImport} method.
   *
   * This method sends a request to the
   * [Create Product Import](https://docs.medusajs.com/api/admin#products_postproductsimport)
   * API route.
   *
   * @param body - The import's details.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The import's details.
   *
   * @example
   * sdk.admin.product.import({
   *   file // uploaded File instance
   * })
   * .then(({ transaction_id }) => {
   *   console.log(transaction_id)
   * })
   */
  async import(
    body: HttpTypes.AdminImportProductRequest,
    query?: {},
    headers?: ClientHeaders
  ) {
    const form = new FormData()
    form.append("file", body.file)

    return await this.client.fetch<HttpTypes.AdminImportProductResponse>(
      `/admin/products/import`,
      {
        method: "POST",
        headers: {
          ...headers,
          // Let the browser determine the content type.
          "content-type": null,
        },
        body: form,
        query,
      }
    )
  }

  /**
   * This method creates a product import. The products are only imported after
   * the import is confirmed using the {@link confirmImport} method.
   *
   * This method sends a request to the
   * [Create Product Import](https://docs.medusajs.com/api/admin#products_postproductsimports)
   * API route.
   *
   * @since 2.8.5
   *
   * @param body - The import's details.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The import's details.
   *
   * @example
   * sdk.admin.product.createImport({
   *   file // uploaded File instance
   * })
   * .then(({ transaction_id }) => {
   *   console.log(transaction_id)
   * })
   */
  async createImport(
    body: HttpTypes.AdminImportProductRequest,
    query?: {},
    headers?: ClientHeaders
  ) {
    /**
     * Get signed URL for file uploads
     */
    const response =
      await this.client.fetch<HttpTypes.AdminUploadPreSignedUrlResponse>(
        "admin/uploads/presigned-urls",
        {
          method: "POST",
          headers: headers,
          body: {
            originalname: body.file.name,
            mime_type: body.file.type,
            size: body.file.size,
          } satisfies HttpTypes.AdminUploadPreSignedUrlRequest,
          query,
        }
      )

    /**
     * Upload file using the signed URL. We cannot send cookies or any other
     * special headers in this request, since external services like S3 will
     * give a CORS error.
     */
    if (
      response.url.startsWith("http://") ||
      response.url.startsWith("https://")
    ) {
      const uploadResponse = await fetch(response.url, {
        method: "PUT",
        body: body.file,
      })
      if (uploadResponse.status >= 400) {
        throw new FetchError(
          uploadResponse.statusText,
          uploadResponse.statusText,
          uploadResponse.status
        )
      }
    } else {
      const form = new FormData()
      form.append("files", body.file)

      const localUploadResponse = await this.client.fetch<{
        files: HttpTypes.AdminUploadFile
      }>("admin/uploads", {
        method: "POST",
        headers: {
          ...headers,
          // Let the browser determine the content type.
          "content-type": null,
        },
        body: form,
        query,
      })

      response.filename = localUploadResponse.files[0].id
    }

    /**
     * Perform products import using the uploaded file name
     */
    return await this.client.fetch<HttpTypes.AdminImportProductsResponse>(
      "/admin/products/imports",
      {
        method: "POST",
        headers: {
          ...headers,
        },
        body: {
          file_key: response.filename,
          originalname: response.originalname,
          extension: response.extension,
          size: response.size,
          mime_type: response.mime_type,
        } satisfies HttpTypes.AdminImportProductsRequest,
        query,
      }
    )
  }

  /**
   * This method confirms a product import created using the method {@link import}.
   * It sends a request to the
   * [Confirm Product Import](https://docs.medusajs.com/api/admin#products_postproductsimporttransaction_idconfirm)
   * API route.
   *
   * @since 2.8.5
   *
   * @param transactionId - The ID of the transaction of the created product import. This is returned
   * by the API route used to create the product import.
   * @param query - Query parameters to pass in the request.
   * @param headers - Headers to pass in the request.
   *
   * @example
   * sdk.admin.product.confirmImport("transaction_123")
   * .then(() => {
   *   console.log("Import confirmed")
   * })
   */
  async confirmImport(
    transactionId: string,
    query?: {},
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<{}>(
      `/admin/products/imports/${transactionId}/confirm`,
      {
        method: "POST",
        headers,
        body: {},
        query,
      }
    )
  }

  /**
   * This method starts a product export process to retrieve a CSV of exported products.
   *
   * You'll receive in the response the transaction ID of the workflow generating the CSV file.
   * To check the status of the execution, send a `GET` request to
   * `/admin/workflows-executions/export-products/:transaction-id`.
   *
   * Once the execution finishes successfully, a notification is created for the export.
   * You can retrieve the notifications using the `/admin/notification` API route to
   * retrieve the file's download URL.
   *
   * This method sends a request to the [Export Product](https://docs.medusajs.com/api/admin#products_postproductsexport)
   * API route.
   *
   * @param body - The export's details.
   * @param query - Filters to specify which products to export.
   * @param headers - Headers to pass in the request.
   * @returns The export's details.
   *
   * @example
   * sdk.admin.product.export({})
   * .then(({ transaction_id }) => {
   *   console.log(transaction_id)
   * })
   */
  async export(
    body: HttpTypes.AdminExportProductRequest,
    query?: HttpTypes.AdminProductListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminExportProductResponse>(
      `/admin/products/export`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method manages products to create, update, or delete them. It sends a request to the
   * [Manage Products](https://docs.medusajs.com/api/admin#products_postproductsbatch)
   * API route.
   *
   * @param body - The products to create, update, or delete.
   * @param query - Configure the fields to retrieve in the products.
   * @param headers - Headers to pass in the request
   * @returns The batch operations details.
   *
   * @example
   * sdk.admin.product.batch({
   *   create: [
   *     {
   *       title: "Shirt",
   *       options: [{
   *         title: "Default",
   *         values: ["Default Option"]
   *       }],
   *       variants: [
   *         {
   *           title: "Default",
   *           options: {
   *             Default: "Default Option"
   *           },
   *           prices: []
   *         }
   *       ]
   *     }
   *   ],
   *   update: [{
   *     id: "prod_123",
   *     title: "Pants"
   *   }],
   *   delete: ["prod_321"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  async batch(
    body: HttpTypes.AdminBatchProductRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchProductResponse>(
      `/admin/products/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method creates a product. It sends a request to the
   * [Create Product](https://docs.medusajs.com/api/admin#products_postproducts)
   * API route.
   *
   * @param body - The product's details.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.create({
   *   title: "Shirt",
   *   options: [{
   *     title: "Default",
   *     values: ["Default Option"]
   *   }],
   *   variants: [
   *     {
   *       title: "Default",
   *       options: {
   *         Default: "Default Option"
   *       },
   *       prices: []
   *     }
   *   ],
   *   shipping_profile_id: "sp_123"
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  async create(
    body: HttpTypes.AdminCreateProduct,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a product. It sends a request to the
   * [Update Product](https://docs.medusajs.com/api/admin#products_postproductsid)
   * API route.
   *
   * @param id - The product's ID.
   * @param body - The data to update in the product.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.update("prod_123", {
   *   title: "Shirt",
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  async update(
    id: string,
    body: HttpTypes.AdminUpdateProduct,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of products. It sends a request to the
   * [List Products](https://docs.medusajs.com/api/admin#products_getproducts) API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of products.
   *
   * @example
   * To retrieve the list of products:
   *
   * ```ts
   * sdk.admin.product.list()
   * .then(({ products, count, limit, offset }) => {
   *   console.log(products)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.product.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ products, count, limit, offset }) => {
   *   console.log(products)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each products:
   *
   * ```ts
   * sdk.admin.product.list({
   *   fields: "id,*variants"
   * })
   * .then(({ products, count, limit, offset }) => {
   *   console.log(products)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async list(
    queryParams?: HttpTypes.AdminProductListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductListResponse>(
      `/admin/products`,
      {
        headers,
        query: queryParams,
      }
    )
  }

  /**
   * This method retrieves a product by its ID. It sends a request to the
   * [Get Product](https://docs.medusajs.com/api/admin#products_getproductsid)
   * API route.
   *
   * @param id - The product's ID.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * To retrieve a product by its ID:
   *
   * ```ts
   * sdk.admin.product.retrieve("prod_123")
   * .then(({ product }) => {
   *   console.log(product)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.product.retrieve("prod_123", {
   *   fields: "id,*variants"
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a product. It sends a request to the
   * [Delete Product](https://docs.medusajs.com/api/admin#products_deleteproductsid)
   * API route.
   *
   * @param id - The product's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.product.delete("prod_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductDeleteResponse>(
      `/admin/products/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method manages the variants of a product. It sends a request to the
   * [Manage Variants](https://docs.medusajs.com/api/admin#products_postproductsidvariantsbatch)
   * API route.
   *
   * @param productId - The product's ID.
   * @param body - The variants to create, update, or delete.
   * @param query - Configure the fields to retrieve in the product variants.
   * @param headers - Headers to pass in the request
   * @returns The product variants' details.
   *
   * @example
   * sdk.admin.product.batchVariants("prod_123", {
   *   create: [
   *     {
   *       title: "Blue Shirt",
   *       options: {
   *         Color: "Blue"
   *       },
   *       prices: []
   *     }
   *   ],
   *   update: [
   *     {
   *       id: "variant_123",
   *       title: "Pants"
   *     }
   *   ],
   *   delete: ["variant_123"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  async batchVariants(
    productId: string,
    body: HttpTypes.AdminBatchProductVariantRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchProductVariantResponse>(
      `/admin/products/${productId}/variants/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method creates a variant for a product. It sends a request to the
   * [Create Variant](https://docs.medusajs.com/api/admin#products_postproductsidvariants)
   * API route.
   *
   * @param productId - The product's ID.
   * @param body - The variant's details.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.createVariant("prod_123", {
   *   title: "Blue Shirt",
   *   options: {
   *     Color: "Blue"
   *   },
   *   prices: [
   *     {
   *       amount: 10,
   *       currency_code: "usd"
   *     }
   *   ]
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  async createVariant(
    productId: string,
    body: HttpTypes.AdminCreateProductVariant,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${productId}/variants`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a variant of a product. It sends a request to the
   * [Update Variant](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The variant's ID.
   * @param body - The data to update in the variant.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.updateVariant(
   *   "prod_123",
   *   "variant_123",
   *     {
   *     title: "Blue Shirt",
   *   }
   * )
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  async updateVariant(
    productId: string,
    id: string,
    body: HttpTypes.AdminUpdateProductVariant,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of products. It sends a request to the
   * [List Products](https://docs.medusajs.com/api/admin#products_getproductsidvariants) API route.
   *
   * @param productId - The ID of the product to retrieve its variants.
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product variants.
   *
   * @example
   * To retrieve the list of product variants:
   *
   * ```ts
   * sdk.admin.product.listVariants("prod_123")
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.product.listVariants("prod_123", {
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product variant:
   *
   * ```ts
   * sdk.admin.product.listVariants("prod_123", {
   *   fields: "id,*product"
   * })
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async listVariants(
    productId: string,
    query?: HttpTypes.AdminProductVariantParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductVariantListResponse>(
      `/admin/products/${productId}/variants`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a product's variant. It sends a request to the
   * [Retrieve Variant](https://docs.medusajs.com/api/admin#products_getproductsidvariantsvariant_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The variant's ID.
   * @param query - Configure the fields to retrieve in the product variant.
   * @param headers - Headers to pass in the request
   * @returns The product variant's details.
   *
   * @example
   * To retrieve a product variant by its ID:
   *
   * ```ts
   * sdk.admin.product.retrieveVariant(
   *   "prod_123",
   *   "variant_123"
   * )
   * .then(({ variant }) => {
   *   console.log(variant)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.product.retrieveVariant(
   *   "prod_123",
   *   "variant_123",
   *   {
   *     fields: "id, *product"
   *   }
   * )
   * .then(({ variant }) => {
   *   console.log(variant)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieveVariant(
    productId: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductVariantResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a product's variant. It sends a request to the
   * [Delete Variant](https://docs.medusajs.com/api/admin#products_deleteproductsidvariantsvariant_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The ID of the variant.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.product.deleteVariant("prod_123", "variant_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async deleteVariant(productId: string, id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductVariantDeleteResponse>(
      `/admin/products/${productId}/variants/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method manages a product's variant's inventories to associate them with inventory items,
   * update their inventory items, or delete their association with inventory items.
   *
   * It sends a request to the
   * [Manage Variant Inventory](https://docs.medusajs.com/api/admin#products_postproductsidvariantsinventoryitemsbatch)
   * API route.
   *
   * @param productId - The ID of the product that the variant belongs to.
   * @param body - The inventory items to create, update, or delete.
   * @param query - Pass query parameters in the request.
   * @param headers - Headers to pass in the request
   * @returns The details of the created, updated, or deleted inventory items.
   *
   * @example
   * sdk.admin.product.batchVariantInventoryItems(
   *   "prod_123",
   *   {
   *     create: [
   *       {
   *         inventory_item_id: "iitem_123",
   *         variant_id: "variant_123",
   *         required_quantity: 10
   *       }
   *     ],
   *     update: [
   *       {
   *         inventory_item_id: "iitem_1234",
   *         variant_id: "variant_1234",
   *         required_quantity: 20
   *       }
   *     ],
   *     delete: [
   *       {
   *         inventory_item_id: "iitem_321",
   *         variant_id: "variant_321"
   *       }
   *     ]
   *   }
   * )
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  async batchVariantInventoryItems(
    productId: string,
    body: HttpTypes.AdminBatchProductVariantInventoryItemRequest,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchProductVariantInventoryItemResponse>(
      `/admin/products/${productId}/variants/inventory-items/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method creates an option in a product. It sends a request to the
   * [Create Option](https://docs.medusajs.com/api/admin#products_postproductsidoptions)
   * API route.
   *
   * @param productId - The product's ID.
   * @param body - The option's details.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.createOption(
   *   "prod_123",
   *   {
   *     title: "Color",
   *     values: ["Green", "Blue"]
   *   }
   * )
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  async createOption(
    productId: string,
    body: HttpTypes.AdminCreateProductOption,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${productId}/options`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method updates a product's option. It sends a request to the
   * [Update Option](https://docs.medusajs.com/api/admin#products_postproductsidoptionsoption_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The ID of the option to update.
   * @param body - The data to update in the option.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.updateOption(
   *   "prod_123",
   *   "prodopt_123",
   *   {
   *     title: "Color"
   *   }
   * )
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  async updateOption(
    productId: string,
    id: string,
    body: HttpTypes.AdminUpdateProductOption,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  /**
   * This method retrieves a paginated list of product options. It sends a request to the
   * [List Options](https://docs.medusajs.com/api/admin#products_getproductsidoptions) API route.
   *
   * @param productId - The ID of the product to retrieve its options
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product options.
   *
   * @example
   * To retrieve the list of product options:
   *
   * ```ts
   * sdk.admin.product.listOptions("prod_123")
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.product.listOptions("prod_123", {
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product options:
   *
   * ```ts
   * sdk.admin.product.listOptions("prod_123", {
   *   fields: "id,title"
   * })
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async listOptions(
    productId: string,
    query?: HttpTypes.AdminProductOptionParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductOptionListResponse>(
      `/admin/products/${productId}/options`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a product's option. It sends a request to the
   * [Get Option](https://docs.medusajs.com/api/admin#products_getproductsidoptionsoption_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The product option's ID.
   * @param query - Configure the fields to retrieve in the product option.
   * @param headers - Headers to pass in the request
   * @returns The product option's details.
   *
   * @example
   * To retrieve a product option by its ID:
   *
   * ```ts
   * sdk.admin.product.retrieveOption(
   *   "prod_123",
   *   "prodopt_123"
   * )
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.product.retrieveOption(
   *   "prod_123",
   *   "prodopt_123",
   *   {
   *     fields: "id,title"
   *   }
   * )
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  async retrieveOption(
    productId: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminProductOptionResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        query,
        headers,
      }
    )
  }

  /**
   * This method deletes a product's option. It sends a request to the
   * [Delete Option](https://docs.medusajs.com/api/admin#products_deleteproductsidoptionsoption_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The option's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.product.deleteOption("prod_123", "prodopt_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  async deleteOption(productId: string, id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminProductOptionDeleteResponse>(
      `/admin/products/${productId}/options/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method manages image-variant associations for a specific image. It sends a request to the
   * [Batch Image Variants](https://docs.medusajs.com/api/admin#products_postproductsidimagesimage_idvariantsbatch)
   * API route.
   * 
   * @since 2.11.2
   *
   * @param productId - The product's ID.
   * @param imageId - The image's ID.
   * @param body - The variants to add or remove from the image.
   * @param headers - Headers to pass in the request
   * @returns The batch operation details.
   *
   * @example
   * sdk.admin.product.batchImageVariants("prod_123", "img_123", {
   *   add: ["variant_123", "variant_456"],
   *   remove: ["variant_789"]
   * })
   * .then(({ added, removed }) => {
   *   console.log(added, removed)
   * })
   */
  async batchImageVariants(
    productId: string,
    imageId: string,
    body: HttpTypes.AdminBatchImageVariantRequest,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchImageVariantResponse>(
      `/admin/products/${productId}/images/${imageId}/variants/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method manages variant-image associations for a specific variant. It sends a request to the
   * [Batch Variant Images](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_idimagesbatch)
   * API route.
   * 
   * @since 2.11.2
   *
   * @param productId - The product's ID.
   * @param variantId - The variant's ID.
   * @param body - The images to add or remove from the variant.
   * @param headers - Headers to pass in the request
   * @returns The batch operation details.
   *
   * @example
   * sdk.admin.product.batchVariantImages("prod_123", "variant_123", {
   *   add: ["img_123", "img_456"],
   *   remove: ["img_789"]
   * })
   * .then(({ added, removed }) => {
   *   console.log(added, removed)
   * })
   */
  async batchVariantImages(
    productId: string,
    variantId: string,
    body: HttpTypes.AdminBatchVariantImagesRequest,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminBatchVariantImagesResponse>(
      `/admin/products/${productId}/variants/${variantId}/images/batch`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
