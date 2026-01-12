# @fliinow/fliinow-partner-api

Official TypeScript/JavaScript SDK for the Fliinow Partner API. Easily integrate financing options into your e-commerce platform.

[![npm version](https://badge.fury.io/js/%40fliinow%2Ffliinow-partner-api.svg)](https://www.npmjs.com/package/@fliinow/fliinow-partner-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @fliinow/fliinow-partner-api
# or
yarn add @fliinow/fliinow-partner-api
# or
pnpm add @fliinow/fliinow-partner-api
```

## Quick Start

```typescript
import { FliinowClient } from '@fliinow/fliinow-partner-api';

const fliinow = new FliinowClient({
  apiKey: 'your_api_key',
  environment: 'sandbox' // or 'production'
});

// Create a financing operation
const operation = await fliinow.operations.create({
  amount: 1500.00,
  currency: 'EUR',
  reference: 'ORDER-12345',
  customer: {
    email: 'customer@example.com',
    phone: '+34600000000'
  },
  redirectUrls: {
    success: 'https://yoursite.com/success',
    cancel: 'https://yoursite.com/cancel'
  }
});

// Redirect user to financing checkout
window.location.href = operation.financingUrl;
```

## Features

- ðŸ” **Secure Authentication** - API key-based authentication with environment separation
- ðŸ“¦ **Full TypeScript Support** - Complete type definitions included
- ðŸ”„ **Promise-based API** - Modern async/await interface
- ðŸ›¡ï¸ **Error Handling** - Structured error types for easy debugging
- ðŸŒ **Multi-environment** - Sandbox and production support

## API Reference

### Operations

```typescript
// Create an operation
const operation = await fliinow.operations.create({
  amount: 1500.00,
  currency: 'EUR',
  reference: 'ORDER-12345',
  customer: { email: 'customer@example.com' },
  redirectUrls: {
    success: 'https://yoursite.com/success',
    cancel: 'https://yoursite.com/cancel'
  }
});

// Get operation status
const status = await fliinow.operations.getStatus('op_abc123');

// List operations with filters
const operations = await fliinow.operations.list({
  status: 'approved',
  from: '2024-01-01',
  to: '2024-12-31',
  page: 1,
  limit: 20
});

// Cancel an operation
await fliinow.operations.cancel('op_abc123');
```

### Plans (Advanced Flow)

```typescript
// Get available financing plans
const plans = await fliinow.plans.getAvailable({
  amount: 1500.00,
  currency: 'EUR'
});

// Display plans to user
plans.forEach(plan => {
  console.log(`${plan.provider}: ${plan.installments}x ${plan.monthlyPayment}â‚¬/month`);
});
```

### Financing (Advanced Flow)

```typescript
// Request financing with specific plan
const result = await fliinow.financing.request({
  operationId: 'op_abc123',
  planId: 'plan_xyz789'
});

window.location.href = result.checkoutUrl;
```

## Error Handling

```typescript
import { FliinowClient, FliinowError } from '@fliinow/fliinow-partner-api';

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
        // Handle rate limiting
        break;
      case 'AUTHENTICATION_FAILED':
        // Handle auth error
        break;
    }
  }
}
```

## TypeScript Types

All types are exported for your convenience:

```typescript
import type {
  Operation,
  OperationStatus,
  Plan,
  Customer,
  CreateOperationParams,
  ListOperationsParams,
  PaginatedResponse,
} from '@fliinow/fliinow-partner-api';
```

## Configuration Options

```typescript
const fliinow = new FliinowClient({
  apiKey: 'your_api_key',
  environment: 'sandbox',        // 'sandbox' | 'production'
  timeout: 30000,                // Request timeout in ms (default: 30000)
  retries: 3,                    // Number of retries (default: 3)
  baseUrl: 'https://custom.url'  // Custom base URL (optional)
});
```

## Environments

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox.api.fliinow.com/v1` |
| Production | `https://api.fliinow.com/v1` |

## Documentation

- ðŸ“– [Full API Documentation](https://docs.fliinow.com)
- ðŸ”§ [API Reference](https://docs.fliinow.com/api-reference)
- ðŸš€ [Integration Guide](https://docs.fliinow.com/flow)

## Support

- ðŸ“§ Email: partners@fliinow.com
- ðŸ’¬ Slack: [Fliinow Partners Community](https://fliinow-partners.slack.com)
- ðŸ› Issues: [GitHub Issues](https://github.com/fliinow/fliinow-partner-api/issues)

## License

MIT Â© [Fliinow](https://fliinow.com)
