# PHPTRAVELS Flight Booking Test Plan

## Application Overview

A focused test plan for the PHPTRAVELS demo flight-booking journey, derived only from the flight-related requirements in documents/phptravels-requirement-analysis.md. The scope covers flight service navigation, route/date/passenger search, result comparison and filtering, flight detail inspection, selection and review, optional extras, passenger checkout, sandbox payment, confirmation, validation, supplier/payment integration behavior, security, accessibility, localization, responsive behavior, and demo-environment constraints. Hotel-only functionality, visa-only functionality, and unrelated account-registration behavior are excluded except where authentication or shared checkout behavior directly affects flight booking.

## Test Scenarios

### 1. Flight Service Entry and Search

**Seed:** `tests/seed.spec.ts`

#### 1.1. Open the Flights service

**File:** `tests/ui/flight-booking/open-flights-service.spec.ts`

**Steps:**
  1. Open https://phptravels.net/.
    - expect: The PHPTRAVELS home page loads over HTTPS without a blocking error.
  2. Open the Services menu and select Flights.
    - expect: The Flights booking page opens and presents departure city, arrival city, travel date, and passenger-count controls.

#### 1.2. Search with valid flight criteria

**File:** `tests/ui/flight-booking/search-valid-flight.spec.ts`

**Steps:**
  1. Enter valid departure and arrival cities from the available test data.
    - expect: Both route fields accept and retain the selected cities.
  2. Enter valid future travel dates and a supported passenger count.
    - expect: The dates and passenger count are displayed correctly.
  3. Submit the search.
    - expect: Flight results load, or a controlled no-results state is displayed if the supplier has no inventory. The submitted route, dates, and passenger count are preserved.

#### 1.3. Validate required flight search fields

**File:** `tests/ui/flight-booking/search-required-fields.spec.ts`

**Steps:**
  1. Submit the flight search with departure city blank.
    - expect: The search is blocked and a clear validation message identifies the missing departure city.
  2. Repeat with arrival city blank, travel date blank, and passenger count blank.
    - expect: Each missing required field is identified without a server error or misleading results.

#### 1.4. Reject invalid route and passenger values

**File:** `tests/ui/flight-booking/search-invalid-values.spec.ts`

**Steps:**
  1. Enter the same city for departure and arrival when the product disallows it.
    - expect: The route is rejected with a clear validation message.
  2. Enter zero, negative, non-numeric, and above-limit passenger counts.
    - expect: Invalid values are rejected and supported minimum/maximum limits are enforced.

#### 1.5. Validate flight date boundaries

**File:** `tests/ui/flight-booking/search-date-boundaries.spec.ts`

**Steps:**
  1. Try a past date, an unavailable date range, and a date outside the supported booking window.
    - expect: Unsupported dates are prevented or produce clear validation.
  2. Try a same-day route, month-end date, leap-day date, year-end date, and daylight-saving transition date where applicable.
    - expect: Date handling follows the documented business rules and does not shift dates because of timezone conversion.

#### 1.6. Handle unknown or unavailable routes

**File:** `tests/ui/flight-booking/search-no-results.spec.ts`

**Steps:**
  1. Search for a syntactically valid route with no known inventory.
    - expect: A useful no-results state is shown with an option to modify or retry the search.
  2. Simulate a supplier timeout or partial response.
    - expect: A controlled loading/error state is shown and partial or stale availability is not presented as confirmed inventory.

#### 1.7. Preserve safe search input after validation failure

**File:** `tests/ui/flight-booking/search-error-state.spec.ts`

**Steps:**
  1. Enter valid route and date values plus one invalid passenger value, then submit.
    - expect: The invalid passenger field is identified and safe route/date values remain populated.

### 2. Flight Results, Comparison, and Selection

**Seed:** `tests/seed.spec.ts`

#### 2.1. Display flight result information

**File:** `tests/ui/flight-booking/results-display.spec.ts`

**Steps:**
  1. Run a search that returns multiple flight results.
    - expect: Results display enough information to compare available flights, including price and departure time.
  2. Inspect the result currency, itinerary, and availability state.
    - expect: Values are readable, consistently formatted, and clearly identified as dynamic demo data where applicable.

#### 2.2. Compare results by price

**File:** `tests/ui/flight-booking/results-sort-price.spec.ts`

**Steps:**
  1. Apply the price comparison or sort option.
    - expect: Results are ordered according to the selected price criterion and the selected state is visible.

#### 2.3. Compare results by departure time

**File:** `tests/ui/flight-booking/results-sort-departure.spec.ts`

**Steps:**
  1. Apply the departure-time comparison or sort option.
    - expect: Results are ordered according to departure time and no result disappears incorrectly.

#### 2.4. Filter flight results

**File:** `tests/ui/flight-booking/results-filter.spec.ts`

**Steps:**
  1. Apply each available flight filter one at a time.
    - expect: Only results matching the selected filter remain, or a clear no-results state is shown.
  2. Clear the filters.
    - expect: The original eligible result set is restored without losing the search criteria.

#### 2.5. Search different days from results

**File:** `tests/ui/flight-booking/results-adjacent-days.spec.ts`

**Steps:**
  1. Use the different-day arrow/tab control.
    - expect: Results for the selected adjacent date are loaded and the active date is clearly identified.
  2. Return to the original date.
    - expect: The original date and corresponding results are restored without stale selection data.

#### 2.6. Inspect flight details

**File:** `tests/ui/flight-booking/flight-details.spec.ts`

**Steps:**
  1. Open the price or details view for a result.
    - expect: Detailed flight information is displayed without losing the original search context.
  2. Close the details view or return to results.
    - expect: The user returns to the same result set, sort, filter, and search criteria.

#### 2.7. Select a flight and continue to review

**File:** `tests/ui/flight-booking/select-flight.spec.ts`

**Steps:**
  1. Select an available flight.
    - expect: The selected flight is clearly marked and the user can continue to the review stage.
  2. Continue to review.
    - expect: The review page contains the selected itinerary and does not substitute another flight.

### 3. Review, Optional Extras, and Checkout

**Seed:** `tests/seed.spec.ts`

#### 3.1. Verify review itinerary and total

**File:** `tests/ui/flight-booking/review-summary.spec.ts`

**Steps:**
  1. Reach review after selecting a flight.
    - expect: The selected itinerary, passenger summary, currency, applicable fees, and total are visible before final traveller entry.
  2. Compare review values with the selected result.
    - expect: The itinerary and price are consistent, or a documented supplier price change is clearly presented for acknowledgement.

#### 3.2. Add and remove optional travel extras

**File:** `tests/ui/flight-booking/review-optional-extras.spec.ts`

**Steps:**
  1. Add each supported optional extra such as hotel, car, or travel insurance.
    - expect: The selected extra is attached to the flight booking and the total recalculates correctly.
  2. Remove the extra.
    - expect: The extra is removed and the total returns to the expected flight-only amount.

#### 3.3. Validate required passenger details

**File:** `tests/ui/flight-booking/checkout-required-passenger-fields.spec.ts`

**Steps:**
  1. Proceed to checkout and leave each required passenger field blank in turn.
    - expect: Checkout is blocked and each missing field has a clear, nearby validation message.
  2. Correct the fields and continue.
    - expect: Previously entered safe values remain available and checkout can proceed.

#### 3.4. Validate passenger names and international characters

**File:** `tests/ui/flight-booking/checkout-passenger-name-validation.spec.ts`

**Steps:**
  1. Enter valid names, overlength names, invalid characters, punctuation, and international characters.
    - expect: Supported valid names are accepted. Invalid or overlength values are rejected with field-specific messages.

#### 3.5. Validate booking email

**File:** `tests/ui/flight-booking/checkout-email-validation.spec.ts`

**Steps:**
  1. Enter blank, malformed, overlength, and valid international email addresses.
    - expect: Invalid email values are rejected and valid supported addresses are accepted.

#### 3.6. Require terms acceptance before payment

**File:** `tests/ui/flight-booking/checkout-terms.spec.ts`

**Steps:**
  1. Complete valid passenger and contact data but leave terms unchecked.
    - expect: The Pay Now action cannot initiate payment and the terms control is identified.
  2. Accept the terms and continue.
    - expect: Payment can be initiated only after terms acceptance.

### 4. Sandbox Payment and Confirmation

**Seed:** `tests/seed.spec.ts`

#### 4.1. Complete a successful sandbox flight booking

**File:** `tests/ui/flight-booking/payment-success.spec.ts`

**Steps:**
  1. Use approved synthetic passenger data and an approved sandbox payment value.
    - expect: The payment form accepts only the configured sandbox flow and does not require real payment data.
  2. Submit Pay Now once.
    - expect: Payment succeeds in the sandbox, exactly one booking is created, and a confirmation page is displayed.

#### 4.2. Handle declined payment

**File:** `tests/ui/flight-booking/payment-declined.spec.ts`

**Steps:**
  1. Submit a valid flight booking with the approved declined-payment fixture.
    - expect: A clear payment-failure state is shown, no successful booking is reported, and retry/change-payment options are available.

#### 4.3. Handle cancelled, expired, or pending payment

**File:** `tests/ui/flight-booking/payment-intermediate-states.spec.ts`

**Steps:**
  1. Trigger each available sandbox cancellation, timeout, expiration, or pending response.
    - expect: Each state is distinguishable from success and the user receives an accurate next action.
  2. Retry or return to the booking flow.
    - expect: Retry behavior is safe and does not create a duplicate booking.

#### 4.4. Prevent duplicate booking on repeated submission

**File:** `tests/ui/flight-booking/payment-idempotency.spec.ts`

**Steps:**
  1. Double-click Pay Now or submit the same payment request repeatedly.
    - expect: The operation is idempotent and creates at most one booking.
  2. Refresh or navigate back while payment is processing, then inspect booking status.
    - expect: The system does not report multiple bookings or an incorrect successful state.

#### 4.5. Verify booking confirmation details

**File:** `tests/ui/flight-booking/confirmation-page.spec.ts`

**Steps:**
  1. Complete a successful sandbox booking.
    - expect: The confirmation page clearly indicates success and exposes a booking reference or equivalent identifier.
  2. Compare confirmation details with the reviewed flight and passenger data.
    - expect: Flight, passenger, price, and travel information match the completed booking.

#### 4.6. Verify confirmation email

**File:** `tests/ui/flight-booking/confirmation-email.spec.ts`

**Steps:**
  1. Wait for the documented email delivery window using a test mailbox.
    - expect: A confirmation email is delivered with booking and travel information.
  2. Inspect the email content.
    - expect: The email does not expose passwords, payment secrets, tokens, or full card data.

### 5. Flight Booking Security, Integration, and Reliability

**Seed:** `tests/seed.spec.ts`

#### 5.1. Reject tampered flight search parameters

**File:** `tests/api/flight-booking/server-validation.spec.ts`

**Steps:**
  1. Modify route, dates, passenger count, selected flight, or price values in the URL/request before continuing.
    - expect: Server-side validation rejects inconsistent or unsafe values and does not trust client-modified booking data.

#### 5.2. Protect flight booking requests against injection and XSS

**File:** `tests/api/flight-booking/input-security.spec.ts`

**Steps:**
  1. Submit harmless markup, quotes, and script-like strings in route, passenger, and contact fields.
    - expect: Input is safely encoded or rejected. No script executes, query is altered, or internal error details are exposed.

#### 5.3. Verify HTTPS and session cookie security

**File:** `tests/api/flight-booking/session-security.spec.ts`

**Steps:**
  1. Inspect flight search, checkout, and payment URLs and network requests.
    - expect: Sensitive requests use HTTPS.
  2. Inspect authentication/session cookies where present.
    - expect: Cookies use Secure, HttpOnly, and appropriate SameSite attributes.

#### 5.4. Validate payment callbacks and reconciliation

**File:** `tests/api/flight-booking/payment-callback-security.spec.ts`

**Steps:**
  1. Replay, alter, omit, or delay a sandbox payment callback.
    - expect: Only a valid callback changes booking state; invalid or duplicate callbacks are rejected or ignored idempotently.

#### 5.5. Handle stale price or supplier availability changes

**File:** `tests/api/flight-booking/stale-supplier-data.spec.ts`

**Steps:**
  1. Change the supplier price or availability between results and checkout.
    - expect: The user is informed of the change and must acknowledge it before proceeding; stale data is not silently booked.

#### 5.6. Protect concurrent flight searches

**File:** `tests/ui/flight-booking/concurrent-searches.spec.ts`

**Steps:**
  1. Run different flight searches in two browser tabs and continue one result to review.
    - expect: Each journey retains the correct route and selection, or stale context is explicitly detected.

#### 5.7. Verify flight booking analytics privacy

**File:** `tests/api/flight-booking/analytics-privacy.spec.ts`

**Steps:**
  1. Perform search, selection, review, payment-success, and payment-failure journeys while inspecting analytics events.
    - expect: Expected events are emitted at the correct stages without passwords, card data, CVV, API keys, or tokens.

### 6. Flight Booking Accessibility, Localization, and Responsive Behavior

**Seed:** `tests/seed.spec.ts`

#### 6.1. Operate flight search with keyboard only

**File:** `tests/ui/flight-booking/accessibility-keyboard.spec.ts`

**Steps:**
  1. Use Tab, Shift+Tab, Enter, Space, and Escape through service navigation, route fields, date pickers, passenger controls, filters, and checkout.
    - expect: All controls are reachable and operable by keyboard. Focus remains visible and follows a logical order.

#### 6.2. Verify accessible names and form labels

**File:** `tests/ui/flight-booking/accessibility-labels.spec.ts`

**Steps:**
  1. Inspect route, date, passenger, filter, payment, and icon-only controls using an accessibility tree or screen reader.
    - expect: Every control has a meaningful accessible name and every input has a label that does not rely only on placeholder text.

#### 6.3. Verify flight status announcements

**File:** `tests/ui/flight-booking/accessibility-status.spec.ts`

**Steps:**
  1. Trigger loading, no-results, price-change, payment-failure, and confirmation states.
    - expect: Important status changes are programmatically announced and understandable without relying only on visual changes.

#### 6.4. Verify responsive flight booking layout

**File:** `tests/ui/flight-booking/responsive-layout.spec.ts`

**Steps:**
  1. Run the flight search and review flow at desktop, tablet, mobile portrait, and mobile landscape widths.
    - expect: No route, date, passenger, price, error, filter, or payment control is clipped, overlapped, or unusable.

#### 6.5. Verify currency and language in flight flow

**File:** `tests/ui/flight-booking/localization.spec.ts`

**Steps:**
  1. Change currency and language before searching and inspect results, review, checkout, and confirmation labels.
    - expect: Supported labels and currency values update consistently. Dynamic conversion rates are not asserted against fixed values without a fixture.
