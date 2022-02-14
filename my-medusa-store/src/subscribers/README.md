# Custom subscribers

You may define custom eventhandlers, `subscribers` by creating files in the `/subscribers` directory.

```js
class WelcomeSubscriber {
  constructor({ welcomeService, eventBusService }) {
    this.welcomeService_ = welcomeService;

    eventBusService.subscribe("order.placed", this.handleWelcome);
  }

  handleWelcome = async (data) => {
    return await this.welcomeService_.sendWelcome(data.id);
  };
}

export default WelcomeSubscriber;
```

A subscriber is defined as a `class` which is registered as a subscriber by invoking `eventBusService.subscribe` in the `constructor` of the class.

The type of event that the subscriber subscribes to is passed as the first parameter to the `eventBusService.subscribe` and the eventhandler is passed as the second parameter. The types of events a service can emmit are described in the individual service.

An eventhandler has one paramenter; a data `object` which contain information relating to the event, including relevant `id's`. The `id` can be used to fetch the appropriate entity in the eventhandler.
