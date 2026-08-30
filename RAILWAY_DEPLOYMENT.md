# Railway Deployment Guide for Medusa + Neon

## Prerequisites
1. Railway account: https://railway.app
2. GitHub account with the repo pushed
3. Neon database created (already done)

## Steps to Deploy

### 1. Connect GitHub to Railway
1. Log in to Railway
2. Create a new project
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the Medusa repository

### 2. Configure Environment Variables in Railway
Once the project is created in Railway, go to **Variables** and add:

```
DATABASE_URL=postgres://neondb_owner:npg_jorFPJ1GV8Yb@ep-summer-unit-ays74vvx-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
```

### 3. Deploy
- Railway will automatically detect `railway.json` and `Procfile`
- Build will run: Nixpacks will install dependencies and build the project
- Start will run: `yarn workspace @medusajs/medusa serve`

### 4. After First Deployment
Once deployed, you can:
- View logs in Railway dashboard
- Access the API at the deployed URL (Railway will provide it)
- Set up custom domain if needed

### 5. Create Admin User (if needed)
If you need to create an admin user for the dashboard, you can SSH into the Railway container or run a one-off command:

```bash
railway run yarn medusa user create
```

## Troubleshooting

**Build fails?**
- Check Railway logs for errors
- Ensure Node.js version matches (20.19.0 or >=22.12.0)
- Verify DATABASE_URL is set correctly

**Database connection fails?**
- Confirm DATABASE_URL is exactly correct
- Test Neon connection from your local machine first
- Check that Neon IP whitelist allows Railway's IPs (if applicable)

**Port issues?**
- Railway automatically assigns PORT environment variable
- Medusa listens on `process.env.PORT || 9000` by default

## Next Steps After Deployment

1. Get the deployed API URL from Railway dashboard
2. Test health check: `https://your-railway-url/health`
3. Access admin dashboard: `https://your-railway-url/admin` (if configured)

