class NotificationSubscriber {
  constructor({ eventBusService, notificationService }) {
    this.notificationService_ = notificationService

    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("*", this.onEvent)
  }

  onEvent = (data, eventName) => {
    return this.notificationService_.handleEvent(eventName, data)
  }
}

export default NotificationSubscriber
