# Structure

- Models (`/models`)
This is where the data layer lives. Define data models here no logic only schema and data access layer. (Default is MongoDB so we have data access layer defined for us already)

- Services (`/services`)
This is where our business logic lives. Define services that perform calculations, update the data layer, synchronize services, etc.

- Controllers (`/api`)
This is the interface lives. Define how the user interacts with the service layer. Ensure that the user has permission to do what they intend to, authenticate requests, call service layer.

- Jobs (`/jobs`)
This is where background and recurring tasks live. Want to send some data somewhere every night, this would be where to do it. Calls service layer methods and should, like controllers, not contain business logic.

- Subscribers (`/subscribers`)
This is where events live. Want to perform a certain task whenever something else happens, this is where to do it.

# Extending the core

The core will look for files in the folders listed above, and inject the custom code.


# Checkout flow

To create an order from a cart the customer must have filled in:
- their details (shipping/billing address, email)
- shipping method 
- payment method

The steps can be done in any order. The standard path would probably be:

1. submit details (PUT /cart/shipping-address, PUT /cart/email)
2. select shipping method (PUT /cart/shipping-method)
3. enter payment details (PUT /cart/payment-method) 
4. complete order (POST /order)

Assuming that shipping methods are static within each region we can display all shipping methods at checkout time. If shipping is dynamically calculated the price of the shipping method may change, we will ask the fulfillment provider for new rates. 

Payment details can be entered at any point as long as the final amount is known. If the final amount changes afer the payment details are entered the payment method may therefore be invalidated.

Within the store UI you could imagine each step being taken care of by a single button click, which calls all endpoints.

