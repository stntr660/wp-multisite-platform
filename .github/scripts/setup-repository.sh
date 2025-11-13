#!/bin/bash

# GitHub Repository Setup Script for WordPress Multi-Site CI/CD
# This script sets up branch protection rules and repository settings

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
REPO_OWNER="${1:-your-github-username}"
REPO_NAME="${2:-wordpress-multisite}"
GITHUB_TOKEN="${3:-$GITHUB_TOKEN}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}Error: GitHub token not provided${NC}"
    echo "Usage: $0 <repo-owner> <repo-name> [github-token]"
    echo "Or set GITHUB_TOKEN environment variable"
    exit 1
fi

echo -e "${BLUE}🔧 Setting up GitHub repository: $REPO_OWNER/$REPO_NAME${NC}"

# Function to make GitHub API calls
github_api() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
             -H "Authorization: token $GITHUB_TOKEN" \
             -H "Accept: application/vnd.github.v3+json" \
             -d "$data" \
             "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/$endpoint"
    else
        curl -s -X "$method" \
             -H "Authorization: token $GITHUB_TOKEN" \
             -H "Accept: application/vnd.github.v3+json" \
             "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/$endpoint"
    fi
}

# Check if repository exists
echo -e "${YELLOW}📋 Checking repository existence...${NC}"
if ! github_api "GET" "" | grep -q '"id"'; then
    echo -e "${RED}❌ Repository $REPO_OWNER/$REPO_NAME not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Repository found${NC}"

# Update repository settings
echo -e "${YELLOW}⚙️ Updating repository settings...${NC}"
github_api "PATCH" "" '{
    "description": "WordPress Multi-Site Docker Deployment with CI/CD",
    "homepage": "https://zonemation.com",
    "has_issues": true,
    "has_projects": true,
    "has_wiki": false,
    "has_downloads": false,
    "default_branch": "main",
    "allow_squash_merge": true,
    "allow_merge_commit": false,
    "allow_rebase_merge": true,
    "delete_branch_on_merge": true,
    "vulnerability_alerts": true,
    "automated_security_fixes": true
}' > /dev/null
echo -e "${GREEN}✅ Repository settings updated${NC}"

# Set up branch protection for main branch
echo -e "${YELLOW}🛡️ Setting up branch protection for main...${NC}"
github_api "PUT" "branches/main/protection" '{
    "required_status_checks": {
        "strict": true,
        "contexts": [
            "Security & Quality Checks",
            "Build & Test"
        ]
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": true,
        "required_approving_review_count": 1,
        "require_last_push_approval": false
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": true
}' > /dev/null
echo -e "${GREEN}✅ Main branch protection enabled${NC}"

# Set up branch protection for staging branch  
echo -e "${YELLOW}🚦 Setting up branch protection for staging...${NC}"
github_api "PUT" "branches/staging/protection" '{
    "required_status_checks": {
        "strict": true,
        "contexts": [
            "Security & Quality Checks",
            "Build & Test"
        ]
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": false,
        "required_approving_review_count": 1,
        "require_last_push_approval": false
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": true
}' > /dev/null
echo -e "${GREEN}✅ Staging branch protection enabled${NC}"

# Create CODEOWNERS file
echo -e "${YELLOW}👥 Setting up code owners...${NC}"
cat > CODEOWNERS << 'EOF'
# Global code owners
* @your-github-username

# WordPress core files
*/public_html/wp-config.php @your-github-username
docker-compose.yml @your-github-username
nginx/ @your-github-username

# CI/CD workflows  
.github/ @your-github-username

# Scripts and automation
scripts/ @your-github-username

# Database configurations
mysql/ @your-github-username
*.sql @your-github-username

# Environment configurations
.env* @your-github-username
EOF
echo -e "${GREEN}✅ CODEOWNERS file created${NC}"

# Create repository environments
echo -e "${YELLOW}🌍 Setting up deployment environments...${NC}"

# Production environment
github_api "PUT" "environments/production" '{
    "wait_timer": 0,
    "reviewers": [
        {
            "type": "User",
            "id": null
        }
    ],
    "deployment_branch_policy": {
        "protected_branches": true,
        "custom_branch_policies": false
    }
}' > /dev/null

# Staging environment
github_api "PUT" "environments/staging" '{
    "wait_timer": 0,
    "reviewers": [],
    "deployment_branch_policy": {
        "protected_branches": false,
        "custom_branch_policies": true,
        "custom_branches": ["staging", "main"]
    }
}' > /dev/null
echo -e "${GREEN}✅ Deployment environments created${NC}"

# Create repository secrets template
echo -e "${YELLOW}🔐 Creating secrets template...${NC}"
cat > SECRETS_TEMPLATE.md << 'EOF'
# Required Repository Secrets

Set up the following secrets in your GitHub repository settings:

## Production Environment
- `PRODUCTION_HOST`: Production server IP/hostname
- `PRODUCTION_USER`: SSH username for production server  
- `PRODUCTION_PRIVATE_KEY`: SSH private key for production server
- `PRODUCTION_PATH`: Deployment path on production server (e.g., /var/www/wordpress-multisite)
- `PRODUCTION_ENV`: Complete .env file content for production

## Staging Environment  
- `STAGING_HOST`: Staging server IP/hostname
- `STAGING_USER`: SSH username for staging server
- `STAGING_PRIVATE_KEY`: SSH private key for staging server
- `STAGING_PATH`: Deployment path on staging server
- `STAGING_ENV`: Complete .env file content for staging

## Notifications
- `SLACK_WEBHOOK`: Slack webhook URL for notifications

## External Storage (Optional)
- `AWS_ACCESS_KEY_ID`: AWS access key for S3 backups
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for S3 backups  
- `S3_BUCKET`: S3 bucket name for backups

## How to Add Secrets
1. Go to your repository on GitHub
2. Click Settings → Secrets and variables → Actions  
3. Click "New repository secret"
4. Add each secret with the exact name listed above
EOF
echo -e "${GREEN}✅ Secrets template created${NC}"

# Create repository labels
echo -e "${YELLOW}🏷️ Setting up repository labels...${NC}"

# Define labels
declare -A LABELS=(
    ["bug"]='{"name":"bug","color":"d73a4a","description":"Something is not working"}'
    ["enhancement"]='{"name":"enhancement","color":"a2eeef","description":"New feature or request"}'
    ["documentation"]='{"name":"documentation","color":"0075ca","description":"Improvements or additions to documentation"}'
    ["deployment"]='{"name":"deployment","color":"1d76db","description":"Deployment related changes"}'
    ["security"]='{"name":"security","color":"b60205","description":"Security related issues"}'
    ["performance"]='{"name":"performance","color":"fbca04","description":"Performance improvements"}'
    ["database"]='{"name":"database","color":"d4c5f9","description":"Database related changes"}'
    ["wordpress"]='{"name":"wordpress","color":"21759b","description":"WordPress specific changes"}'
    ["infrastructure"]='{"name":"infrastructure","color":"5319e7","description":"Infrastructure and DevOps changes"}'
    ["monitoring"]='{"name":"monitoring","color":"0e8a16","description":"Monitoring and alerting"}'
    ["backup"]='{"name":"backup","color":"c2e0c6","description":"Backup and recovery related"}'
    ["new-website"]='{"name":"new-website","color":"ff6b35","description":"Adding a new website"}'
)

for label_name in "${!LABELS[@]}"; do
    github_api "POST" "labels" "${LABELS[$label_name]}" > /dev/null 2>&1 || echo "Label $label_name might already exist"
done
echo -e "${GREEN}✅ Repository labels created${NC}"

# Create issue templates
echo -e "${YELLOW}📝 Creating issue templates...${NC}"
mkdir -p .github/ISSUE_TEMPLATE

# Bug report template
cat > .github/ISSUE_TEMPLATE/bug_report.yml << 'EOF'
name: Bug Report
description: File a bug report
title: "[BUG] "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  
  - type: dropdown
    id: affected-website
    attributes:
      label: Affected Website
      description: Which website is experiencing the bug?
      options:
        - airarom.ma
        - electroromanos.ma
        - freshexpress.ma
        - sabeel.agency
        - sabeelacademy.ma
        - sumo.ma
        - yvesmorel.ma
        - zonemation.com
        - oumniarentalcars.com
        - All websites
        - Infrastructure/Docker
    validations:
      required: true
      
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: A clear description of what the bug is
    validations:
      required: true
      
  - type: textarea
    id: expected-behavior
    attributes:
      label: Expected behavior
      description: What did you expect to happen?
    validations:
      required: true
      
  - type: textarea
    id: logs
    attributes:
      label: Relevant logs
      description: Please copy and paste any relevant log output
      render: shell
EOF

# Feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.yml << 'EOF'
name: Feature Request
description: Suggest a new feature or enhancement
title: "[FEATURE] "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature!
  
  - type: dropdown
    id: feature-type
    attributes:
      label: Feature Type
      options:
        - New Website
        - Infrastructure Improvement
        - Monitoring Enhancement
        - Security Improvement
        - Performance Optimization
        - Documentation
        - Other
    validations:
      required: true
      
  - type: textarea
    id: feature-description
    attributes:
      label: Feature Description
      description: Describe the feature you'd like to see
    validations:
      required: true
      
  - type: textarea
    id: use-case
    attributes:
      label: Use Case
      description: Describe your use case for this feature
    validations:
      required: true
EOF

# New website template  
cat > .github/ISSUE_TEMPLATE/new_website.yml << 'EOF'
name: New Website Request
description: Request addition of a new website to the multi-site setup
title: "[NEW WEBSITE] "
labels: ["new-website", "enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        Use this template to request adding a new website to the multi-site deployment.
  
  - type: input
    id: domain-name
    attributes:
      label: Domain Name
      description: The full domain name (e.g., newsite.com)
    validations:
      required: true
      
  - type: dropdown
    id: website-type
    attributes:
      label: Website Type
      options:
        - WordPress
        - Static HTML
    validations:
      required: true
      
  - type: textarea
    id: website-description
    attributes:
      label: Website Description
      description: Brief description of the website purpose
    validations:
      required: true
      
  - type: checkboxes
    id: requirements
    attributes:
      label: Requirements Checklist
      options:
        - label: Domain DNS is configured
        - label: SSL certificate will be needed
        - label: Database backup strategy considered
        - label: Content migration plan (if applicable)
EOF

echo -e "${GREEN}✅ Issue templates created${NC}"

# Create pull request template
echo -e "${YELLOW}📋 Creating pull request template...${NC}"
cat > .github/pull_request_template.md << 'EOF'
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Infrastructure change
- [ ] New website addition

## Affected Websites
- [ ] airarom.ma
- [ ] electroromanos.ma  
- [ ] freshexpress.ma
- [ ] sabeel.agency
- [ ] sabeelacademy.ma
- [ ] sumo.ma
- [ ] yvesmorel.ma
- [ ] zonemation.com
- [ ] oumniarentalcars.com
- [ ] Infrastructure/All sites

## Testing
- [ ] Local testing completed
- [ ] Staging deployment tested
- [ ] Database migration tested (if applicable)
- [ ] SSL certificate verified (if applicable)
- [ ] Backup/restore tested (if applicable)

## Deployment Notes
Any special deployment instructions or considerations

## Security Considerations
Any security implications or considerations

## Rollback Plan
How to rollback if deployment fails
EOF
echo -e "${GREEN}✅ Pull request template created${NC}"

echo -e "${BLUE}🎉 Repository setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review and update the CODEOWNERS file with actual GitHub usernames"
echo "2. Add the required secrets (see SECRETS_TEMPLATE.md)"
echo "3. Create staging and main branches if they don't exist"
echo "4. Test the CI/CD workflows"
echo "5. Update the repository description and homepage URL"
echo ""
echo -e "${GREEN}Repository is now configured for WordPress Multi-Site CI/CD!${NC}"