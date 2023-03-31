# Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: Client password must be a string

You can get the following error while running `medusa new` or while running integration tests during [local development](../development/fundamentals/local-development.md):

```bash
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

If the error occurs while running `medusa new` and you've selected to enter your database credentials, either:

1. Make sure your database credentials are correct;
2. Or choose the Skip option to skip entering your database credentials.

If the error occurs while running integration tests, make sure the following variable is set in your system's environment variable:

```bash
DB_HOST=<YOUR_DB_HOST>
DB_USERNAME=<YOUR_DB_USERNAME>
DB_PASSWORD=<YOUR_PASSWORD>
```
