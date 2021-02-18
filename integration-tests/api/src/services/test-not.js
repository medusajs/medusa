import { NotificationService } from "medusa-interfaces";

class TestNotiService extends NotificationService {
  static identifier = "test-not";

  constructor() {
    super();
  }

  async sendNotification() {
    return Promise.resolve();
  }

  async reSendNotification() {
    return Promise.resolve();
  }
}

export default TestNotiService;
