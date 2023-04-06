import { NotificationService } from "medusa-interfaces"

class TestNotiService extends NotificationService {
  static identifier = "test-not"

  constructor() {
    super()
  }

  async sendNotification() {
    return Promise.resolve()
  }

  async resendNotification() {
    return Promise.resolve()
  }
}

export default TestNotiService
