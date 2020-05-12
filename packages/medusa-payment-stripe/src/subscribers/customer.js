class CustomerSubscriber {
  constructor({ customerService, eventBusService, stripeProviderService }) {
    this.customerService_ = customerService
    this.stripeProviderService_ = stripeProviderService
    this.eventBus_ = eventBusService

    this.eventBus_.subscribe("customer.created", async (data) => {
      await stripeProviderService.createCustomer(data._id, data.email)
    })
  }
}

export default CustomerSubscriber
