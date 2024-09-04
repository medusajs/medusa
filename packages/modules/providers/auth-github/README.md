## Testing

In order to manually test the flow, you can do the following:

1. Register a Github App - https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app
2. Go to the app, fetch the clientId and create a new clientSecret
3. Replace the values in the test with your credentials
4. Remove the `server.listen()` call
5. Run the tests, get the `location` value from the `authenticate` test, open the browser
6. Once redirected, copy the `code` param from the URL, and add it in one of the `callback` success tests
7. Once you run the tests, you should get back an access token and so on.
