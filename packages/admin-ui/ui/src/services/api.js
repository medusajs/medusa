import medusaRequest from "./request"

const removeNullish = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const buildQueryFromObject = (search, prefix = "") =>
  Object.entries(search)
    .map(([key, value]) =>
      typeof value === "object"
        ? buildQueryFromObject(value, key)
        : `${prefix ? `${prefix}[${key}]` : `${key}`}=${value}`
    )
    .join("&")

export default {
  returnReasons: {
    retrieve(id) {
      const path = `/admin/return-reasons/${id}`
      return medusaRequest("GET", path)
    },
    list() {
      const path = `/admin/return-reasons`
      return medusaRequest("GET", path)
    },
    create(payload) {
      const path = `/admin/return-reasons`
      return medusaRequest("POST", path, payload)
    },
    update(id, payload) {
      const path = `/admin/return-reasons/${id}`
      return medusaRequest("POST", path, payload)
    },
    delete(id) {
      const path = `/admin/return-reasons/${id}`
      return medusaRequest("DELETE", path)
    },
  },
  apps: {
    authorize(data) {
      const path = `/admin/apps/authorizations`
      return medusaRequest("POST", path, data)
    },

    list() {
      const path = `/admin/apps`
      return medusaRequest("GET", path)
    },
  },
  auth: {
    session() {
      const path = `/admin/auth`
      return medusaRequest("GET", path)
    },
    authenticate(details) {
      const path = `/admin/auth`
      return medusaRequest("POST", path, details)
    },
    deauthenticate(details) {
      const path = `/admin/auth`
      return medusaRequest("DELETE", path)
    },
  },
  notifications: {
    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => `${k}=${search[k]}`)
        .join("&")
      const path = `/admin/notifications${params && `?${params}`}`
      return medusaRequest("GET", path)
    },
    resend(id, config) {
      const path = `/admin/notifications/${id}/resend`
      return medusaRequest("POST", path, config)
    },
  },
  notes: {
    listByResource(resourceId) {
      const path = `/admin/notes?resource_id=${resourceId}`
      return medusaRequest("GET", path)
    },
    async create(resourceId, resourceType, value) {
      const path = `/admin/notes/`
      return medusaRequest("POST", path, {
        resource_id: resourceId,
        resource_type: resourceType,
        value,
      })
    },
    update(id, value) {
      const path = `admin/notes/${id}`
      return medusaRequest("POST", path, { value })
    },
    delete(id) {
      const path = `admin/notes/${id}`
      return medusaRequest("DELETE", path)
    },
  },

  customers: {
    retrieve(customerId) {
      const path = `/admin/customers/${customerId}`
      return medusaRequest("GET", path)
    },
    list(search = "") {
      const path = `/admin/customers${search}`
      return medusaRequest("GET", path)
    },
    update(customerId, update) {
      const path = `admin/customers/${customerId}`
      return medusaRequest("POST", path, update)
    },
  },
  store: {
    retrieve() {
      const path = `/admin/store`
      return medusaRequest("GET", path)
    },

    update(update) {
      const path = `/admin/store`
      return medusaRequest("POST", path, update)
    },

    addCurrency(code) {
      const path = `/admin/store/currencies/${code}`
      return medusaRequest("POST", path)
    },

    removeCurrency(code) {
      const path = `/admin/store/currencies/${code}`
      return medusaRequest("DELETE", path)
    },

    listPaymentProviders() {
      const path = `/admin/store/payment-providers`
      return medusaRequest("GET", path)
    },
  },
  shippingProfiles: {
    list() {
      const path = `/admin/shipping-profiles`
      return medusaRequest("GET", path)
    },

    create(data) {
      const path = `/admin/shipping-profiles`
      return medusaRequest("POST", path, data)
    },

    retrieve(profileId) {
      const path = `/admin/shipping-profiles/${profileId}`
      return medusaRequest("GET", path)
    },

    update(profileId, update) {
      const path = `/admin/shipping-profiles/${profileId}`
      return medusaRequest("POST", path, update)
    },
  },

  giftCards: {
    create(giftCard) {
      const path = `/admin/gift-cards`
      return medusaRequest("POST", path, giftCard)
    },

    retrieve(giftCardId) {
      const path = `/admin/gift-cards/${giftCardId}`
      return medusaRequest("GET", path)
    },

    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => `${k}=${search[k]}`)
        .join("&")
      const path = `/admin/gift-cards${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    update(giftCardId, update) {
      const path = `/admin/gift-cards/${giftCardId}`
      return medusaRequest("POST", path, update)
    },

    delete(giftCardId) {
      const path = `/admin/gift-cards/${giftCardId}`
      return medusaRequest("DELETE", path)
    },
  },

  variants: {
    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => `${k}=${search[k]}`)
        .join("&")
      const path = `/admin/variants${params && `?${params}`}`
      return medusaRequest("GET", path)
    },
  },

  products: {
    create(product) {
      const path = `/admin/products`
      return medusaRequest("POST", path, product)
    },

    retrieve(productId) {
      const path = `/admin/products/${productId}`
      return medusaRequest("GET", path)
    },

    update(productId, update) {
      const path = `/admin/products/${productId}`
      return medusaRequest("POST", path, update)
    },

    delete(productId) {
      const path = `/admin/products/${productId}`
      return medusaRequest("DELETE", path)
    },

    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => `${k}=${search[k]}`)
        .join("&")
      const path = `/admin/products${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    listTypes() {
      const path = `/admin/products/types`
      return medusaRequest("GET", path)
    },

    listTagsByUsage() {
      const path = `/admin/products/tag-usage`
      return medusaRequest("GET", path)
    },

    variants: {
      create(productId, variant) {
        const path = `/admin/products/${productId}/variants`
        return medusaRequest("POST", path, variant)
      },

      retrieve(productId, variantId) {
        const path = `/admin/products/${productId}/variants/${variantId}`
        return medusaRequest("GET", path)
      },

      update(productId, variantId, update) {
        const path = `/admin/products/${productId}/variants/${variantId}`
        return medusaRequest("POST", path, update)
      },

      delete(productId, variantId) {
        const path = `/admin/products/${productId}/variants/${variantId}`
        return medusaRequest("DELETE", path)
      },

      list(productId) {
        const path = `/admin/products/${productId}/variants`
        return medusaRequest("GET", path)
      },
    },

    options: {
      create(productId, option) {
        const path = `/admin/products/${productId}/options`
        return medusaRequest("POST", path, option)
      },

      delete(productId, optionId) {
        const path = `/admin/products/${productId}/options/${optionId}`
        return medusaRequest("DELETE", path)
      },

      update(productId, optionId, update) {
        const path = `/admin/products/${productId}/options/${optionId}`
        return medusaRequest("POST", path, update)
      },
    },
  },

  swaps: {
    retrieve(swapId) {
      const path = `/admin/swaps/${swapId}`
      return medusaRequest("GET", path)
    },

    update(orderId, update) {
      const path = `/admin/orders/${orderId}`
      return medusaRequest("POST", path, update)
    },

    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => {
          if (search[k] === "" || search[k] === null) {
            return null
          }
          return `${k}=${search[k]}`
        })
        .filter((s) => !!s)
        .join("&")
      const path = `/admin/swaps${params && `?${params}`}`
      return medusaRequest("GET", path)
    },
  },

  returns: {
    list(search = {}) {
      const clean = removeNullish(search)
      const params = Object.keys(clean)
        .map((k) => `${k}=${search[k]}`)
        .filter((s) => !!s)
        .join("&")
      const path = `/admin/returns${params && `?${params}`}`
      return medusaRequest("GET", path)
    },
  },

  collections: {
    create(payload) {
      const path = `/admin/collections`
      return medusaRequest("POST", path, payload)
    },

    retrieve(id) {
      const path = `/admin/collections/${id}`
      return medusaRequest("GET", path)
    },

    list(search = {}) {
      const path = `/admin/collections`
      return medusaRequest("GET", path)
    },

    addProducts(id, payload) {
      const path = `/admin/collections/${id}/products/batch`
      return medusaRequest("POST", path, payload)
    },

    removeProducts(id, payload) {
      const path = `/admin/collections/${id}/products/batch`
      return medusaRequest("DELETE", path, payload)
    },
  },

  orders: {
    create(order) {
      const path = `/admin/orders`
      return medusaRequest("POST", path, order)
    },

    async receiveReturn(returnId, payload) {
      const path = `/admin/returns/${returnId}/receive`

      const received = await medusaRequest("POST", path, payload)

      let orderId
      if (received.data.return?.order_id) {
        orderId = received.data.return.order_id
      }

      if (received.data.return?.swap?.id) {
        orderId = received.data.return?.swap?.order_id
      }

      return this.retrieve(orderId)
    },

    cancelReturn(returnId) {
      const path = `/admin/returns/${returnId}/cancel`
      return medusaRequest("POST", path)
    },

    retrieve(orderId, search = {}) {
      const params = Object.keys(search)
        .map((k) => {
          if (search[k] === "" || search[k] === null) {
            return null
          }
          return `${k}=${search[k]}`
        })
        .filter((s) => !!s)
        .join("&")
      const path = `/admin/orders/${orderId}${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    update(orderId, update) {
      const path = `/admin/orders/${orderId}`
      return medusaRequest("POST", path, update)
    },

    list(search = {}) {
      const clean = removeNullish(search)
      const params = Object.keys(clean)
        .map((k) => `${k}=${search[k]}`)
        .filter((s) => !!s)
        .join("&")

      const path = `/admin/orders${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    complete(orderId) {
      const path = `/admin/orders/${orderId}/complete`
      return medusaRequest("POST", path, {})
    },

    archive(orderId) {
      const path = `/admin/orders/${orderId}/archive`
      return medusaRequest("POST", path, {})
    },

    capturePayment(orderId) {
      const path = `/admin/orders/${orderId}/capture`
      return medusaRequest("POST", path, {})
    },

    createShipment(orderId, payload) {
      const path = `/admin/orders/${orderId}/shipment`
      return medusaRequest("POST", path, payload)
    },

    updateClaim(orderId, claimId, payload) {
      const path = `/admin/orders/${orderId}/claims/${claimId}`
      return medusaRequest("POST", path, payload)
    },

    createSwap(orderId, payload) {
      const path = `/admin/orders/${orderId}/swaps`
      return medusaRequest("POST", path, payload)
    },

    cancelSwap(orderId, swapId) {
      const path = `/admin/orders/${orderId}/swaps/${swapId}/cancel`
      return medusaRequest("POST", path)
    },

    createClaim(orderId, payload) {
      const path = `/admin/orders/${orderId}/claims`
      return medusaRequest("POST", path, payload)
    },

    cancelClaim(orderId, claimId) {
      const path = `/admin/orders/${orderId}/claims/${claimId}/cancel`
      return medusaRequest("POST", path)
    },

    fulfillClaim(orderId, claimId, payload) {
      const path = `/admin/orders/${orderId}/claims/${claimId}/fulfillments`
      return medusaRequest("POST", path, payload)
    },

    cancelClaimFulfillment(orderId, claimId, fulfillmentId) {
      const path = `/admin/orders/${orderId}/claims/${claimId}/fulfillments/${fulfillmentId}/cancel`
      return medusaRequest("POST", path)
    },

    createClaimShipment(orderId, cId, payload) {
      const path = `/admin/orders/${orderId}/claims/${cId}/shipments`
      return medusaRequest("POST", path, payload)
    },

    createSwapShipment(orderId, swapId, payload) {
      const path = `/admin/orders/${orderId}/swaps/${swapId}/shipments`
      return medusaRequest("POST", path, payload)
    },

    fulfillSwap(orderId, swapId, payload) {
      const path = `/admin/orders/${orderId}/swaps/${swapId}/fulfillments`
      return medusaRequest("POST", path, payload)
    },

    cancelSwapFulfillment(orderId, swapId, fulfillmentId) {
      const path = `/admin/orders/${orderId}/swaps/${swapId}/fulfillments/${fulfillmentId}/cancel`
      return medusaRequest("POST", path)
    },

    processSwapPayment(orderId, swapId) {
      const path = `/admin/orders/${orderId}/swaps/${swapId}/process-payment`
      return medusaRequest("POST", path)
    },

    createFulfillment(orderId, payload) {
      const path = `/admin/orders/${orderId}/fulfillment`
      return medusaRequest("POST", path, payload)
    },

    cancelFulfillment(orderId, fulfillmentId) {
      const path = `/admin/orders/${orderId}/fulfillments/${fulfillmentId}/cancel`
      return medusaRequest("POST", path)
    },

    refund(orderId, payload) {
      const path = `/admin/orders/${orderId}/refund`
      return medusaRequest("POST", path, payload)
    },

    requestReturn(orderId, payload) {
      const path = `/admin/orders/${orderId}/return`
      return medusaRequest("POST", path, payload)
    },

    cancel(orderId) {
      const path = `/admin/orders/${orderId}/cancel`
      return medusaRequest("POST", path, {})
    },
  },

  shippingOptions: {
    create(shippingOption) {
      const path = `/admin/shipping-options`
      return medusaRequest("POST", path, shippingOption)
    },

    retrieve(id) {
      const path = `/admin/shipping-options/${id}`
      return medusaRequest("POST", path)
    },

    delete(id) {
      const path = `/admin/shipping-options/${id}`
      return medusaRequest("DELETE", path)
    },

    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => `${k}=${search[k]}`)
        .join("&")
      const path = `/admin/shipping-options${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    update(id, update) {
      const path = `/admin/shipping-options/${id}`
      return medusaRequest("POST", path, update)
    },
  },

  discounts: {
    create(discount) {
      const path = `/admin/discounts`
      return medusaRequest("POST", path, discount)
    },

    retrieve(discountId) {
      const path = `/admin/discounts/${discountId}`
      return medusaRequest("GET", path)
    },

    update(discountId, update) {
      const path = `/admin/discounts/${discountId}`
      return medusaRequest("POST", path, update)
    },

    delete(discountId) {
      const path = `/admin/discounts/${discountId}`
      return medusaRequest("DELETE", path)
    },

    list(search = {}) {
      const params = buildQueryFromObject(search)
      const path = `/admin/discounts${params && `?${params}`}`
      return medusaRequest("GET", path)
    },

    retrieveByCode(code) {
      const path = `/admin/discounts/code/${code}`
      return medusaRequest("GET", path)
    },
  },

  regions: {
    list() {
      const path = `/admin/regions`
      return medusaRequest("GET", path)
    },

    retrieve(id) {
      const path = `/admin/regions/${id}`
      return medusaRequest("GET", path)
    },

    create(region) {
      const path = `/admin/regions`
      return medusaRequest("POST", path, region)
    },

    update(id, region) {
      const path = `/admin/regions/${id}`
      return medusaRequest("POST", path, region)
    },

    delete(id) {
      const path = `/admin/regions/${id}`
      return medusaRequest("DELETE", path)
    },

    fulfillmentOptions: {
      list(regionId) {
        const path = `/admin/regions/${regionId}/fulfillment-options`
        return medusaRequest("GET", path)
      },
    },
  },

  uploads: {
    create(files) {
      const formData = new FormData()
      for (const f of files) {
        formData.append("files", f)
      }

      return medusaRequest("POST", "/admin/uploads", formData)
    },
  },

  draftOrders: {
    create(draftOrder) {
      const path = `/admin/draft-orders`
      return medusaRequest("POST", path, draftOrder)
    },

    addLineItem(draftOrderId, line) {
      const path = `/admin/draft-orders/${draftOrderId}/line-items`
      return medusaRequest("POST", path, line)
    },

    updateLineItem(draftOrderId, lineId, line) {
      const path = `/admin/draft-orders/${draftOrderId}/line-items/${lineId}`
      return medusaRequest("POST", path, line)
    },

    deleteLineItem(draftOrderId, lineId) {
      const path = `/admin/draft-orders/${draftOrderId}/line-items/${lineId}`
      return medusaRequest("DELETE", path)
    },

    retrieve(id) {
      const path = `/admin/draft-orders/${id}`
      return medusaRequest("GET", path)
    },

    delete(id) {
      const path = `/admin/draft-orders/${id}`
      return medusaRequest("DELETE", path)
    },

    update(id, payload) {
      const path = `/admin/draft-orders/${id}`
      return medusaRequest("POST", path, payload)
    },

    registerSystemPayment(id) {
      const path = `/admin/draft-orders/${id}/pay`
      return medusaRequest("POST", path)
    },

    list(search = {}) {
      const params = Object.keys(search)
        .map((k) => {
          if (search[k] === "" || search[k] === null) {
            return null
          }
          return `${k}=${search[k]}`
        })
        .filter((s) => !!s)
        .join("&")
      const path = `/admin/draft-orders${params && `?${params}`}`
      return medusaRequest("GET", path)
    },
  },
  invites: {
    create(data) {
      const path = `/admin/invites`
      return medusaRequest("POST", path, data)
    },
    resend(inviteId) {
      const path = `/admin/invites/${inviteId}/resend`
      return medusaRequest("POST", path)
    },
    delete(inviteId) {
      const path = `/admin/invites/${inviteId}`
      return medusaRequest("DELETE", path)
    },
    list() {
      const path = `/admin/invites`
      return medusaRequest("GET", path)
    },
    accept(data) {
      const path = `/admin/invites/accept`
      return medusaRequest("POST", path, data)
    },
  },
  users: {
    resetPasswordToken(data) {
      const path = `/admin/users/password-token`
      return medusaRequest("POST", path, data)
    },
    resetPassword(data) {
      const path = `/admin/users/reset-password`
      return medusaRequest("POST", path, data)
    },

    list() {
      const path = `/admin/users`
      return medusaRequest("GET", path)
    },

    retrieve(userId) {
      const path = `/admin/users/${userId}`
      return medusaRequest("GET", path)
    },

    update(userId, data) {
      const path = `/admin/users/${userId}`
      return medusaRequest("POST", path, data)
    },

    delete(userId) {
      const path = `/admin/users/${userId}`
      return medusaRequest("DELETE", path)
    },
  },
}
