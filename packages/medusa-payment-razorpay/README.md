# MEDUSA-PAYMENT-RAZORPAY

[RAZORPAY](https://razorpay.comm) an immensely popular payment gateway with a host of features. 
This plugin enables the razorpay payment interface on [medusa](https://medusajs.com) commerce stack

## Installation

Use the package manager npm to install medusa-payment-razorpay.

```bash
npm install medusa-payment-razorpay
```

## Usage


Register for a razorpay account and generate the api keys
In your environment file (.env) you need to define 
```
RAZORPAY_API_KEY=<your api key>
RAZORPAY_API_KEY_SECRET=<your api key secret>
```
You need to add the plugin into your medusa-config.js as shown below

```
const plugins = [
  ...,
  {
    resolve:`medusa-payment-razorpay`,
    options:{
        api_key : process.env.RAZORPAY_API_KEY,
        api_key_secret:process.env.RAZORPAY_API_KEY_SECRET
    }
  },
  ...]
```
## Contributing


Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Disclaimer
The code was tested on limited number of usage scenarios. There maybe unforseen bugs, please raise the issues as they come, or create pull requests if you'd like to submit fixes.