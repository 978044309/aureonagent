# Aureon 保单医生

An AI policy checkup MVP for consumers and insurance brokers, built with Next.js, React, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

The MVP stores intake data, reports, and advisor leads in `localStorage`. The deterministic rule engine is in `lib/riskEngine.ts`; `lib/aiReportService.ts` is the integration point for a future server-side OpenAI API route.

## Included

- Policy upload and structured family responsibility intake
- Rule-generated insurance gap and family risk report
- Clear educational-analysis and no-product-recommendation boundaries
- Broker interview recruitment and 99/199 RMB pricing validation
- Human review request and broker lead workspace
