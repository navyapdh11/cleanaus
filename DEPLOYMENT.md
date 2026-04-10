# 🚀 CleanAUS Deployment Guide

## Table of Contents
1. [GitHub Actions CI/CD Pipeline](#github-actions-cicd-pipeline)
2. [Vercel Deployment](#vercel-deployment)
3. [Security Scanning](#security-scanning)
4. [Manual Deployment](#manual-deployment)
5. [Environment Variables](#environment-variables)

---

## GitHub Actions CI/CD Pipeline

### Workflow Overview

The CI/CD pipeline consists of **12 stages**:

| Stage | Name | Trigger |
|-------|------|---------|
| 1 | 🔍 Lint & Code Quality | Every push/PR |
| 2 | 🧪 Backend Tests | Every push/PR |
| 3 | 🎨 Frontend Build & Validation | Every push/PR |
| 4 | 🗄️ Database Integration Tests | Every push/PR |
| 5 | 🔄 E2E Integration Tests | Every push/PR |
| 6 | 🔒 CodeQL Security Scan | Every push/PR + Daily |
| 7 | 🛡️ Dependency Security Audit | Every push/PR |
| 8 | 📊 Observability & Metrics | Every push/PR |
| 9 | 🏢 Enterprise Validation | Every push/PR |
| 10 | 🐳 Build Docker Images | Push to main/release |
| 11 | 🚀 Trigger Vercel Deployment | Push to main/release |
| 12 | 🌐 Deploy to Production (K8s) | Push to main (manual approval) |

### Branch Strategy

| Branch | Behavior |
|--------|----------|
| `main` | Full CI/CD + Production deploy |
| `develop` | Full CI/CD + Preview deploy |
| `release/*` | Full CI/CD + Staging deploy |
| `feature/*` | Lint + Tests only |

### Required Secrets

Add these to **GitHub → Settings → Secrets and variables → Actions**:

```bash
# Vercel
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/prj_xxx
VERCEL_PREVIEW_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/prj_xxx

# Kubernetes (for production deployment)
KUBE_CONFIG=<base64-encoded-kubeconfig>

# Codecov (optional)
CODECOV_TOKEN=your-codecov-token

# Snyk (optional)
SNYK_TOKEN=your-snyk-token
```

---

## Vercel Deployment

### Option 1: Via GitHub Actions (Recommended)

The pipeline automatically triggers Vercel deployment on push to `main`.

### Option 2: Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
./scripts/deploy-vercel.sh preview

# Deploy production
./scripts/deploy-vercel.sh production
```

### Option 3: Via Deploy Hook

1. Go to Vercel → Project Settings → Git → Deploy Hooks
2. Create a hook named "GitHub CI"
3. Copy the URL
4. Add to GitHub Secrets as `VERCEL_DEPLOY_HOOK_URL`

### Vercel Configuration

The project includes `apps/web/vercel.json` with:
- ✅ Security headers (HSTS, CSP, X-Frame, etc.)
- ✅ API proxy rewrite to `https://api.cleanaus.com.au`
- ✅ Australian region deployment (`syd1`)
- ✅ Production build optimization

---

## Security Scanning

### CodeQL Security Scan

- **Runs:** Every push/PR + Daily at 2 AM UTC
- **Config:** `codeql-config.yml`
- **Queries:** security-and-quality + security-extended
- **Results:** GitHub Security tab

### Dependency Audit

- **Runs:** Every push/PR
- **Tools:** npm audit + Snyk
- **Threshold:** High severity

---

## Manual Deployment

### Deploy Frontend (Vercel)

```bash
cd apps/web
vercel deploy --prod
```

### Deploy Backend (Kubernetes)

```bash
# Update image tags
sed -i "s|image:.*cleanaus-api.*|image: ghcr.io/your-org/cleanaus-api:latest|g" k8s/api-deployment.yaml
sed -i "s|image:.*cleanaus-web.*|image: ghcr.io/your-org/cleanaus-web:latest|g" k8s/web-deployment.yaml

# Apply manifests
kubectl apply -f k8s/

# Monitor rollout
kubectl rollout status deployment/cleanaus-api -n cleanaus
kubectl rollout status deployment/cleanaus-web -n cleanaus
```

### Deploy Backend (Docker Compose)

```bash
docker-compose up -d --build
docker-compose logs -f api web
```

---

## Environment Variables

### Vercel (Frontend)

Set in Vercel → Project Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://api.cleanaus.com.au
```

### Vercel (API - if deploying separately)

```bash
NODE_ENV=production
DB_ENABLED=false
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_live_xxx
OTEL_ENABLED=false
```

---

## Monitoring & Observability

### Health Endpoints

- **API:** `https://api.cleanaus.com.au/health`
- **Web:** `https://cleanaus.com.au`

### Metrics

- **API Metrics:** `https://api.cleanaus.com.au/metrics` (when OTEL_ENABLED=true)
- **GitHub Actions:** See `observability.yml` workflow
- **Vercel Analytics:** https://vercel.com/cleanaus/cleanaus/analytics

### Alerts

- CodeQL: Daily scans with GitHub Security alerts
- Dependencies: Automated audit on every PR
- Performance: Lighthouse CI with budget enforcement

---

## Troubleshooting

### Build Fails in CI

```bash
# Test locally
pnpm install --frozen-lockfile
pnpm run build
```

### Vercel Deploy Fails

```bash
# Check build logs
vercel logs cleanaus.com.au

# Redeploy
vercel deploy --prod --force
```

### Kubernetes Deploy Fails

```bash
# Check pod status
kubectl get pods -n cleanaus

# View logs
kubectl logs -f deployment/cleanaus-api -n cleanaus
kubectl logs -f deployment/cleanaus-web -n cleanaus

# Rollback
kubectl rollout undo deployment/cleanaus-api -n cleanaus
```

---

**Last Updated:** April 10, 2026
**Version:** 1.0.0
