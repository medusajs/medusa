import BaseService from "./base-service"

/**
 * Interface for Notification Providers
 * @interface
 * @deprecated use AbstractNotificationService from @medusajs/medusa instead
 */
class BaseNotificationService extends BaseService {
  static _isNotificationService = true

  static isNotificationService(obj) {
    return obj?.constructor?._isNotificationService
  }

  constructor() {
    super()
  }

  getIdentifier() {
    return this.constructor.identifier
  }

  /**
   * Used to retrieve documents related to a shipment.
   */
  sendNotification(event, data) {
    throw new Error("Must be overridden by child")
  }

  resendNotification(notification, config = {}) {
    throw new Error("Must be overridden by child")
  }
}

export default BaseNotificationService
