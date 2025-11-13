# GitHub Repository Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/stntr660
2. Click "New repository" (green button)
3. Repository name: `wp-multisite-platform`
4. Description: `WordPress Multi-Site Docker Platform with CI/CD`
5. Set visibility (Public/Private)
6. **DO NOT** check any boxes (README, .gitignore, license)
7. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, run:

```bash
cd "/Users/mac/Documents/Zonemation/Transformation digital/Clients/WP"
git push -u origin main
```

## Step 3: Configure GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets for automated deployment:

### Production Server Secrets
```
PRODUCTION_HOST=your-server-ip-address
PRODUCTION_USER=your-ssh-username  
PRODUCTION_PRIVATE_KEY=your-ssh-private-key-content
PRODUCTION_PATH=/var/www/wp-multisite
PRODUCTION_ENV=complete-content-of-your-env-file
```

### Optional: Staging Server Secrets
```
STAGING_HOST=staging-server-ip
STAGING_USER=staging-ssh-username
STAGING_PRIVATE_KEY=staging-ssh-private-key
STAGING_PATH=/var/www/wp-multisite-staging
STAGING_ENV=staging-env-file-content
```

### Notification Secrets (Optional)
```
SLACK_WEBHOOK=https://hooks.slack.com/services/your/slack/webhook
EMAIL_USERNAME=notifications@yourdomain.com
EMAIL_PASSWORD=your-email-password
NOTIFICATION_EMAIL=admin@yourdomain.com
```

## Step 4: Verify Setup

1. Check that all files are pushed to GitHub
2. Go to Actions tab to see available workflows
3. The following workflows should be visible:
   - 🚀 WordPress Multi-Site Deployment
   - 🔒 Security Scan  
   - 🆕 Add New Website
   - 📚 Documentation Check

## Next Steps

1. **Server Setup**: Follow `docs/SETUP-GUIDE.md` for server preparation
2. **Environment Config**: Copy `.env.example` to `.env` on your server
3. **DNS Configuration**: Point your domains to the server IP
4. **SSL Certificates**: Configure Let's Encrypt certificates
5. **First Deployment**: Push to main branch triggers automatic deployment

## Repository Structure

```
wp-multisite-platform/
├── .github/workflows/     # GitHub Actions CI/CD
├── docker-compose.yml     # Main Docker configuration  
├── .env.example          # Environment template
├── scripts/              # Automation scripts
├── docs/                 # Documentation
├── nginx/                # Nginx configurations
└── [website-directories] # WordPress sites
```

## Troubleshooting

If push fails:
1. Ensure repository exists on GitHub
2. Check your GitHub token has proper permissions
3. Verify the repository URL is correct

For deployment issues:
1. Check GitHub Actions logs
2. Verify server access and secrets
3. Review documentation in `/docs/`