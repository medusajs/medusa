# AwilixResolutionError: Could Not Resolve X

This troubleshooting guide will help you figure out the different situations that can cause an `AwilixResolutionError`.

## Service Lifetime

If you're registering a custom resource within a middleware, for example a logged-in user, then make sure that all services that are using it have their `LIFE_TIME` static property either set to `Lifetime.SCOPED` or `Lifetime.TRANSIENT`. For example:

```ts
```