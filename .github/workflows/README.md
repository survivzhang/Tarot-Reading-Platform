# GitHub Actions Workflows

This directory contains CI/CD workflows for the Tarot Reading Platform.

## Active Workflows

### ✅ `ci.yml` - Continuous Integration
**Status**: Active  
**Triggers**: Push/PR to `main` or `develop` branches

Runs on every push and pull request:
- Linting (ESLint)
- Type checking (TypeScript)
- Build validation
- Prisma schema validation

**Required Secrets**: None (uses fallback DATABASE_URL for build)

---

### ✅ `deploy.yml` - Generic Deployment
**Status**: Active (builds only, no auto-deploy)  
**Triggers**: Push to `main` branch

Builds the application for production but doesn't deploy automatically. You can:
- Add deployment steps for your platform
- Use it as a build validation step
- Manually deploy the built artifacts

**Required Secrets**: 
- `DATABASE_URL` (for build validation)

---

### ⚠️ `vercel.yml` - Vercel Deployment
**Status**: Disabled by default  
**Triggers**: Manual only (`workflow_dispatch`)

This workflow is disabled until you configure Vercel. To enable:

1. **Get Vercel credentials**:
   - Create account at [vercel.com](https://vercel.com)
   - Get token from [Settings → Tokens](https://vercel.com/account/tokens)
   - Get Org ID and Project ID from your project settings

2. **Add GitHub Secrets**:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

3. **Enable the workflow**:
   - Edit `vercel.yml`
   - Uncomment the `on:` section (lines 4-8)
   - Remove `workflow_dispatch:` line

**Alternative**: Use Vercel's GitHub integration instead - it's easier and doesn't require GitHub Actions!

---

### ✅ `prisma-migrate.yml` - Database Migrations
**Status**: Active (manual trigger)  
**Triggers**: Manual (`workflow_dispatch`)

Run database migrations manually:
1. Go to Actions → "Prisma Migrate"
2. Click "Run workflow"
3. Select environment (staging/production)
4. Enter migration name

**Required Secrets**:
- `DATABASE_URL` (for the selected environment)

---

## Workflow Status Summary

| Workflow | Status | Auto-runs | Manual |
|----------|--------|-----------|--------|
| `ci.yml` | ✅ Active | Yes | No |
| `deploy.yml` | ✅ Active | Yes | Yes |
| `vercel.yml` | ⚠️ Disabled | No | Yes |
| `prisma-migrate.yml` | ✅ Active | No | Yes |

---

## Troubleshooting

### "No existing credentials found" error
- **Cause**: Vercel workflow is trying to run but secrets aren't set
- **Solution**: Either disable the workflow (it's already disabled) or add the required secrets

### Build failures
- Check that `DATABASE_URL` secret is set (even if using a dummy value for build)
- Ensure all dependencies are in `package.json`
- Check workflow logs for specific error messages

### Migration failures
- Verify `DATABASE_URL` is correct for the target environment
- Ensure database is accessible from GitHub Actions
- Check that migrations haven't already been applied

---

## Adding New Workflows

To add a new workflow:
1. Create a new `.yml` file in this directory
2. Follow GitHub Actions syntax
3. Document it in this README
4. Test with `workflow_dispatch` first before enabling auto-runs

