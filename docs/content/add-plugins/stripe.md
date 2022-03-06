# Stripe

[View plugin here](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-stripe)

<div>
  <video width="100%" height="100%" playsinline autoplay muted controls>
    <source src="https://user-images.githubusercontent.com/59018053/154807206-6fbda0a6-bf3e-4e39-9fc2-f11710afe0b9.mp4" type="video/mp4" />
  </video>
</div>


### Introduction

Handling payments is at the core of every commerce system; it allows us to run our businesses. Consequently, a vast landscape of payment providers has developed, each with varying cost models, implementational specifications, and analytical capabilities.

As a consequence, one might ask, which one(s) should I choose? Medusa makes exchanging enabled payment providers easy through its unified payment API. Here, one may select payment provider plugins already existing ([PayPal](https://docs.medusa-commerce.com/add-plugins/paypal), [Klarna](https://docs.medusa-commerce.com/add-plugins/klarna), and Stripe), or develop new ones.

Using the `medusa-payment-stripe` plugin, this guide will show you how to set up your Medusa project with Stripe as a payment provider.

[Stripe](https://stripe.com) is a battle-tested and unified platform for transaction handling. Stripe supplies you with the technical components needed to handle transactions safely and all the analytical features necessary to gain insight into your sales. These features are also available in a safe test environment which allows for a concern free development process.

### Prerequisites

This guide assumes that you have set up a medusa project (See [this guide](https://docs.medusa-commerce.com/tutorial/creating-your-medusa-server)). Furthermore, this guide will be using the Gatsby starter as our storefront (See [this guide](https://docs.medusa-commerce.com/starters/gatsby-medusa-starter)) and the Admin panel to manage our store (See the github installation guide [here](https://github.com/medusajs/admin)).

### Installation

The first step is to install the `medusa-payment-stripe` plugin in your Medusa project using your favorite package manager:

```bash
# yarn
yarn add medusa-payment-stripe


# npm
npm install medusa-payment-stripe
```

Then in your `medusa-config.js` , add the plugin to your `plugins` array:

```javascript
module.exports = {
 // ... other options
   plugins: [
       // ... other plugins
       {
            resolve: `medusa-payment-stripe`,
            options: {
                api_key: STRIPE_API_KEY,
                webhook_secret: STRIPE_WEBHOOK_SECRET,
            },
       },
   ];
}
```

Now head over to [Stripe](https://stripe.com/) and create your account. You can then click API Keys on your dashboard, and here you will see two keys. We suggest using the test environment during development, and therefore you should make sure that you are seeing the keys to the test environment (These keys start with `pk_test_` and `sk_test_` respectively).

Now open your `.env` file for the Medusa project and store your _secret key_ in the `STRIPE_API_KEY` variable:

```bash
# .env
STRIPE_API_KEY=<your key here>
```

> Note: For production you should also create a webhook on Stripe (also available on your dashboard) and store its secret in the `STRIPE_WEBHOOK_SECRET` variable. We will go into detail with this in a later guide.

Then navigate to your Gatsby starter project and open the `.env.development` file and store your _publishable key_ in the `GATSBY_STRIPE_KEY` variable:

```bash
# .env
GATSBY_STRIPE_KEY=<your key here>
```

### What’s next?

At this point we have set everything up, and the Stripe payment provider is now enabled in your Medusa project. So, go ahead and start up your medusa project, the gatsby starter, and the admin panel!

However, as Medusa allows for different payment providers in different regions (and multiple providers in each) we should first make Stripe a valid payment option in our default region. To do so, open the admin panel (`http://localhost:7000`) login, and navigate to `Settings > Region settings > Edit Default Region`. Here you should now be able to select Stripe as a payment provider:

<center>

![Change payment provider](https://i.imgur.com/mVIDYz4.png)

</center>

After doing this, and clicking save, we are ready to accept payments using Stripe. So, navigate to your storefront (`http://localhost:8000`) and go through the checkout process:

<center>

![Checkout process](https://i.imgur.com/qhanISL.gif)

</center>
After doing so, you should be able to see an uncaptured payment in  Stripe. Here, you navigate to the payments tab, where you should see the following (depending on your choices during the checkout process):

<center>

![Uncaptured payment](https://i.imgur.com/LX6UR40.png)

</center>

To then capture the payment, navigate back to the admin panel (`http://localhost:7000/`), and dig into the relevant order, and capture the payment:

<center>

![Capture payment](https://i.imgur.com/y5UxxpS.gif)

</center>

The capture is then reflected in the payment overview in Stripe as well, giving you access to all of Stripe's analytical capabilities:

<center>

![Captured payment](https://i.imgur.com/edv84Nq.png)

</center>

### Summary

In this guide we have setup Stripe as a payment provider giving you a fully functioning ecommerce experience! Interested in learning more? Check out the other guides and tutorials or head over to our [Discord channel](https://discord.gg/xpCwq3Kfn8) if you have any questions or want to become part of our community!

[View plugin here](https://github.com/medusajs/medusa/tree/master/packages/medusa-payment-stripe)
