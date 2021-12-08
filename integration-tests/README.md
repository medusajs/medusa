# Integration-tests

To be able to run the integration tests on your local machine, 
run the following commands (adapted to your machine)

```bash
cd [ROOT_OF_YOUR_REPO]
medusa-dev -p [YOUR_ABSOLUTE_PATH_TO_THE_REPO]
npm run bootstrap
cd integration-tests/api
medusa-dev -s
npm run build
cd - && npm run test:integration
```