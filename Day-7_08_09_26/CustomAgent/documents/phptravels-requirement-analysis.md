# PHPTRAVELS Demo Website Requirement Analysis

**Source:** https://phptravels.net/
**Analysis date:** 2026-09-08
**Scope:** Public demo experience and publicly linked booking/account content. No real credentials, payment details, API keys, or production data were used.

## Requirement Summary

PHPTRAVELS is a multi-service travel booking platform. The public experience supports hotel stays and exposes flight booking, visa booking, account access, customer and agent registration, informational pages, support channels, currency/language controls, and mobile app links.

The primary documented booking journey is:

1. Search for a trip using dates, locations, and traveller details.
2. Compare available options, prices, filters, and details.
3. Review the selection and optional extras.
4. Enter traveller and contact information at checkout.
5. Select a payment method and accept terms.
6. Receive an on-screen confirmation and confirmation email.

The site is explicitly a test/demo environment. Prices are simulated, supplier credentials are required for live rates, payment gateways are sandbox-only, and demo data may be reset.

## Functional Requirements

### FR-01: Travel service navigation

- The site shall provide navigation for hotel stays and flights.
- The site shall expose visa booking and other services through the service navigation or linked pages.
- Company, support, explore, policy, supplier, and contact links shall be available.
- The site shall provide currency and language selection controls.

### FR-02: Hotel search

- A visitor shall be able to select the Stays service.
- The visitor shall be able to enter a destination or hotel name.
- The visitor shall be able to select check-in and check-out dates.
- The visitor shall be able to specify guests and rooms.
- The visitor shall be able to select nationality before continuing with a hotel booking.
- The search shall return matching stays with property name, location, rating, promotional discount where available, and displayed price.
- The visitor shall be able to modify search criteria from the results view.

### FR-03: Hotel selection and booking

- The visitor shall be able to open a property details view.
- The property view shall present available booking information and room or rate choices when inventory exists.
- The system shall carry search context into the property flow, including dates and guest/room counts.
- The system shall require nationality before proceeding where the flow indicates it is required.
- The booking flow shall calculate and display the applicable price before confirmation.
- The system shall provide relevant cancellation, policy, and occupancy information before purchase. Exact content and rules require confirmation.

### FR-04: Flight booking

- A visitor shall be able to select the Flights service.
- The visitor shall be able to enter departure and arrival cities, travel dates, and passenger count.
- Flight results shall support comparison by price and departure time.
- The visitor shall be able to search different days, apply filters, and inspect flight details.
- The visitor shall be able to select a flight and continue to review.

### FR-05: Cross-sell and review

- The review stage shall show selected itinerary or stay details and total price.
- The system shall offer optional extras where supported, including hotels, cars, and travel insurance.
- The visitor shall be able to verify details before entering final traveller information.

### FR-06: Checkout and payment

- Checkout shall collect required passenger or guest details for every traveller.
- The visitor shall provide an email address for booking communication.
- The visitor shall select an available payment method.
- The visitor shall accept terms and conditions before payment.
- The Pay Now action shall create a booking only after successful payment authorization.
- The demo shall use sandbox/test payment behavior and shall not accept real payment credentials.

### FR-07: Confirmation and notification

- A successful booking shall display a confirmation page.
- The system shall provide booking details and important travel information in a confirmation email.
- The system should expose a booking reference or equivalent confirmation identifier.
- Failed, cancelled, expired, and pending payment states should be distinguishable from success.

### FR-08: Account access

- A visitor shall be able to sign in with email address and password.
- The visitor shall be able to request password recovery.
- A visitor without an account shall be able to open customer signup.
- The platform shall expose a separate agent signup path.
- Authenticated users should be able to view and manage their bookings; the exact account dashboard behavior requires validation.

### FR-09: Support and informational content

- The site shall provide contact information, email support, WhatsApp support, and social links.
- The site shall provide how-to-book, refund, claim, travel document, travel insurance, terms, privacy, cookies, and supplier information pages.
- The site shall communicate demo limitations before or during use.

### FR-10: Localization and responsive access

- Currency selection shall affect displayed monetary values where supported.
- Language selection shall affect user-facing labels and content where translations exist.
- Core search, login, and booking journeys shall remain usable on desktop and mobile layouts.
- The mobile app links shall direct users to the appropriate store listing.

## Positive Scenarios

- Search for an existing hotel using valid destination, future check-in/check-out dates, nationality, two guests, and one room; results are returned.
- Open a featured property and verify that the selected dates and guest count remain visible.
- Modify the hotel search from the result page and receive updated results.
- Select a valid flight route, compare results, inspect flight information, and continue to review.
- Complete each documented booking stage with valid test data and reach confirmation in sandbox mode.
- Sign in with a valid demo account and reach the authenticated area.
- Use Forgot Password with a registered email and receive a controlled recovery response.
- Open customer signup and agent signup from the relevant navigation controls.
- Change currency or language and verify the selected setting persists across the current journey.
- Open policy, support, contact, and how-to-book pages from both the footer and direct navigation.

## Negative Scenarios

- Submit hotel search without a destination or hotel name.
- Submit a search with missing check-in, missing check-out, or missing nationality.
- Attempt checkout with check-out earlier than or equal to check-in.
- Enter a past date or an unavailable date range.
- Enter zero, negative, or non-numeric guests or rooms.
- Exceed supported room or guest limits.
- Search for an unknown destination or property and verify a useful no-results state.
- Continue without selecting a required nationality.
- Use invalid email, blank email, incorrect password, or blank password during login.
- Attempt password recovery with an invalid or unregistered email without revealing account existence.
- Submit signup with missing required fields, mismatched passwords, duplicate email, invalid phone, or unacceptable terms.
- Omit a required traveller field during checkout.
- Attempt payment with declined, expired, malformed, or unsupported sandbox payment data.
- Refresh, navigate back, or let the session expire during payment and verify no duplicate booking is created.
- Try to access a booking or account resource while unauthenticated or with another user's identifier.
- Interrupt a supplier/API response and verify a controlled error rather than partial or misleading pricing.

## Boundary Scenarios

- Same-day hotel booking, minimum permitted stay, and maximum permitted future date.
- Check-out exactly one day after check-in.
- Leap day, month-end, year-end, daylight-saving transition, and timezone boundary dates.
- Minimum and maximum guest, room, passenger, and traveller counts.
- Maximum number of characters and international characters in names, cities, addresses, and email fields.
- Very long destination names and destinations with punctuation or diacritics.
- Zero-result, one-result, and very large result sets.
- Discounted, tax-inclusive, tax-exclusive, rounded, and multi-currency prices.
- Lowest and highest available room or flight prices.
- Multiple tabs or repeated search submissions that could create stale search context.
- Slow, timed-out, or partially available hotel, flight, payment, and email-provider responses.
- Mobile viewport widths, keyboard navigation, zoomed text, portrait/landscape rotation, and reduced motion preferences.

## Validation Requirements

- Required fields shall have clear, localized validation messages near the invalid control.
- Date validation shall enforce chronological order and supported booking windows.
- Numeric controls shall reject invalid characters and enforce minimum/maximum values.
- Email fields shall validate format without rejecting valid international addresses unnecessarily.
- Password rules shall be visible during signup and recovery where applicable.
- Terms acceptance shall be required before payment.
- Price, currency, taxes, fees, discounts, and final total shall remain consistent between results, review, checkout, and confirmation.
- Server-side validation shall repeat all client-side validation and must not trust URL parameters or browser-modified values.
- Validation errors shall preserve safe user-entered data where possible and must not expose secrets.

## Integration Requirements

- Hotel and flight supplier APIs shall return availability, pricing, policies, and booking status.
- Currency conversion shall provide a timestamp or other indication of rate freshness where rates are not static.
- Payment gateway integration shall support sandbox authorization, decline, timeout, cancellation, and webhook/reconciliation states.
- Email delivery shall send confirmation and relevant booking documents within the stated service expectation.
- Authentication shall support password recovery and session management.
- Optional hotel, car, and insurance products shall be correctly attached to the parent itinerary and total.
- Analytics should capture search, selection, checkout, payment, success, and failure events without capturing payment secrets.

## Security and Privacy Scenarios

- Enforce HTTPS and secure, HttpOnly, SameSite session cookies.
- Protect login, signup, recovery, search, and payment endpoints against brute force, credential stuffing, injection, CSRF, and automated abuse.
- Prevent IDOR/BOLA when viewing, changing, downloading, or cancelling bookings.
- Do not expose whether an email is registered during password recovery.
- Do not log or transmit full card numbers, CVV, passwords, API keys, or authentication tokens.
- Validate supplier and payment callbacks cryptographically and make booking creation idempotent.
- Apply least privilege to customer, agent, supplier, and administrator roles.
- Provide privacy, cookie, retention, refund, and terms disclosures that match the actual processing behavior.
- Verify external links, redirects, upload surfaces, and user-controlled fields against open redirect, XSS, SSRF, and malicious file risks.

## Accessibility Requirements

- All controls shall have accessible names, including icon-only currency, language, calendar, guest, and menu controls.
- Search forms, date pickers, dialogs, tabs, filters, and validation errors shall be keyboard accessible.
- Focus order and focus visibility shall be maintained through menus, modals, and multi-step checkout.
- Status changes such as loading, no results, price updates, payment failure, and confirmation shall be announced appropriately.
- Text, controls, error states, and pricing shall meet WCAG contrast and resizing expectations.
- Form labels shall not rely only on placeholders, and error messages shall identify the affected field.

## Missing Requirements and Ambiguities

- Exact supported countries, currencies, languages, service types, and payment methods are not defined.
- The supported date window, minimum stay, guest/room limits, passenger limits, and timezone rules are not stated.
- Required fields and format rules for customer, agent, guest, and passenger registration are not documented.
- Hotel room availability, room types, occupancy, cancellation, taxes, fees, and refund rules need a source of truth.
- Flight fare rules, baggage, seat selection, ticketing, exchange, cancellation, and refund behavior are unspecified.
- Booking modification, cancellation, rebooking, voucher, and partial-refund workflows are unspecified.
- The exact account dashboard, booking history, profile, logout, and session-expiry behavior is unspecified.
- Supplier API failure, stale price, payment pending, duplicate submission, and email delivery failure behavior is unspecified.
- The contact page exposes contact details but no clear contact form or service-level response target in the observed content.
- Demo data reset frequency, seeded test accounts, sandbox card values, and test booking cleanup procedure are not documented.
- The stated contact address, phone number, and email differ between page content and footer content; ownership and canonical support channels need confirmation.
- The business identity is displayed as both "PHPTARVELS" and "PHPTRAVELS" in visible content, which should be standardized.

## Risks

- Simulated demo pricing may make price assertions unreliable unless tests assert structure and currency rather than fixed amounts.
- Periodic data resets can make tests dependent on unstable properties, accounts, or bookings.
- Supplier and payment integrations introduce asynchronous, environment-dependent failures.
- Date-sensitive URLs and current-date defaults can cause tests to expire or become invalid over time.
- Booking and payment flows have high financial and privacy impact even in sandbox mode.
- Multiple service types may share components while having different validation and state rules.
- Inconsistent support/contact data can undermine operational trust and automated link assertions.
- The public content does not fully describe error states, so negative tests require product decisions before they can be treated as acceptance criteria.

## Automation Candidates

### High priority

- Home page loads with core navigation and demo warning visible.
- Hotel search with valid data and required-field validation.
- Results preserve search criteria and support property navigation.
- Nationality is required before hotel booking continuation.
- Login, invalid login, signup navigation, and password recovery entry point.
- Flight search and result filtering/comparison where stable test data exists.
- Booking flow through review and sandbox payment using approved test fixtures.
- Confirmation page and booking reference after successful sandbox booking.
- No duplicate booking after repeated payment submission or reload.

### Medium priority

- Currency and language selection persistence.
- Optional extras and total-price recalculation.
- Policy, support, footer, app-store, and social links.
- Responsive layouts and keyboard accessibility for search and checkout.
- Session expiry and authenticated booking access.

### Lower priority or environment-dependent

- Exact supplier prices, ratings, discounts, and inventory counts.
- Email delivery timing and external social/app-store availability.
- Live API credential behavior and production payment processing, which are outside this demo scope.

## Suggested Acceptance Criteria

- A valid hotel search returns results or a clear no-results state without losing the submitted criteria.
- A booking cannot continue when a required nationality, traveller field, or terms acceptance is missing.
- Invalid dates and invalid numeric values are rejected both in the browser and on the server.
- Results, review, checkout, and confirmation show a consistent currency and total, subject to documented supplier changes.
- A successful sandbox payment creates exactly one booking and a confirmation reference.
- A failed, cancelled, or timed-out payment does not create an apparent successful booking and can be retried safely.
- Unauthenticated users cannot access another user's booking data.
- Login and password recovery do not disclose sensitive account information.
- Core journeys are keyboard accessible and usable at supported desktop and mobile widths.
- Demo-only limitations are visible before users enter real personal or payment information.

## Test Data and Environment Notes

- Use only synthetic identities and sandbox payment values.
- Avoid real credit card numbers, passwords, API credentials, or personally identifiable information.
- Prefer relative dates generated at runtime, with a fallback for unavailable inventory.
- Seed or discover test properties and accounts at runtime because demo data may reset.
- Record environment URL, currency, locale, date/timezone, supplier response, and payment result for each booking test.
- Treat displayed prices and inventory as dynamic unless the environment provides a stable fixture contract.
