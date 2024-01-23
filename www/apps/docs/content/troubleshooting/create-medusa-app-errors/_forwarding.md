If you're running the Medusa backend through tools like VSCode or GitHub Codespaces, you must ensure that:

1. Port forwarding is configured for ports `9000` and `7001`. Refer to the following resources on how to configure forwarded ports:
   1. [VSCode local development.](https://code.visualstudio.com/docs/editor/port-forwarding)
   2. [VSCode remote development.](https://code.visualstudio.com/docs/remote/ssh#_forwarding-a-port-creating-ssh-tunnel)
   3. [GitHub Codespaces.](https://docs.github.com/en/codespaces/developing-in-a-codespace/forwarding-ports-in-your-codespace)
2. If your tool or IDE exposes an address other than `localhost`, such as `127.0.0.1`, make sure to add that address to the [admin_cors](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx) Medusa configuration. Your tool will show you what the forwarded address is.

After setting these configurations, run your Medusa backend and try again. If you couldn't create an admin user before, run the following command in the root directory of your Medusa project to create an admin user:

```bash
npx medusa user -e admin@medusa-test.com -p supersecret
```
