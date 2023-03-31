# CORS issues

If you are experiencing connection issues when trying to access your Medusa backend from a storefront, it is most likely due to Cross-Origin Resource Sharing (CORS) issues.

You might see a log in your browser console, that looks like this:

![CORS error log](https://res.cloudinary.com/dza7lstvk/image/upload/v1668003322/Medusa%20Docs/Other/jnHK115_udgf2n.png)

In your `medusa-config.js` , you should ensure that you've configured your CORS settings correctly. By default, the Medusa starter runs on port `9000`, Medusa Admin runs on port `7000`, and the storefront starters run on port `8000`.

The default configuration uses the following CORS settings:

```js title=medusa-config.js
// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || 
  "http://localhost:7000,http://localhost:7001"

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = 
  process.env.STORE_CORS || "http://localhost:8000"
```

If you wish to run your storefront or Medusa admin on other ports, you should update the above settings accordingly.

---

## See Also

- [Configure your Medusa backend](../development/backend/configurations.md)
