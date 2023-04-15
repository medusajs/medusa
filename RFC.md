# What
- Add docs for how to use pm2 and explain why it's needed
-- Possibly explain the other options of process manager
- Possibly: Make a command in package.json medusa-starter-default to start medusa with pm2 with sane defaults.

# Why
- For a person coming to medusajs and putting it in production it's not apparent you need a process manager (especially since there's no mentions in docs about process manager)
-- One common missunderstanding might be that since nodejs has a event loop a process manager is not needed
-- Django has really good docs about how and why you should use Gunicorn as process manager in production, could take inspiration from their docs pages how I would write the docs page,
- It's not apparent how to start medusajs with pm2, you have to go through the whole command code for "medusa develop" to understand which is the entry point file for medusa-starter-default and medusa, which you need to start medusa with pm2

# How
## Route 1
Add a docs page under https://docs.medusajs.com/deployments/server/ explaining why you need a process manager. With the name deploying medusa with pm2.

In each deployment guide it says "change start command" => "medusa migrations run && medusa start"
For example here: "https://docs.medusajs.com/deployments/server/deploying-on-railway#change-start-command
Link to the new https://docs.medusajs.com/deployments/server/deploy-with-pm2

## Route 2
Add pm2 as a dependency to medusa-starter-default and add a new command, for example "yarn start-production": "medusa run migrations && pm2 !!WRITE"
Link to the new docs page about pm2 in each "deploying on X", explaining it in more detail.


# Note
I will follow this pull request through with all necessary changes, if you'd not rather do it internally and if you not think this change is not needed.
