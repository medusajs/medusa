When you start your Medusa backend you may run into the following error:

```bash
Error: connect ECONNREFUSED ::1:5432
```

This error occurs because the backend couldn't connect to the PostgreSQL database. The issue could be one of the following:

1. PostgreSQL server isn't running. Make sure it's always running while the Medusa backend is running.
2. The connection URL to your PostgreSQL database is incorrect. This could be because of incorrect credentials, port number, or connection URL format. The format should be `postgres://[user][:password]@[host][:port]/[dbname]`. Make sure that the connection URL format is correct, and the credentials passed in the URL are correct. You can learn more about formatting the connection URL [here](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx#postgresql-configurations)
