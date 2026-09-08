# PHPTRAVELS Flight UI Playwright Code Review

**Reviewed scope:** `tests/ui/flight-booking`  
**Evidence:** `test-results/results.json`, `documents/phptravels-flaky-test-report.md`, and `documents/phptravels-flight-booking-test-cases.md`  
**Run:** `npx playwright test tests/ui/flight-booking --project=chromium`  
**Review date:** 2026-09-08

## Execution Snapshot

| Metric | Count |
|---|---:|
| Result entries | 115 |
| Passed | 14 |
| Failed | 7 |
| Timed out | 8 |
| Skipped | 86 |
| Playwright flaky results | 0 |
| Retries configured for run | 0 |

The run demonstrates substantial instability and coverage gaps, but it does not prove intermittent flakiness because no retry changed a result and Playwright reported zero `flaky` statuses.

## Findings

| Severity | File | Problem | Recommendation |
|---|---|---|---|
| Critical | [tests/flight-booking-data.ts](../tests/flight-booking-data.ts#L49-L61) | `openFlights()` uses a broad `/flight/i` locator and does not dismiss the demo warning modal. `results.json` records click timeouts where `#demoWarningModal` intercepts pointer events, including mobile responsive cases. | Add a shared onboarding helper that conditionally clicks `I Understand & Continue`, asserts the modal is hidden, then uses an exact Flights navigation locator scoped to Services. Do not use `force: true`. |
| Critical | [tests/flight-booking-data.ts](../tests/flight-booking-data.ts#L55-L61) | `fillFlightSearch()` uses `locator('input').nth(...)`, which targets hidden or unrelated hotel fields. The results show a hidden `destination` input and a readonly hotel checkout input being filled, causing failures and 30-second timeouts. | Scope the locator to the verified flight form and use labels, names, or stable test IDs for departure, arrival, dates, and passengers. Remove global positional selectors. |
| High | [tests/ui/flight-booking/search-valid-flight.spec.ts](../tests/ui/flight-booking/search-valid-flight.spec.ts#L9-L10) | Assertions repeat the same global positional locator problem. The first input is hidden and remains empty, so all three data-driven route cases fail or time out before testing search behavior. | Assert the values of the actual visible flight controls returned by a shared page-object/helper. Add a precondition that the flight form is visible and interactive. |
| High | [tests/ui/flight-booking/open-flights-service.spec.ts](../tests/ui/flight-booking/open-flights-service.spec.ts#L8-L11) | The test expects a generic flight role to be visible immediately after `goto`, but the demo page has asynchronous overlay/navigation state. The observed run could not find the locator. | Wait for the home page readiness condition, dismiss the modal, target `Flights Booking` or the known `/flights` route, and assert the destination URL or flight-form landmark instead of generic body text. |
| High | [tests/ui/flight-booking/search-invalid-values.spec.ts](../tests/ui/flight-booking/search-invalid-values.spec.ts#L8-L13) | The test fills `input.nth(2)` and `input.nth(3)` as though they are flight fields. Results show `nth(2)` was a readonly hotel check-out date; one case timed out. | Use a named passenger control inside the flight form. Separate route/date/passenger fixtures from hotel controls and skip only when the actual flight form is unavailable. |
| High | [tests/ui/flight-booking/accessibility-labels.spec.ts](../tests/ui/flight-booking/accessibility-labels.spec.ts#L7-L10) | The fallback `body` text assertion is not an accessibility assertion and runs before verified flight-form navigation. `departure`, `arrival`, `passenger`, and `filter` failed because the loaded page did not contain those words. | Navigate to the flight form first and assert accessible names with `getByRole`/`getByLabel` within a scoped form. Remove the body-text fallback; it can create false positives and false failures. |
| High | [tests/ui/flight-booking/responsive-layout.spec.ts](../tests/ui/flight-booking/responsive-layout.spec.ts#L6-L11) | Mobile portrait and landscape cases timed out while the modal intercepted the click in `openFlights()`. The test is assessing layout before it has established a usable flight page. | Complete modal handling and flight navigation before viewport assertions. Use a fresh context per viewport and assert the flight form landmark before checking clipping/overlap. |
| High | [tests/ui/flight-booking/localization.spec.ts](../tests/ui/flight-booking/localization.spec.ts#L6-L11) | The loop iterates four locales but never selects the requested `locale.language` or `locale.currency`; it only clicks the first matching language button. Results show click timeouts caused by the same modal. | Select the data-driven language and currency values explicitly, assert the selected state, and handle the modal before interaction. Do not call a locale test passed merely because body text contains `flight`, `currency`, or `search`. |
| High | [tests/ui/flight-booking/payment-idempotency.spec.ts](../tests/ui/flight-booking/payment-idempotency.spec.ts#L5-L11) | The four data-driven tests do not perform the named actions. They only open the page and assert generic body text, so they cannot detect duplicate bookings. | Build a valid booking fixture, execute each action (`dblclick`, repeated request, reload, back navigation), then assert one booking reference or one server-side booking record. |
| High | [tests/ui/flight-booking/checkout-passenger-name-validation.spec.ts](../tests/ui/flight-booking/checkout-passenger-name-validation.spec.ts#L6-L14) | The test fills a name but never submits or asserts accepted/rejected behavior. It expects generic body text for both valid and invalid values, so invalid input can appear to pass. | Add a valid checkout precondition, submit each value, and assert the field-specific validation or successful continuation according to the data classification. |
| High | [tests/ui/flight-booking/checkout-email-validation.spec.ts](../tests/ui/flight-booking/checkout-email-validation.spec.ts#L6-L14) | The test does not distinguish valid from invalid emails and never submits the form. It only checks generic text after filling. | Use a typed dataset with `expectedValid`, submit each case, and assert either field validation or successful progression. Include server-side validation for malformed values. |
| Medium | [tests/ui/flight-booking/accessibility-status.spec.ts](../tests/ui/flight-booking/accessibility-status.spec.ts#L5-L11) | The `state` data is only used in the title. No loading, no-results, price-change, payment-failure, or confirmation state is triggered, and the test only checks for any live region or generic body text. | Use controlled fixtures to trigger each state and assert the relevant live region text, role, and timing. A generic `/flight|search|booking/` assertion is insufficient. |
| Medium | [tests/ui/flight-booking/accessibility-keyboard.spec.ts](../tests/ui/flight-booking/accessibility-keyboard.spec.ts#L5-L11) | The test presses one key on the page and considers any visible focus target a pass. It does not traverse the flight controls or verify focus order, activation, or modal escape behavior. | Define a keyboard journey through Services, Flights, route fields, dates, passenger controls, filters, and checkout. Assert each expected focus target and resulting state. |
| Medium | [tests/ui/flight-booking/review-summary.spec.ts](../tests/ui/flight-booking/review-summary.spec.ts#L5-L11) | The passenger data is only used in the title; the test does not select a flight, reach review, or compare itinerary and totals. | Use a stable selected-flight fixture, assert the review landmark, and compare route/passenger/price data with the selected result. |
| Medium | [tests/ui/flight-booking/review-optional-extras.spec.ts](../tests/ui/flight-booking/review-optional-extras.spec.ts#L5-L13) | The extra name is used only to find a button and generic text is asserted. The test does not verify total changes, attachment to the flight, or removal. | Assert the extra's selected state, capture before/after totals, and verify removal restores the flight-only total. Use stable fixture prices. |
| Medium | [tests/ui/flight-booking/payment-intermediate-states.spec.ts](../tests/ui/flight-booking/payment-intermediate-states.spec.ts#L5-L13) | Payment outcome strings are checked only against a local array. No payment request is initiated and no state transition is asserted. | Inject the named sandbox response, assert pending/declined/cancelled/expired/timeout UI and backend state, then verify safe retry behavior. |
| Medium | [tests/ui/flight-booking/payment-success.spec.ts](../tests/ui/flight-booking/payment-success.spec.ts#L5-L13) | The test checks that `sandbox.success` exists in a local array but does not fill checkout, submit payment, verify one booking, or inspect confirmation. | Use a complete synthetic booking fixture and assert successful authorization, confirmation page, booking reference, and exactly-one-booking behavior. |
| Medium | [tests/ui/flight-booking/confirmation-page.spec.ts](../tests/ui/flight-booking/confirmation-page.spec.ts#L5-L13) | It does not complete a booking or compare confirmation details; it only checks generic body text. | Assert the confirmation route, reference, itinerary, passenger, total, and success status from a completed sandbox fixture. |
| Low | [tests/ui/flight-booking/localization.spec.ts](../tests/ui/flight-booking/localization.spec.ts#L5-L11) | The test data includes `ja-JP` and other locales without proving they are supported by the demo, creating avoidable skips/failures or false passes. | Discover supported options first or provide a capability fixture. Mark unsupported locale cases explicitly as environment-dependent. |
| Low | [tests/ui/flight-booking/checkout-passenger-name-validation.spec.ts](../tests/ui/flight-booking/checkout-passenger-name-validation.spec.ts#L6-L8) | Test titles include raw payloads such as script-like strings and SQL-like text, which can make report output noisy and difficult to search. | Use stable data IDs in titles, and log the payload only in controlled attachments or diagnostics. |

## Architecture and Maintainability Review

### Locators

The suite generally uses Playwright role and label locators, which is the right direction, but the shared helper and several tests fall back to global `input` indexing. The live failure evidence confirms that this is not merely stylistic: hidden destination state and hotel date inputs are selected.

Preferred locator hierarchy for this suite:

1. `getByTestId` for an agreed flight-form contract.
2. `getByRole` with exact accessible names for navigation and actions.
3. `getByLabel` within the flight-form scope.
4. Stable `input[name]` or route selectors as a temporary fallback.
5. Avoid global `locator('input').first()` and `nth()` for business fields.

### Synchronization

The suite relies on `page.goto()` and then immediately interacts with controls. The public demo displays an asynchronous warning modal with the button `I Understand & Continue`; the tests do not handle it. This creates actionability retries and 30-second timeouts, especially on mobile.

The shared setup should establish these states in order:

1. Page loaded and expected title/URL.
2. Optional demo modal dismissed.
3. Exact Flights navigation completed.
4. Flight form landmark visible.
5. Required controls visible and enabled.

No fixed sleeps should be added. Use Playwright's auto-waiting against meaningful state locators.

### Test Data and Isolation

The data-driven loops are useful, but many datasets produce multiple tests without a real data-specific action. In particular, payment, localization, status, idempotency, and validation loops mostly vary titles rather than behavior.

Use typed datasets such as:

```ts
type ValidationCase = {
  id: string;
  value: string;
  expectedValid: boolean;
  expectedMessage?: RegExp;
};
```

Keep live-demo smoke cases separate from fixture-backed booking cases. The results show 86 skipped entries because required supplier, checkout, payment, or mailbox fixtures were unavailable. Skips should remain visible in CI and must not be counted as coverage.

### Assertions

Many tests assert generic page text, for example `/flight|result|no result/i`, or merely verify that a local fixture array contains a string. These assertions can pass without exercising the requirement. Assertions should verify the user-visible state or a controlled API contract specific to the scenario.

### Test Names and Reporting

The test names are descriptive, but raw security payloads and large strings are included in titles. Use data IDs in titles for concise reports while preserving the actual value in test attachments or diagnostic output.

## Requirement Coverage Assessment

| Requirement area | Assessment |
|---|---|
| Flight service entry | Present but currently blocked by modal and broad navigation locator. |
| Valid search | Present as data-driven cases but fails before reaching the real flight fields. |
| Required/invalid search validation | Intended cases exist, but positional input assumptions make execution invalid. |
| Results comparison/filtering/details | Cases exist, but many are fixture-gated or rely on generic assertions. |
| Review and optional extras | Cases exist structurally, but do not reach or assert review behavior. |
| Passenger/email validation | Data-driven cases exist, but no submission or outcome assertions are implemented. |
| Payment/confirmation | Cases exist, but most only assert page text or fixture-array membership. |
| Accessibility | Keyboard and labels cases are too shallow; label cases fail on the wrong page state. |
| Localization | Locale data is not applied to the browser/application. |
| Responsive behavior | Desktop/tablet can pass, while mobile is blocked by the modal. |

## Recommended Action Order

1. Fix shared `openFlights()` onboarding and exact navigation.
2. Replace shared generic input indexing with a scoped flight form page object/helper.
3. Re-run only `open-flights-service.spec.ts` and `search-valid-flight.spec.ts` with one worker.
4. Add real submit/result assertions and stable supplier fixtures.
5. Convert validation, payment, localization, accessibility, and responsive cases from generic smoke checks into behavior-specific assertions.
6. Re-run the complete UI suite with retries disabled first; enable a small retry only after root causes are fixed.
7. Track skipped tests separately from pass/fail and require fixture configuration before claiming full coverage.

## Code Quality Score

**3/10**

The suite has useful organization and data-driven intent, but the current run and source reveal fundamental issues with navigation state, locator scope, synchronization, and assertion strength. Most importantly, many tests report a green outcome without exercising the behavior named by the test.

## Top Improvements

1. Make the shared flight navigation/form setup deterministic.
2. Replace positional selectors with scoped semantic locators or stable test IDs.
3. Implement real action-and-outcome assertions in every data-driven case.
4. Separate live-demo smoke coverage from fixture-backed booking coverage.
5. Treat skipped tests as uncovered requirements, not passing tests.
