# PHPTRAVELS Flight Booking Test Data

**Source cases:** [phptravels-flight-booking-test-cases.md](phptravels-flight-booking-test-cases.md)  
**Application:** https://phptravels.net/  
**Prepared:** 2026-09-08

## Usage Rules

- Use synthetic identities and test-only email addresses.
- Use only approved sandbox payment fixtures. Never use real card numbers, CVV values, passwords, API keys, or personal information.
- Resolve airport/city names against the live demo or a seeded supplier fixture before execution; supplier inventory is dynamic.
- Generate normal booking dates at runtime so the data remains valid after this document is reused.
- Keep security payloads in an isolated security suite and never use them against production systems.
- Replace every `${...}` placeholder through the test fixture layer before running a test.

## Reusable Fixture Model

```typescript
export type FlightSearchData = {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabin?: string;
};

export type PassengerData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phone: string;
};
```

## Valid Flight Search Data

### Valid routes

| Data ID | Departure | Arrival | Use |
|---|---|---|---|
| FLIGHT-VALID-001 | London | Paris | Primary valid route; confirm availability before use |
| FLIGHT-VALID-002 | Dubai | New York | Long-haul route and timezone coverage |
| FLIGHT-VALID-003 | Singapore | Tokyo | International-character and timezone-compatible route |
| FLIGHT-VALID-004 | New York | Los Angeles | Domestic-style route and time comparison |
| FLIGHT-VALID-005 | Paris | Dubai | Reverse-route and multi-currency coverage |

```typescript
export const validFlightSearch = {
  primary: {
    departureCity: 'London',
    arrivalCity: 'Paris',
    departureDate: '${tomorrow:YYYY-MM-DD}',
    returnDate: '${dayAfterTomorrow:YYYY-MM-DD}',
    passengers: 1,
    cabin: 'Economy'
  },
  multiPassenger: {
    departureCity: 'Dubai',
    arrivalCity: 'New York',
    departureDate: '${plusDays:14:YYYY-MM-DD}',
    returnDate: '${plusDays:21:YYYY-MM-DD}',
    passengers: 4,
    cabin: 'Economy'
  },
  comparison: {
    departureCity: 'New York',
    arrivalCity: 'Los Angeles',
    departureDate: '${plusDays:30:YYYY-MM-DD}',
    passengers: 2,
    cabin: 'Economy'
  }
};
```

`${...}` values are runtime expressions, not literal values. Use the test framework's date helper to resolve them.

## Date Data

| Data ID | Value or generator | Intended use | Expected classification |
|---|---|---|---|
| DATE-001 | `${tomorrow:YYYY-MM-DD}` | Standard valid departure date | Valid |
| DATE-002 | `${dayAfterTomorrow:YYYY-MM-DD}` | Standard valid return date | Valid |
| DATE-003 | `${today:YYYY-MM-DD}` | Same-day boundary | Business-rule dependent |
| DATE-004 | `${yesterday:YYYY-MM-DD}` | Past departure date | Invalid |
| DATE-005 | Departure date equal to return date | Same-day journey | Business-rule dependent |
| DATE-006 | Return date one day after departure | Minimum one-day interval | Valid if supported |
| DATE-007 | `${monthEnd:YYYY-MM-DD}` | Month-end handling | Boundary |
| DATE-008 | `${yearEnd:YYYY-MM-DD}` | Year-end handling | Boundary |
| DATE-009 | `2028-02-29` | Leap-day handling | Boundary |
| DATE-010 | `${plusDays:365:YYYY-MM-DD}` | Maximum supported future range | Boundary |
| DATE-011 | `${plusDays:366:YYYY-MM-DD}` | One day beyond maximum range | Invalid if 365-day limit applies |
| DATE-012 | `${dstTransitionDate}` | Daylight-saving transition | Boundary |
| DATE-013 | `${unavailableSupplierDate:YYYY-MM-DD}` | Known unavailable date from fixture | No results |

For date assertions, compare parsed calendar dates in the intended airport timezone. Do not compare display strings alone.

## Passenger Count Data

| Data ID | Passengers | Intended use | Expected classification |
|---|---:|---|---|
| PASSENGER-001 | 1 | Minimum valid count | Valid |
| PASSENGER-002 | 2 | Standard comparison case | Valid |
| PASSENGER-003 | 4 | Multi-passenger booking | Valid |
| PASSENGER-004 | `${configuredMaximumPassengers}` | Configured maximum | Boundary |
| PASSENGER-005 | 0 | Zero passengers | Invalid |
| PASSENGER-006 | -1 | Negative passengers | Invalid |
| PASSENGER-007 | `1.5` | Decimal passengers | Invalid |
| PASSENGER-008 | `abc` | Alphabetic input | Invalid |
| PASSENGER-009 | `${configuredMaximumPassengers + 1}` | Above configured maximum | Invalid |
| PASSENGER-010 | `999999999999` | Oversized numeric input | Invalid/security boundary |

## Passenger and Contact Data

### Valid synthetic passengers

| Data ID | First name | Last name | Date of birth | Nationality | Email | Phone |
|---|---|---|---|---|---|---|
| PASSENGER-VALID-001 | Amina | Carter | 1990-04-15 | United Kingdom | `phptravels.flight.001@example.test` | `+447700900001` |
| PASSENGER-VALID-002 | Mateo | Silva | 1985-11-22 | Spain | `phptravels.flight.002@example.test` | `+34600000002` |
| PASSENGER-VALID-003 | Hana | Nakamura | 1995-02-28 | Japan | `phptravels.flight.003@example.test` | `+819000000003` |
| PASSENGER-VALID-004 | Zoe | O'Connor | 1988-07-09 | Ireland | `phptravels.flight.004@example.test` | `+353850000004` |

```typescript
export const validPassengers = [
  {
    firstName: 'Amina',
    lastName: 'Carter',
    dateOfBirth: '1990-04-15',
    nationality: 'United Kingdom',
    email: 'phptravels.flight.001@example.test',
    phone: '+447700900001'
  },
  {
    firstName: 'Mateo',
    lastName: 'Silva',
    dateOfBirth: '1985-11-22',
    nationality: 'Spain',
    email: 'phptravels.flight.002@example.test',
    phone: '+34600000002'
  }
];
```

### Name boundary and special-character data

| Data ID | Value | Intended use | Expected classification |
|---|---|---|---|
| NAME-001 | `O'Connor` | Apostrophe support | Valid |
| NAME-002 | `Jean-Luc` | Hyphen support | Valid |
| NAME-003 | `José` | Accented Latin character | Valid if supported |
| NAME-004 | `Müller` | Umlaut support | Valid if supported |
| NAME-005 | `李` | CJK character support | Valid if supported |
| NAME-006 | `Αλέξανδρος` | Greek character support | Valid if supported |
| NAME-007 | `A` | Minimum-length name | Boundary |
| NAME-008 | `${repeat:A:256}` | Overlength name | Invalid |
| NAME-009 | `12345` | Numeric-only name | Invalid unless explicitly supported |
| NAME-010 | `   ` | Whitespace-only name | Invalid |
| NAME-011 | `<script>alert(1)</script>` | XSS input | Reject or safely encode |
| NAME-012 | `' OR '1'='1` | Injection-like input | Reject or safely encode |

### Email data

| Data ID | Value | Intended use | Expected classification |
|---|---|---|---|
| EMAIL-001 | `phptravels.flight.001@example.test` | Normal valid email | Valid |
| EMAIL-002 | `qa+flight.002@example.test` | Plus addressing | Valid if supported |
| EMAIL-003 | `traveler.name@example.co.uk` | Multi-part domain | Valid |
| EMAIL-004 | `用户@example.test` | Internationalized local part | Valid if supported |
| EMAIL-005 | `` | Blank email | Invalid |
| EMAIL-006 | `plainaddress` | Missing @ and domain | Invalid |
| EMAIL-007 | `traveler@@example.test` | Duplicate @ | Invalid |
| EMAIL-008 | `traveler@` | Missing domain | Invalid |
| EMAIL-009 | `@example.test` | Missing local part | Invalid |
| EMAIL-010 | `traveler name@example.test` | Unescaped space | Invalid |
| EMAIL-011 | `${repeat:a:250}@example.test` | Overlength local part | Invalid or boundary |
| EMAIL-012 | `traveler@example..test` | Invalid domain structure | Invalid |
| EMAIL-013 | `phptravels.flight.001@example.test` | Duplicate registration/booking contact | Duplicate-data case |

### Phone data

| Data ID | Value | Intended use | Expected classification |
|---|---|---|---|
| PHONE-001 | `+447700900001` | Valid international phone | Valid |
| PHONE-002 | `+12025550123` | Valid NANP-style phone | Valid if supported |
| PHONE-003 | `00447700900001` | International prefix alternative | Valid if supported |
| PHONE-004 | `` | Blank phone | Invalid if required |
| PHONE-005 | `123` | Too short | Invalid |
| PHONE-006 | `+44 ABC 900001` | Alphabetic characters | Invalid |
| PHONE-007 | `${repeat:9:100}` | Overlength phone | Invalid |

## Duplicate and Idempotency Data

| Data ID | Duplicate action | Expected result |
|---|---|---|
| DUP-001 | Submit the same valid search twice quickly | No corrupted search state; repeated results are consistent. |
| DUP-002 | Double-click Pay Now | At most one booking is created. |
| DUP-003 | Replay the same payment callback | The second callback does not create or alter a second booking. |
| DUP-004 | Register/use the same synthetic email twice where account creation is involved | Duplicate identity is rejected or handled by the documented rule. |
| DUP-005 | Open the same flight in two tabs and continue both | Each tab retains the correct route/selection or reports stale context. |
| DUP-006 | Refresh during payment processing | No duplicate booking and no false success state. |

## Optional Extras Data

| Data ID | Extra | Test action | Expected result |
|---|---|---|---|
| EXTRA-001 | Hotel | Add to flight review | Extra attaches to the flight booking and total increases correctly. |
| EXTRA-002 | Car | Add to flight review | Extra attaches to the flight booking and total increases correctly. |
| EXTRA-003 | Travel insurance | Add to flight review | Extra attaches to the flight booking and total increases correctly. |
| EXTRA-004 | Each supported extra | Remove after adding | Extra is removed and flight-only total is restored. |
| EXTRA-005 | Two supported extras | Add both, then remove one | Remaining extra stays attached and total recalculates correctly. |

## Result and Price Data

Use these as data-shape expectations, not fixed production values:

| Data ID | Value/shape | Intended use |
|---|---|---|
| PRICE-001 | Positive amount with two decimal places | Standard result/review price |
| PRICE-002 | Zero amount | Free/invalid-price handling; only valid if supplier supports it |
| PRICE-003 | Very low positive amount | Lowest-price sorting |
| PRICE-004 | High positive amount | Highest-price sorting |
| PRICE-005 | Discounted amount with original amount | Discount display and calculation |
| PRICE-006 | Tax-inclusive total | Review/checkout consistency |
| PRICE-007 | Tax-exclusive base plus tax/fees | Fee breakdown validation |
| PRICE-008 | Currency changed from USD to EUR/GBP | Currency label and conversion behavior |
| PRICE-009 | Supplier price changed between result and checkout | Stale-price acknowledgement |
| PRICE-010 | Missing, null, negative, or malformed supplier price | Controlled integration error; never silently book |

Do not hard-code expected prices unless a supplier fixture supplies the exact amount and currency.

## Payment Fixture Placeholders

Use the payment provider's documented sandbox values. The following identifiers are test-data roles, not real card values:

| Data ID | Fixture role | Expected result |
|---|---|---|
| PAYMENT-001 | `sandbox.success` | Authorization succeeds and one booking is created. |
| PAYMENT-002 | `sandbox.decline` | Payment fails; no successful booking is created. |
| PAYMENT-003 | `sandbox.expired` | Expired-payment response is shown; retry is safe. |
| PAYMENT-004 | `sandbox.malformed` | Input is rejected without exposing payment details. |
| PAYMENT-005 | `sandbox.cancelled` | Cancellation is distinct from success. |
| PAYMENT-006 | `sandbox.timeout` | Timeout is controlled and retry is idempotent. |
| PAYMENT-007 | `sandbox.pending` | Pending state is shown distinctly and reconciled later. |
| PAYMENT-008 | `sandbox.duplicate-callback` | Duplicate callback does not create a duplicate booking. |

Never replace these roles with real payment credentials. Store provider-specific values in a secure test environment variable or secret manager.

## Supplier and Service-Response Fixtures

| Data ID | Fixture role | Expected result |
|---|---|---|
| SUPPLIER-001 | Multiple valid flight results | Results support price/time comparison. |
| SUPPLIER-002 | One valid flight result | Single result displays and can be selected. |
| SUPPLIER-003 | Empty result set | Clear no-results state with retry/modify action. |
| SUPPLIER-004 | Slow response | Loading state remains controlled and actionable. |
| SUPPLIER-005 | Timeout | Controlled error state; no partial confirmation. |
| SUPPLIER-006 | Partial/malformed response | Invalid records are rejected or safely handled. |
| SUPPLIER-007 | Price changed after selection | User is informed and must acknowledge the change. |
| SUPPLIER-008 | Availability changed after selection | User is informed and cannot silently book unavailable inventory. |
| SUPPLIER-009 | Invalid payment callback | Booking state is unchanged. |
| SUPPLIER-010 | Valid payment callback | Booking state changes exactly once. |

## Security Test Inputs

These values are for authorized test environments only:

| Data ID | Input | Target fields | Expected result |
|---|---|---|---|
| SEC-001 | `<script>alert('x')</script>` | Route, passenger name, contact fields | Safely encoded/rejected; no script execution. |
| SEC-002 | `"><img src=x onerror=alert(1)>` | Text fields | Safely encoded/rejected; no event execution. |
| SEC-003 | `' OR '1'='1` | Route/search fields | No query manipulation or unauthorized data. |
| SEC-004 | `../../../../etc/passwd` | Any path-like field | No file disclosure or path traversal. |
| SEC-005 | `javascript:alert(1)` | URL/redirect-capable input | No unsafe redirect or script execution. |
| SEC-006 | `${modifiedPrice}` | Price/request payload | Server rejects client-modified price. |
| SEC-007 | `${otherUserBookingId}` | Booking identifier | Unauthorized access is denied. |
| SEC-008 | `${missingCsrfToken}` | State-changing request | Request is rejected and no booking/state change occurs. |
| SEC-009 | `${alteredPaymentCallbackSignature}` | Payment callback | Callback is rejected and booking state remains unchanged. |
| SEC-010 | `${replayedPaymentCallback}` | Payment callback | Duplicate callback is ignored/rejected idempotently. |

## Accessibility and Responsive Data Matrix

| Data ID | Test value | Viewports/technology |
|---|---|---|
| A11Y-001 | Keyboard-only navigation | Desktop 1440x900 |
| A11Y-002 | Keyboard-only navigation | Mobile 390x844 |
| A11Y-003 | Screen-reader accessibility tree | Desktop Chromium |
| A11Y-004 | 200% browser zoom | Desktop 1280x800 |
| A11Y-005 | Reduced-motion preference | Desktop and mobile |
| A11Y-006 | High text length in route/error labels | Mobile 320px width |
| A11Y-007 | Portrait orientation | 390x844 |
| A11Y-008 | Landscape orientation | 844x390 |
| A11Y-009 | Tablet layout | 768x1024 |
| A11Y-010 | Desktop layout | 1440x900 |

Expected behavior: controls, errors, prices, filters, and payment actions remain visible and usable; focus is visible; accessible names and labels are present; dynamic loading, no-results, price-change, payment-failure, and confirmation states are announced.

## Localization Data

| Data ID | Locale/currency | Expected use |
|---|---|---|
| LOC-001 | `en-US` / `USD` | Default or baseline locale |
| LOC-002 | `en-GB` / `GBP` | Currency and date-format comparison |
| LOC-003 | `fr-FR` / `EUR` | Translated labels and euro formatting |
| LOC-004 | `ja-JP` / `JPY` | Non-decimal currency formatting where supported |
| LOC-005 | `ar-AE` / `AED` | Right-to-left/localized content where supported |
| LOC-006 | Unsupported locale | Controlled fallback behavior |

Do not assume every locale or currency is enabled in the demo. Discover supported options at runtime and record the selected value.

## Email and Booking Reference Data

| Data ID | Value | Intended use |
|---|---|---|
| EMAIL-TEST-001 | `phptravels.flight.confirmation.001@example.test` | Successful confirmation recipient |
| EMAIL-TEST-002 | `phptravels.flight.failure.002@example.test` | Failure/retry recipient |
| EMAIL-TEST-003 | `phptravels.flight.pending.003@example.test` | Pending-payment recipient |
| REF-001 | `${bookingReferenceFromConfirmation}` | Confirmation-page/email comparison |
| REF-002 | `${unknownBookingReference}` | Invalid booking lookup/access control |
| REF-003 | `${otherUserBookingReference}` | IDOR/BOLA authorization test |

## Data-to-Test-Case Mapping

| Test cases | Primary data sets |
|---|---|
| FBC-001 to FBC-007 | FLIGHT-VALID, DATE, PASSENGER, and validation data |
| FBC-008 to FBC-014 | SUPPLIER, PRICE, valid routes, adjacent-date data |
| FBC-015 to FBC-020 | Passenger, email, phone, EXTRA, and terms data |
| FBC-021 to FBC-026 | PAYMENT, valid passenger, EMAIL-TEST, and REF data |
| FBC-027 to FBC-033 | SEC, SUPPLIER, DUP, PRICE, and payment-callback data |
| FBC-034 to FBC-038 | A11Y and LOC data plus valid flight fixtures |

## Environment Variables and Secrets

The following names may be used by automated tests, but their values must be supplied outside source control:

```text
PHPTRAVELS_BASE_URL=https://phptravels.net/
FLIGHT_DEPARTURE_CITY=<fixture-supported-city>
FLIGHT_ARRIVAL_CITY=<fixture-supported-city>
PAYMENT_SUCCESS_FIXTURE=sandbox.success
PAYMENT_DECLINE_FIXTURE=sandbox.decline
PAYMENT_TIMEOUT_FIXTURE=sandbox.timeout
PAYMENT_PENDING_FIXTURE=sandbox.pending
TEST_MAILBOX_ADDRESS=<synthetic-test-mailbox>
SUPPLIER_FIXTURE_PROFILE=<approved-flight-fixture>
```
