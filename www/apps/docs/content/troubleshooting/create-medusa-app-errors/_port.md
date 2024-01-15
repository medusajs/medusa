By default, the Medusa backend runs on `localhost:9000`. However, the port may change based on the `PORT` environment variable.

If you run the `create-medusa-app` command, and the installation finishes successfully, but the backend runs on a different port than `9000`, it may cause errors when you try to create an admin user or login during the onboarding process. This could either be because you have the `PORT` environment variable set to something differnt, or because of port forwarding.

To resolve this, you must:

1. Terminate the `create-medusa-app` process and change to the new backend's directory.
2. Either explicitely set the `PORT` environment variable to `9000`, or set the environment variable `MEDUSA_ADMIN_BACKEND_URL` to the backend's URL. For example, if the backend is running on `localhost:7000`, change the `MEDUSA_ADMIN_BACKEND_URL` to `http://localhost:7001`. This ensures that the admin uses the correct port. In case of port fowarding, it's recommended to explicitely set the `PORT` environment variable.
3. Create an admin user using the [user command of the CLI tool](../../cli/reference.mdx#user).
4. Start the backend again either with the `dev` command of the backend project or using `npx medusa develop` and try to login again.
