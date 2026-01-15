/**
 * Fliinow Partner API - TypeScript Client
 * 
 * Official TypeScript/JavaScript SDK for the Fliinow Partner API.
 * 
 * @example
 * ```typescript
 * import { FliinowClient } from '@fliinow-com/fliinow-partner-api';
 * 
 * const client = new FliinowClient({
 *   apiKey: 'fk_test_your_api_key',
 *   sandbox: true,
 * });
 * 
 * const operation = await client.operations.create({
 *   externalId: 'BOOK-001',
 *   client: { ... },
 *   packageName: 'Viaje a París',
 *   packageTravel: true,
 *   travelersNumber: 2,
 *   totalPrice: 1500,
 *   totalReserve: 1500,
 * });
 * 
 * console.log(operation.financingUrl);
 * ```
 * 
 * @packageDocumentation
 */

import type {
  CreateOperationRequest,
  OperationResponse,
  PagedOperationsResponse,
  ListOperationsParams,
  OperationStatusInfo,
  PlanResponse,
  StartFinancingRequest,
  FinancingResponse,
  CancelOperationRequest,
  ErrorResponse,
} from './types';

// Re-export all types
export * from './types';

// ============================================================================
// CLIENT CONFIGURATION
// ============================================================================

/**
 * Configuration options for the Fliinow client.
 */
export interface FliinowClientConfig {
  /**
   * Your Fliinow API key.
   * Sandbox keys start with `fk_test_`, production keys with `fk_live_`.
   */
  apiKey: string;

  /**
   * Use sandbox environment.
   * @default false (production)
   */
  sandbox?: boolean;

  /**
   * Request timeout in milliseconds.
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Custom base URL (for testing).
   * Overrides sandbox setting if provided.
   */
  baseUrl?: string;
}

// ============================================================================
// ERROR CLASS
// ============================================================================

/**
 * Custom error class for Fliinow API errors.
 * Provides structured error information for easier handling.
 */
export class FliinowError extends Error {
  /** HTTP status code */
  public readonly statusCode: number;
  /** Error code from API */
  public readonly code: string;
  /** Request path */
  public readonly path: string;
  /** Request ID for support */
  public readonly requestId?: string;
  /** Retry after (seconds) for rate limiting */
  public readonly retryAfter?: number;

  constructor(response: ErrorResponse, statusCode: number, retryAfter?: number) {
    super(response.message);
    this.name = 'FliinowError';
    this.statusCode = statusCode;
    this.code = response.error;
    this.path = response.path;
    this.requestId = response.requestId;
    this.retryAfter = retryAfter;
  }
}

// ============================================================================
// OPERATIONS API
// ============================================================================

/**
 * Operations API methods.
 */
class OperationsApi {
  constructor(private readonly client: FliinowClient) {}

  /**
   * Create a new financing operation.
   * 
   * @example
   * ```typescript
   * const operation = await client.operations.create({
   *   externalId: 'BOOK-2026-00123',
   *   client: {
   *     firstName: 'Juan',
   *     lastName: 'García',
   *     email: 'juan@email.com',
   *     prefix: '+34',
   *     phone: '612345678',
   *     documentId: '12345678A',
   *     documentValidityDate: '31-12-2030',
   *     gender: 'MALE',
   *     birthDate: '15-03-1985',
   *     nationality: 'ESP',
   *     address: 'Calle Mayor 1',
   *     city: 'Madrid',
   *     postalCode: '28001',
   *     countryCode: 'ES',
   *   },
   *   packageName: 'Viaje a París',
   *   packageTravel: true,
   *   travelersNumber: 2,
   *   flightDtoList: [],
   *   hotelDtoList: [],
   *   totalPrice: 1500,
   *   totalReserve: 1500,
   * });
   * 
   * // Redirect customer to financing page
   * window.location.href = operation.financingUrl;
   * ```
   */
  async create(request: CreateOperationRequest): Promise<OperationResponse> {
    return this.client.request<OperationResponse>('POST', '/operations', request);
  }

  /**
   * Get an operation by ID.
   * 
   * @example
   * ```typescript
   * const operation = await client.operations.get('abc123');
   * console.log(operation.status); // "GENERATED"
   * ```
   */
  async get(operationId: string): Promise<OperationResponse> {
    return this.client.request<OperationResponse>('GET', `/operations/${operationId}`);
  }

  /**
   * List operations with optional filters.
   * 
   * @example
   * ```typescript
   * const { content, totalElements } = await client.operations.list({
   *   status: 'FAVORABLE',
   *   from: '2026-01-01',
   *   page: 0,
   *   size: 20,
   * });
   * 
   * for (const op of content) {
   *   console.log(`${op.id}: ${op.status}`);
   * }
   * ```
   */
  async list(params?: ListOperationsParams): Promise<PagedOperationsResponse> {
    const query = params ? this.buildQueryString(params) : '';
    return this.client.request<PagedOperationsResponse>('GET', `/operations${query}`);
  }

  /**
   * Get operation status (lightweight endpoint for polling).
   * 
   * @example
   * ```typescript
   * const status = await client.operations.getStatus('abc123');
   * 
   * if (status.status === 'FAVORABLE') {
   *   console.log('Financing approved!');
   * }
   * ```
   */
  async getStatus(operationId: string): Promise<OperationStatusInfo> {
    return this.client.request<OperationStatusInfo>('GET', `/operations/${operationId}/status`);
  }

  /**
   * Get available financing plans for an operation.
   * Use this for the Advanced Flow when you want to display plans
   * on your own website.
   * 
   * @example
   * ```typescript
   * const plans = await client.operations.getPlans('abc123');
   * 
   * for (const plan of plans) {
   *   console.log(`${plan.installments} cuotas: ${plan.commonQuota.amount}€/mes`);
   *   console.log(`  APR: ${plan.apr}%`);
   * }
   * ```
   */
  async getPlans(operationId: string): Promise<PlanResponse[]> {
    return this.client.request<PlanResponse[]>('GET', `/operations/${operationId}/plans`);
  }

  /**
   * Start financing with a selected plan (Advanced Flow).
   * Returns a checkout URL to redirect the customer.
   * 
   * @example
   * ```typescript
   * const result = await client.operations.startFinancing('abc123', {
   *   financialProviderId: 1,  // 1=Oney, 2=Pepper, 3=Cofidis
   *   installments: 6,
   *   successCallbackUrl: 'https://yoursite.com/success',
   *   errorCallbackUrl: 'https://yoursite.com/error',
   * });
   * 
   * // Redirect customer to provider checkout
   * window.location.href = result.checkout.redirectUrl;
   * ```
   */
  async startFinancing(
    operationId: string, 
    request: StartFinancingRequest
  ): Promise<FinancingResponse> {
    return this.client.request<FinancingResponse>(
      'POST', 
      `/operations/${operationId}/financing`, 
      request
    );
  }

  /**
   * Cancel an operation.
   * Only operations in GENERATED or PENDING status can be cancelled.
   * 
   * @example
   * ```typescript
   * await client.operations.cancel('abc123', {
   *   reason: 'Customer requested cancellation',
   * });
   * ```
   */
  async cancel(operationId: string, request?: CancelOperationRequest): Promise<void> {
    await this.client.request<void>('POST', `/operations/${operationId}/cancel`, request);
  }

  private buildQueryString(params: ListOperationsParams): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

// ============================================================================
// MAIN CLIENT
// ============================================================================

/**
 * Fliinow Partner API Client.
 * 
 * @example
 * ```typescript
 * import { FliinowClient } from '@fliinow-com/fliinow-partner-api';
 * 
 * // Initialize with sandbox environment
 * const client = new FliinowClient({
 *   apiKey: 'fk_test_your_api_key',
 *   sandbox: true,
 * });
 * 
 * // Create an operation
 * const operation = await client.operations.create({ ... });
 * 
 * // Redirect customer
 * window.location.href = operation.financingUrl;
 * ```
 */
export class FliinowClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  /** Operations API */
  public readonly operations: OperationsApi;

  constructor(config: FliinowClientConfig) {
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;

    // Determine base URL
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    } else if (config.sandbox) {
      this.baseUrl = 'https://demo.fliinow.com/integration-api/v1';
    } else {
      this.baseUrl = 'https://app.fliinow.com/integration-api/v1';
    }

    // Initialize API modules
    this.operations = new OperationsApi(this);
  }

  /**
   * Make an HTTP request to the API.
   * @internal
   */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    
    const headers: Record<string, string> = {
      'X-Fliinow-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle no-content responses
      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();

      // Handle errors
      if (!response.ok) {
        const retryAfter = response.headers.get('Retry-After');
        throw new FliinowError(
          data as ErrorResponse,
          response.status,
          retryAfter ? parseInt(retryAfter, 10) : undefined
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof FliinowError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }
}

// Default export
export default FliinowClient;
