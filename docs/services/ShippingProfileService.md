# ShippingProfileService

In Medusa, a Shipping Profile represents a group of products and shipping options that can fulfill said products. For example, a store may have to product types "Shirts" and "Shorts" which are produced in Italy and UK respectively. In this case the store operator would create two shipping profiles, one for Shirts and one for Shorts, and add the products correspondingly. The store operator can now decide which shipping options can fulfill the products by adding shipping options to each of the profiles. 

Products and Shipping Options can only belong to one shipping profile at a time. 


## Using Shipping Profiles
The shipping profiles are used to fetch the correct shipping options for a cart. When GET `/store/shipping-options` is called the ShippingProfileService is asked to find all shipping options that can fulfill the cart's products.
