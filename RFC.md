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

# Django docs and other posts to take inspiration from
- https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/gunicorn/
- https://docs.djangoproject.com/en/4.1/howto/deployment/
- https://serverfault.com/questions/331256/why-do-i-need-nginx-and-something-like-gunicorn
- https://vsupalov.com/what-is-gunicorn/

# Note
I will follow this pull request through with all necessary changes. If you'd rather do it internally and or if you think this change is not needed, give me a hint :)

# The entrypoint in medusa-starter-default
Right now before making this PR, I was trying to figure out how to start medusa with pm2 i.e. finding out what's the entry point to "medusa develop" and it was pretty hard to now where the entrypoint js file is for medusa develop.
Noticed right now, there was a commit yesterday from adrien with an index.js in medusa-starter. So maybe you're already working on, what I'm suggesting in this RFC.
https://github.com/medusajs/medusa-starter-default/commit/b0328836d4d829e58ec289f9b968a3786c5ff389

# Questions
Did I go the right route with doing a pull request as an RFC, or would you rather have it posted as an issue or a discussion? My thought process went like this: Since I will see this through if you think it a good idea and also that I wish to get feedback it fits as an RFC. An issue is for yes issues. And discussions, simply don't get that much notice and since I've put though and time into this, it deserves at least a little feedback since it might help many people deploying medusa in production, especially those that never but a nodejs application into production.
