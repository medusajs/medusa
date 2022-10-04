## Returns

Returns refer to the situation when a merchant takes back previously purchased items from a customer. A return will usually result in a refund to the customer, with an amount corresponding to the amount received from the customer at the time of purchase. 

A usual return flow follows the steps below:

1. The customer requests a return - noting the items that they will be sending back. 
2. The merchant provides the customer with a return label, that will be used on the package that is being sent back.
3. The merchant receives the package at their warehouse, and registers the return as being received.
4. The merchant refunds the money to the customer, taking any potential return shipping requests into account. 

A different flow that is less common follows the steps:

1. The customer arranges a shipment themselves.
2. The merchant receives the package at their warehouse, and registers the return as being received.
3. The merchant refunds the money to the customer, taking any potential return shipping requests into account. 

In Medusa Admin return shipping options are created in the same way that outgoing shipping options are created. Each return shipping option is associated with a region giving you the flexibility to price returns differently depending on the region the order has been placed in. Returns are not required to have shipping methods as it may be the case that return is arranged independently of a fulfillment provider.

To create a return in Medusa Admin the store operator finds the original order and clicks "Create Return", the store operator then selects the items to be returned along with a shipping option, once the return is created the fulfillment provider takes care of providing the necessary documentation for the return; this can also be viewed in Medusa Admin.

## Swaps

A swap can be used in cases where a customer wishes to exchange previously purchased items for different items. Usually this occurs if the customer wants to change the size or color of an item. In Medusa a swap can be initiated to handle the administrative tasks around swaps i.e. requesting a return, taking a payment from the customer for any shipping expenses and fulfilling the new items.

When a swap is created in Medusa Admin a return request will be initiated immediately generating return labels with the chosen fulfillment provider, furthermore a cart will be created and a payment link generated which can be sent to the customer to authorize a payment. When the return is received the swap can be marked as received and usually this will be where the new goods are to be sent out. The new goods are sent with the shipping method chosen by the customer in the payment process.

Limitations: 
- At the moment only swaps that require a payment are supported i.e. swaps that would result in a refund to the customer are not possible.
- The customer must have paid for their swap before the items can be returned.

