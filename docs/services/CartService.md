# Cart Service
In Medusa a cart is where a customer can add items that they intend to purchase
later. The Cart service is responsible for making the operations necessary for
handling items in the cart and completing a checkout. 

## Creating carts

### When to create carts
You can create a cart when the user enters the site or when they first add
something to the cart.

If you decide to wait with cart creation until the
customer adds something to the cart you have to make sure that the customer sees
correct prices/products/etc. for the region they are shopping in. You will also
have to ensure that you make a `POST /cart` call before you call `POST
/cart/line-items`.

This can be circumvented by creating the cart as soon as the user enters your
site. You will then be able to keep the region data in the cart, which will be
ready for any `POST /cart/line-items`. This has the trade-off of creating many
unnecessary carts, but is easier to implement.

## Shopping

### Adding to the cart
The typical user journey is that a customer adds an item to her Cart this
usually happens with `POST /cart/line-items`. The endpoint takes a `variant_id`
and a `quantity`. The endpoint controller will then retrieve the variant and the
product it is associated with, compile a valid `LineItem` and use the
CartService function `addLineItem` to create the line item on the cart.

### Updating line items
Updating line items happens with `POST /cart/line-items/[line-id]`. The endpoint
takes `quantity` to update the line item's quantity. A quantity of 0 results in
a removal of the line item. The endpoint controller uses `updateLineItem` to
update the line item.

### Removing line items
Deleting line items happens with `DELETE /cart/line-items/[line-id]`. Endpoint 
removes the line item with the given line id by calling `removeLineItem`.

> ### Custom add to cart
> It is possible to make custom endpoints to add to cart. For example if you are
> creating a gift card plugin you may want to create a custom endpoint that
> accepts values like `amount` which can be set by the customer. As long as the
> controller compiles a valid `LineItem` it can safely call `addLineItem`

## Checking out

### Initializing the checkout
When the customer is ready to check out they will reach your checkout page. At
this point you want to display which payment and shipping options are offered.
`POST /cart/payment-providers` and `POST /cart/fulfillment-providers` will
initialize payment sessions and shipping methods offered by fulfillment
providers. The payment sessions will typically have to be updated if any further
changes to the cart total happens (shipping fee, promo codes, user exits
checkout and adds more items to cart and returns to checkout). Medusa will make
sure to update any payment sessions that have already been initialized. 

In cases where shipping rates can vary based on order size, shipping address
(with higher granularity than region) makes sense to call `POST
/cart/fulfillment-providers` multiple times, e.g. if the customer updates their 
shipping address and new shipping rates have to be calculated. On each call the 
endpoint will make sure to only return relevant shipping methods.

Note that `POST /cart/payment-providers` should not be used to fetch available
payment providers, only to initialize payment sessions. If you want to display
the available payment providers to the customer you can find an array of these
in `region.payment_providers`.

### Getting customer data 
To complete a purchase the customer has to fill in her details. The endpoints to
do this are `POST /cart/email`, `POST /cart/shipping-address` and `POST /cart/
billing-address`. The endpoint controllers use the corresponding Cart service
methods (`updateEmail`, `updateShippingAddress`, `updateBillingAddress`) to
store the customer information in the cart.

### Handling payments and completing orders
Authorization of payments happen with the payment provider. As such the typical
payment flow will be:

1. the customer enters payment details
2. details are sent to the payment provider
3. the payment provider authorizes the payment
4. the payment method is store in the cart
5. the order is processed. 

Steps 4. and 5. are handled with one API call in Medusa. Once the payment is
authorized you call `POST /order`. The endpoint takes `cart_id` and
`payment_provider_id` as data. The controller will call the Cart service
function `setPaymentMethod` which will fetch the cart, search the
`payment_sessions` array for the payment associated with `payment_provider` and
check that the payment session is authorized. When the authorization is verified
the payment method is set and the controller can safely call the Order service
function `create`. 
