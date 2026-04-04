# 🧹 CleanAUS Enterprise Cleaning Services Platform

**Enterprise-grade cleaning services platform for Australia**

Built with advanced architectural patterns: **Chain-of-Thought (CoT)**, **Graph-of-Thought (GoT)**, **Monte Carlo Tree Search (MCTS)**, **OASIS Agentic Flow**, and **AXALT** principles.

---

## 🏗️ Architecture Overview

This is a **production-hardened, multi-tenant SaaS platform** designed for national scale across Australia (NSW, VIC, QLD, WA, SA, TAS, ACT, NT).

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 + React 19 + TypeScript |
| **Backend** | NestJS 10 + TypeScript |
| **Database** | PostgreSQL 16 |
| **Cache/Queue** | Redis 7 + BullMQ |
| **Payments** | Stripe (AUD with GST) |
| **Observability** | OpenTelemetry |
| **Deployment** | Docker + Kubernetes |

### Core Design Principles

| Principle | Implementation |
|-----------|---------------|
| **API-First** | OpenAPI 3.1 spec-first development |
| **Modular** | Domain-driven design (DDD) with bounded contexts |
| **Scalable** | Serverless-ready + Kubernetes-native |
| **Agentic** | OASIS flow with autonomous AI agents |
| **Observability** | OpenTelemetry + Prometheus + Grafana |
| **Compliance** | Australian Privacy Principles, GST-compliant |

---

## 📁 Project Structure

```
cleanaus/
├── apps/
│   └── web/                    # Next.js 15 frontend
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   ├── components/     # React components
│       │   └── lib/            # API client
│       └── Dockerfile
├── services/
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── modules/        # DDD bounded contexts
│       │   │   ├── regions/    # Australian regions service
│       │   │   ├── bookings/   # Booking management
│       │   │   ├── pricing/    # Dynamic pricing engine
│       │   │   ├── dispatch/   # AI-powered dispatch
│       │   │   ├── payments/   # Stripe integration
│       │   │   └── oasis-agent/# OASIS AI agents
│       │   └── common/         # Shared utilities
│       └── Dockerfile
├── api-spec/
│   └── openapi.yaml            # OpenAPI 3.1 specification
├── k8s/                        # Kubernetes manifests
├── docker-compose.yml          # Local development
└── .env.example                # Environment template
```

---

## 🤖 OASIS Agentic AI System

**OASIS** = Orchestration of Autonomous Specialized Intelligent Services

### AI Agents

1. **Scheduling Agent** - Optimizes booking schedules using constraint satisfaction
2. **Pricing Agent** - Dynamic pricing with Australian GST compliance (10%)
3. **Dispatch Agent** - MCTS-based staff assignment optimization
4. **Support Agent** - Customer support automation
5. **Quality Agent** - Service quality monitoring

### Advanced Reasoning

- **Graph-of-Thought (GoT)**: Multi-agent collaborative reasoning
- **Monte Carlo Tree Search (MCTS)**: Optimal decision selection
- **Chain-of-Thought (CoT)**: Step-by-step reasoning trails

---

## 🇦🇺 Australian Regions

Full coverage across all states and territories:

| Code | State/Territory | Major Service Areas |
|------|-----------------|---------------------|
| NSW | New South Wales | Sydney, Newcastle, Wollongong |
| VIC | Victoria | Melbourne, Geelong, Ballarat |
| QLD | Queensland | Brisbane, Gold Coast, Sunshine Coast |
| WA | Western Australia | Perth, Fremantle, Mandurah |
| SA | South Australia | Adelaide, Mount Gambier |
| TAS | Tasmania | Hobart, Launceston, Devonport |
| ACT | Australian Capital Territory | Canberra |
| NT | Northern Territory | Darwin, Alice Springs |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Local Development

```bash
# 1. Clone repository
git clone <repository-url>
cd cleanaus

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Start infrastructure
docker-compose up -d postgres redis

# 5. Run migrations
cd services/api
pnpm typeorm migration:run

# 6. Start development servers
cd ../..
pnpm dev
```

### Access Services

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health

---

## 💳 Stripe Integration (Australian GST)

All payments are processed in **AUD** with **10% GST included**.

### Pricing Calculation

```typescript
// All prices include GST
const basePrice = 150; // $150.00 AUD
const gstRate = 0.10;  // 10% Australian GST
const gstAmount = basePrice * gstRate; // $15.00
const total = basePrice + gstAmount;   // $165.00
```

### Payment Methods Supported

- Credit/Debit Cards (Visa, Mastercard, Amex)
- Bank Transfers
- Direct Debit (Australian banks)

---

## 📊 Observability

### OpenTelemetry Integration

```bash
# Enable telemetry in .env
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

### Health Checks

- `/health` - Overall health
- `/health/live` - Liveness probe
- `/health/ready` - Readiness probe

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api web

# Run migrations
docker-compose exec api npx typeorm migration:run
```

---

## ☸️ Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace cleanaus

# Create secrets
kubectl create secret generic cleanaus-api-secrets \
  --from-literal=DB_PASSWORD=xxx \
  --from-literal=STRIPE_SECRET_KEY=xxx \
  -n cleanaus

# Apply manifests
kubectl apply -f k8s/

# Verify deployment
kubectl get pods -n cleanaus
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run API tests
cd services/api && pnpm test

# Run E2E tests
pnpm test:e2e

# Generate coverage
cd services/api && pnpm test:cov
```

---

## 📝 API Documentation

Interactive API documentation available at:

```
http://localhost:3001/api/docs
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/regions` | List all Australian regions |
| GET | `/regions/{code}/service-areas` | Get service areas |
| POST | `/bookings` | Create booking |
| POST | `/pricing/calculate` | Calculate pricing |
| POST | `/payments/create-intent` | Create Stripe payment |
| POST | `/dispatch/assign` | AI staff assignment |

---

## 🔒 Security

- **JWT Authentication** - Bearer token auth
- **Helmet.js** - HTTP security headers
- **CORS** - Configured origins
- **Rate Limiting** - API throttling
- **Input Validation** - class-validator
- **SQL Injection Protection** - TypeORM parameterized queries

---

## 📋 Compliance

### Australian Requirements

✅ **GST Compliance** - 10% GST included in all prices  
✅ **Australian Privacy Principles** - APP compliant  
✅ **ABN Display** - Business number displayed  
✅ **AUD Currency** - All transactions in Australian dollars  
✅ **Police Checks** - Staff verification tracking  

---

## 🔄 CI/CD Pipeline

Automated pipeline on push to `main`:

1. **Lint & Type Check**
2. **Unit Tests**
3. **E2E Tests**
4. **Build Docker Images**
5. **Push to Registry**
6. **Deploy to Kubernetes**

---

## 📞 Support

- **Email**: api@cleanaus.com.au
- **Phone**: 1300 CLEAN (1300 253 26)
- **API Docs**: http://localhost:3001/api/docs

---

## 📄 License

Proprietary - CleanAUS Pty Ltd © 2026

---

## 🏆 Key Features

- ✅ **All Australian Regions** - NSW, VIC, QLD, WA, SA, TAS, ACT, NT
- ✅ **AI-Powered Dispatch** - MCTS optimization
- ✅ **Dynamic Pricing** - GST-inclusive calculations
- ✅ **Real-time Scheduling** - Constraint-based optimization
- ✅ **Stripe Payments** - AUD with full GST compliance
- ✅ **Multi-Agent System** - OASIS agentic flow
- ✅ **Enterprise Ready** - Kubernetes deployment ready
- ✅ **Full Observability** - OpenTelemetry integrated
- ✅ **API-First** - OpenAPI 3.1 specification
- ✅ **Type-Safe** - Full TypeScript coverage

---

**Built for Australia. Enterprise-grade. AI-powered.**
