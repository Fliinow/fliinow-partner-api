/**
 * Fliinow Partner API - TypeScript Types
 * Generated from backend DTOs: 2026-01-13
 * 
 * @packageDocumentation
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Operation status values.
 * Maps to: com.fliinow.entities.enums.OperationStatus
 */
export type OperationStatus =
  | 'GENERATED'
  | 'PENDING'
  | 'CLIENT_REQUESTED'
  | 'PENDING_RESPONSE'
  | 'FAVORABLE'
  | 'CONFIRMED'
  | 'REFUSED'
  | 'FINISHED'
  | 'EXPIRED'
  | 'ERROR';

/**
 * Flight type options.
 * Maps to: com.fliinow.dto.enums.FlightTypeDto
 */
export type FlightType = 'ONE_WAY' | 'ROUND_TRIP';

/**
 * Gender options for client.
 */
export type Gender = 'MALE' | 'FEMALE';

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Monetary amount with currency.
 * Maps to: com.fliinow.dto.partner.Money
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217, default "EUR"
}

/**
 * Financing provider information.
 * Maps to: com.fliinow.dto.partner.FinancingProviderInfo
 */
export interface FinancingProviderInfo {
  id: number;
  name: string;
}

// ============================================================================
// CLIENT DTO
// ============================================================================

/**
 * Client data for creating operations.
 * Maps to: com.fliinow.dto.ClientDto
 * 
 * All fields are required for operation creation.
 * Date format: "dd-MM-yyyy"
 */
export interface ClientDto {
  /** Client's first name */
  firstName: string;
  /** Client's last name(s) */
  lastName: string;
  /** Email address */
  email: string;
  /** Phone prefix in E.164 format (e.g., "+34") */
  prefix: string;
  /** Phone number without prefix */
  phone: string;
  /** Document ID (DNI/NIE/Passport) */
  documentId: string;
  /** Document validity date (dd-MM-yyyy) */
  documentValidityDate: string;
  /** Gender: "MALE" or "FEMALE" */
  gender: Gender;
  /** Birth date (dd-MM-yyyy) */
  birthDate: string;
  /** Nationality code (ISO 3166-1 alpha-3, e.g., "ESP") */
  nationality: string;
  /** Street address */
  address: string;
  /** City name */
  city: string;
  /** Postal code */
  postalCode: string;
  /** Country code (ISO 3166-1 alpha-2, e.g., "ES") */
  countryCode: string;
}

// ============================================================================
// FLIGHT DTO
// ============================================================================

/**
 * Passenger information for flights.
 * Maps to: com.fliinow.dto.PassengerDto
 */
export interface PassengerDto {
  firstName: string;
  lastName: string;
  birthDate: string; // dd-MM-yyyy
  documentId?: string;
  email?: string;
  phone?: string;
}

/**
 * Individual flight segment (leg).
 * Maps to: com.fliinow.dto.FlightSegmentDto
 */
export interface FlightSegmentDto {
  /** Flight number (e.g., "IB1234") */
  flightNumber: string;
  /** Airline IATA code (e.g., "IB") */
  airlineCode: string;
  /** Origin airport IATA code (e.g., "MAD") */
  originAirport: string;
  /** Destination airport IATA code (e.g., "CDG") */
  destinationAirport: string;
  /** Departure date and time (ISO 8601) */
  departureDateTime: string;
  /** Arrival date and time (ISO 8601) */
  arrivalDateTime: string;
}

/**
 * Flight booking information.
 * Maps to: com.fliinow.dto.FlightDto
 * 
 * All fields except isRefundable are required when including flights.
 */
export interface FlightDto {
  /** Origin airport IATA code */
  origin: string;
  /** Destination airport IATA code */
  destination: string;
  /** Flight type: ONE_WAY or ROUND_TRIP */
  flightType: FlightType;
  /** Start date (dd-MM-yyyy) */
  startDate: string;
  /** End date (dd-MM-yyyy) */
  endDate: string;
  /** Total price for this flight */
  price: number;
  /** Whether the flight is refundable */
  isRefundable?: boolean;
  /** List of passengers */
  passengerList: PassengerDto[];
  /** Flight segments/legs (at least 1 required) */
  segments: FlightSegmentDto[];
}

// ============================================================================
// HOTEL DTO
// ============================================================================

/**
 * Hotel booking information.
 * Maps to: com.fliinow.dto.HotelDto
 * 
 * All fields are required when including hotels.
 */
export interface HotelDto {
  /** Hotel name */
  hotelName: string;
  /** Street address */
  address: string;
  /** Postal code */
  postalCode: string;
  /** City name */
  city: string;
  /** Country name */
  country: string;
  /** Number of guests */
  guestsNumber: number;
  /** Check-in date (dd-MM-yyyy) */
  checkInDate: string;
  /** Check-out date (dd-MM-yyyy) */
  checkOutDate: string;
  /** Whether the booking is refundable */
  isRefundable: boolean;
  /** Total price for the hotel stay */
  price: number;
}

// ============================================================================
// SERVICE DTO
// ============================================================================

/**
 * Additional service (transfers, insurance, etc).
 * Maps to: com.fliinow.dto.ServiceDto
 */
export interface ServiceDto {
  /** Service name/description */
  serviceName: string;
  /** Service price */
  price: number;
  /** Service date (dd-MM-yyyy) */
  serviceDate?: string;
}

// ============================================================================
// FEE DTO
// ============================================================================

/**
 * Fee applied to the operation.
 * Maps to: com.fliinow.dto.FeeDto
 */
export interface FeeDto {
  /** Fee description */
  description: string;
  /** Fee amount */
  amount: number;
}

// ============================================================================
// OPERATION REQUEST/RESPONSE
// ============================================================================

/**
 * Request to create a new operation.
 * Maps to: com.fliinow.dto.partner.PartnerCreateOperationRequest
 */
export interface CreateOperationRequest {
  /** External ID from your system for correlation */
  externalId: string;
  /** Client data */
  client: ClientDto;
  /** Package/booking name */
  packageName: string;
  /** Whether this is a travel package (EU Package Travel Directive) */
  packageTravel: boolean;
  /** Number of travelers */
  travelersNumber: number;
  /** List of flights (optional) */
  flightDtoList?: FlightDto[];
  /** List of hotels (optional) */
  hotelDtoList?: HotelDto[];
  /** List of services (optional) */
  serviceDtoList?: ServiceDto[];
  /** List of fees (optional) */
  feeDtoList?: FeeDto[];
  /** Base price without fees */
  totalPrice: number;
  /** Total price including fees */
  totalReserve: number;
}

/**
 * Operation response from the API.
 * Maps to: com.fliinow.dto.partner.PartnerOperationResponse
 */
export interface OperationResponse {
  /** Fliinow operation ID */
  id: string;
  /** Client ID */
  clientId: number;
  /** Your external ID */
  externalId: string;
  /** Current status */
  status: OperationStatus;
  /** Creation date (YYYY-MM-DD) */
  creationDate: string;
  /** Number of travelers */
  travelersNumber: number;
  /** Base price */
  totalPrice: Money;
  /** Management fees */
  managementFees: Money | null;
  /** Total reserved amount */
  totalReserve: Money;
  /** Amount financed */
  totalFinanced: Money | null;
  /** Interest amount */
  interestAmount: Money | null;
  /** Number of installments */
  paymentTerms: number | null;
  /** Financing provider info */
  financingProvider: FinancingProviderInfo | null;
  /** URL to redirect customer for financing */
  financingUrl: string;
  /** Whether this is a package travel */
  isPackage: boolean;
  /** Package name */
  packageName: string;
  /** Flight details (if included) */
  flights: FlightDto[] | null;
  /** Hotel details (if included) */
  hotels: HotelDto[] | null;
  /** Service details (if included) */
  services: ServiceDto[] | null;
  /** Fees applied */
  operationFees: FeeDto[] | null;
}

// ============================================================================
// PAGINATED OPERATIONS
// ============================================================================

/**
 * Paginated list of operations.
 * Maps to: com.fliinow.dto.partner.PagedOperationsResponse
 */
export interface PagedOperationsResponse {
  /** List of operations */
  content: OperationResponse[];
  /** Current page (0-based) */
  page: number;
  /** Page size */
  size: number;
  /** Total elements */
  totalElements: number;
  /** Total pages */
  totalPages: number;
}

/**
 * Parameters for listing operations.
 */
export interface ListOperationsParams {
  /** Filter by status */
  status?: OperationStatus;
  /** Filter by start date (YYYY-MM-DD) */
  from?: string;
  /** Filter by end date (YYYY-MM-DD) */
  to?: string;
  /** Page number (0-based) */
  page?: number;
  /** Page size (default 50) */
  size?: number;
}

// ============================================================================
// OPERATION STATUS
// ============================================================================

/**
 * Lightweight status response.
 * Maps to: com.fliinow.dto.partner.OperationStatusInfo
 */
export interface OperationStatusInfo {
  /** Operation ID */
  operationId: string;
  /** Current status */
  status: OperationStatus;
  /** Last update timestamp (ISO 8601) */
  updatedAt: string;
}

// ============================================================================
// FINANCING PLANS
// ============================================================================

/**
 * Available financing plan.
 * Maps to: com.fliinow.dto.partner.PlanResponse
 */
export interface PlanResponse {
  /** Plan ID (format: {providerId}_{installments}) */
  id: string;
  /** Financing provider info */
  financingProvider: FinancingProviderInfo;
  /** Number of installments */
  installments: number;
  /** Minimum financing amount */
  minFinancingAmount: Money;
  /** Maximum financing amount */
  maxFinancingAmount: Money;
  /** Regular installment amount */
  commonQuota: Money;
  /** Differential quota (first or last) */
  differentialQuota: Money;
  /** Total interest to pay */
  totalInterestPaid: Money;
  /** Total amount to pay */
  totalAmountPaid: Money;
  /** Annual Percentage Rate (APR) */
  apr: number;
  /** Whether differential quota is first */
  differentialIsFirst: boolean;
}

// ============================================================================
// START FINANCING
// ============================================================================

/**
 * Request to start financing.
 * Maps to: com.fliinow.dto.partner.PartnerStartFinancingRequest
 */
export interface StartFinancingRequest {
  /** Financial provider ID (1=Oney, 2=Pepper, 3=Cofidis) */
  financialProviderId: number;
  /** Number of installments */
  installments: number;
  /** URL for successful financing */
  successCallbackUrl: string;
  /** URL for error/cancellation */
  errorCallbackUrl: string;
}

/**
 * Response from starting financing.
 * Maps to: com.fliinow.dto.partner.PartnerFinancingResponse
 */
export interface FinancingResponse {
  /** Financing/operation ID */
  financingId: string;
  /** Current status */
  status: OperationStatus;
  /** Checkout information */
  checkout: {
    /** URL to redirect customer */
    redirectUrl: string;
    /** When the checkout session expires */
    expirationDateTime: string;
  };
}

// ============================================================================
// CANCEL OPERATION
// ============================================================================

/**
 * Request to cancel an operation.
 */
export interface CancelOperationRequest {
  /** Reason for cancellation (optional) */
  reason?: string;
}

// ============================================================================
// ERROR RESPONSE
// ============================================================================

/**
 * API error response.
 * Maps to: com.fliinow.dto.partner.PartnerErrorResponse
 */
export interface ErrorResponse {
  /** Error code */
  error: string;
  /** Human-readable message */
  message: string;
  /** Timestamp (ISO 8601) */
  timestamp: string;
  /** Request path */
  path: string;
  /** Request ID for support */
  requestId?: string;
}
