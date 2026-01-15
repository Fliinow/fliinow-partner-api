# @fliinow-com/fliinow-partner-api

Official TypeScript/JavaScript SDK for the Fliinow Partner API. Easily integrate travel financing options into your platform.

[![npm version](https://badge.fury.io/js/%40fliinow-com%2Ffliinow-partner-api.svg)](https://www.npmjs.com/package/@fliinow-com/fliinow-partner-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @fliinow-com/fliinow-partner-api
# or
yarn add @fliinow-com/fliinow-partner-api
# or
pnpm add @fliinow-com/fliinow-partner-api
```

## Quick Start

```typescript
import { FliinowClient } from '@fliinow-com/fliinow-partner-api';

const fliinow = new FliinowClient({
  apiKey: 'fk_test_your_api_key',  // fk_test_* for sandbox, fk_live_* for production
  sandbox: true,                    // true for sandbox, false for production
});

// Create a financing operation
const operation = await fliinow.operations.create({
  externalId: 'BOOK-2026-00123',
  client: {
    firstName: 'Juan',
    lastName: 'García López',
    email: 'juan@email.com',
    prefix: '+34',
    phone: '612345678',
    documentId: '12345678A',
    documentValidityDate: '31-12-2030',
    gender: 'MALE',
    birthDate: '15-03-1985',
    nationality: 'ESP',
    address: 'Calle Mayor 1',
    city: 'Madrid',
    postalCode: '28001',
    countryCode: 'ES',
  },
  packageName: 'Viaje romántico a París',
  packageTravel: true,
  travelersNumber: 2,
  flightDtoList: [],
  hotelDtoList: [],
  totalPrice: 1500.00,
  totalReserve: 1500.00,
});

// Redirect user to financing checkout
window.location.href = operation.financingUrl;
```

## Features

- 🔐 **Secure Authentication** - API key-based with sandbox/production separation
- 📦 **Full TypeScript Support** - Complete type definitions included
- 🔄 **Promise-based API** - Modern async/await interface
- 🛡️ **Error Handling** - Structured error types for easy debugging
- 🌍 **Multi-environment** - Sandbox and production support

## API Reference

### Operations

```typescript
// Create an operation
const operation = await fliinow.operations.create({
  externalId: 'ORDER-12345',
  client: { /* ClientDto */ },
  packageName: 'Trip to Paris',
  packageTravel: true,
  travelersNumber: 2,
  totalPrice: 1500.00,
  totalReserve: 1500.00,
});

// Get operation by ID
const operation = await fliinow.operations.get('abc123xyz');

// Get operation status
const status = await fliinow.operations.getStatus('abc123xyz');
// status.status: 'GENERATED' | 'PENDING' | 'FAVORABLE' | 'CONFIRMED' | 'REFUSED' | ...

// List operations with filters
const { content, totalElements } = await fliinow.operations.list({
  status: 'FAVORABLE',
  fromDate: '2026-01-01',
  page: 0,
  size: 20,
});

// Cancel an operation
await fliinow.operations.cancel('abc123xyz');
```

### Plans (Advanced Flow)

```typescript
// Get available financing plans
const plans = await fliinow.operations.getPlans('abc123xyz');

// Display plans to user
for (const plan of plans) {
  console.log(`${plan.installments} installments: ${plan.commonQuota.amount}€/month`);
  console.log(`  APR: ${plan.apr}%`);
  console.log(`  Provider: ${plan.financingProvider.name}`);
}
```

### Financing (Advanced Flow)

```typescript
// Start financing with selected plan
const result = await fliinow.operations.startFinancing('abc123xyz', {
  financialProviderId: 1,  // From plan.financingProvider.id
  installments: 6,
  successCallbackUrl: 'https://yoursite.com/success',
  errorCallbackUrl: 'https://yoursite.com/error',
});

// Redirect to provider checkout
window.location.href = result.checkout.redirectUrl;
```

## Error Handling

```typescript
import { FliinowClient, FliinowError } from '@fliinow-com/fliinow-partner-api';

try {
  const operation = await fliinow.operations.create({ ... });
} catch (error) {
  if (error instanceof FliinowError) {
    console.error(`Error ${error.code}: ${error.message}`);
    
    switch (error.code) {
      case 'INVALID_AMOUNT':
        // Handle validation error
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Handle rate limiting - use error.retryAfter
        break;
      case 'UNAUTHORIZED':
        // Check API key
        break;
    }
  }
}
```

## TypeScript Types

All types are exported for your convenience:

```typescript
import type {
  OperationResponse,
  OperationStatus,
  PlanResponse,
  ClientDto,
  FlightDto,
  HotelDto,
  CreateOperationRequest,
  ListOperationsParams,
  PagedOperationsResponse,
  FinancingProviderInfo,
} from '@fliinow-com/fliinow-partner-api';
```

## Configuration Options

```typescript
const fliinow = new FliinowClient({
  apiKey: 'fk_test_xxxxx',  // Required: Your API key
  sandbox: true,             // Optional: Use sandbox environment (default: false)
  timeout: 30000,            // Optional: Request timeout in ms (default: 30000)
  baseUrl: 'https://...',    // Optional: Custom base URL (overrides sandbox)
});
```

## Environments

| Environment | Base URL | API Key Prefix |
|-------------|----------|----------------|
| Sandbox | `https://demo.fliinow.com/integration-api/v1` | `fk_test_*` |
| Production | `https://app.fliinow.com/integration-api/v1` | `fk_live_*` |

## Documentation

- 📖 [Full Documentation](https://api.docs.fliinow.com)
- 🔧 [API Reference](https://api.docs.fliinow.com/api-reference)
- 🚀 [Integration Guide](https://api.docs.fliinow.com/flow)
- 🎮 [SDK Guide](https://api.docs.fliinow.com/sdk)

## Support

- 📧 Email: partners@fliinow.com
- 🐛 Issues: [GitHub Issues](https://github.com/fliinow/fliinow-partner-api/issues)

## License

MIT © [Fliinow](https://fliinow.com)
