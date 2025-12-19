# Deployment Guide

This project supports multiple deployment options. Choose the one that best fits your needs.

## Option 1: Vercel (Recommended for Next.js)

Vercel is the easiest option for Next.js applications with built-in CI/CD.

### Setup Steps:

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI locally** (optional, for testing):
   ```bash
   npm install -g vercel
   vercel login
   ```

3. **Link your project** (if deploying manually):
   ```bash
   vercel link
   ```

4. **Get your Vercel credentials**:
   - Go to [Vercel Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token (copy it - you'll need it)
   - Go to your project settings to find:
     - **Organization ID** (in project settings)
     - **Project ID** (in project settings)

5. **Add GitHub Secrets**:
   Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:
   - `VERCEL_TOKEN` - Your Vercel token from step 4
   - `VERCEL_ORG_ID` - Your organization ID
   - `VERCEL_PROJECT_ID` - Your project ID

6. **Enable the workflow**:
   - Edit `.github/workflows/vercel.yml`
   - Uncomment the `on:` section at the top
   - Remove the `workflow_dispatch:` line

7. **Deploy**:
   - Push to `main` branch for automatic production deployment
   - Create a PR for preview deployments

### Alternative: Use Vercel's GitHub Integration

Instead of using GitHub Actions, you can:
1. Import your GitHub repository directly in Vercel
2. Vercel will automatically deploy on every push
3. No GitHub Actions needed!

---

## Option 2: Railway

Railway provides easy deployment with PostgreSQL included.

### Setup Steps:

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and connect your GitHub repository

3. **Add PostgreSQL service**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will provide a `DATABASE_URL`

4. **Deploy your app**:
   - Click "New" → "GitHub Repo" → Select your repository
   - Add environment variable: `DATABASE_URL` (from step 3)
   - Railway will automatically build and deploy

5. **Update GitHub Actions** (optional):
   - Edit `.github/workflows/deploy.yml`
   - Uncomment the Railway deployment section
   - Add `RAILWAY_TOKEN` to GitHub secrets

---

## Option 3: Render

Render offers free tier hosting with PostgreSQL.

### Setup Steps:

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a PostgreSQL database**:
   - Go to Dashboard → "New" → "PostgreSQL"
   - Copy the connection string

3. **Create a Web Service**:
   - Go to Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Build command: `npm ci && npx prisma generate && npm run build`
   - Start command: `npm start`
   - Add environment variable: `DATABASE_URL` (from step 2)

4. **Run migrations**:
   - In Render dashboard, go to your service → "Shell"
   - Run: `npx prisma migrate deploy`

---

## Option 4: Docker (Self-hosted)

Deploy using Docker to any platform that supports containers (AWS, DigitalOcean, etc.).

### Build and Run Locally:

```bash
# Build the image
docker build -t tarot-app .

# Run with docker-compose (includes PostgreSQL)
docker-compose up -d

# Or run standalone (requires external DATABASE_URL)
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" tarot-app
```

### Deploy to Cloud Platforms:

**AWS ECS/Fargate:**
- Push Docker image to ECR
- Create ECS task definition
- Deploy to Fargate

**DigitalOcean App Platform:**
- Connect GitHub repository
- Select Dockerfile
- Add `DATABASE_URL` environment variable

**Google Cloud Run:**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/tarot-app
gcloud run deploy --image gcr.io/PROJECT_ID/tarot-app
```

---

## Option 5: Manual Deployment (No CI/CD)

If you prefer manual deployment:

1. **Build locally**:
   ```bash
   npm ci
   npx prisma generate
   npm run build
   ```

2. **Upload to your server**:
   - Upload the `.next` folder, `node_modules`, `package.json`, etc.
   - Or use `npm run build` on your server

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

---

## Environment Variables Required

All deployment methods require:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production` for production builds

Optional:
- Any other environment variables your app needs

---

## Database Migrations

After deploying, always run migrations:

```bash
npx prisma migrate deploy
```

Or use the GitHub Actions workflow:
- Go to Actions → "Prisma Migrate"
- Click "Run workflow"
- Select environment and migration name

---

## Current Status

- ✅ **CI Pipeline**: Active (runs on every push/PR)
- ⚠️ **Vercel Deployment**: Disabled (enable by following Option 1)
- ✅ **Generic Deploy Workflow**: Active (builds but doesn't deploy automatically)
- ✅ **Docker**: Ready to use

Choose your preferred deployment method and follow the setup steps above!

