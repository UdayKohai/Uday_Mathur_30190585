# PHPTRAVELS Flight Booking Failure Analysis Report

**Source results:** `test-results/results.json`  
**Supporting documents:** all Markdown files in `documents/`, including the requirement analysis, flight booking test plan, test cases, test data, flaky-test report, UI code review, and test-report analysis.  
**Execution command:** `npx playwright test tests/ui/flight-booking --project=chromium`  
**Execution date:** 2026-09-08  
**Browser/project:** Chromium  
**Workers:** 6  
**Retries:** 0  
**Timeout:** 30 seconds

## Executive Summary

The run contains 115 result entries:

- 14 passed
- 7 failed assertions
- 8 timed out
- 86 skipped
- 0 retries
- 0 Playwright `flaky` statuses

The failures are primarily **automation-script, locator, timing/synchronization, and environment/fixture issues**. The available evidence does not confirm an application defect. The test suite is not reliable evidence of flight-booking behavior because many tests either stop before reaching the intended flight page or assert generic text without exercising the named workflow.

**Overall classification:** Automation and environment failure with high flakiness risk.  
**Retry recommended:** No blind retry. Repair the shared setup and locator strategy first, then repeat under controlled conditions.  
**Bug should be raised:** No product bug should be raised from this run. An automation defect should be raised for the test suite.

## Failed Test 1

**Tests:**

- `tests/ui/flight-booking/open-flights-service.spec.ts`
- Any UI test using `openFlights()`

### Error

The Flights navigation control was not reliably visible or clickable after page load. Related runs timed out while Playwright retried a click intercepted by `#demoWarningModal`.

### Root Cause

The shared helper selects the first broad `/flight/i` link or button and does not dismiss the documented demo warning modal before clicking. The public demo displays an `I Understand & Continue` button that overlays the page.

### Failure Classification

**Timing/Synchronization Issue and Locator Issue**

### Evidence

- Results show click actionability retries until the 30-second timeout.
- The call log states that `#demoWarningModal` intercepted pointer events.
- The locator uses `.first()` with a broad `/flight/i` pattern rather than an exact, scoped Flights navigation control.
- The test asserts visibility immediately after `goto` without establishing modal dismissal or flight-page readiness.

### Recommended Action

Add a shared onboarding step:

1. Navigate to the home page.
2. Conditionally click `I Understand & Continue`.
3. Assert `#demoWarningModal` is hidden.
4. Select the exact Flights navigation link.
5. Assert the `/flights` route or flight-form landmark is visible.

Do not use `force: true`, because the overlay is a real user-blocking state.

### Retry Recommended

**No.** A retry will reproduce the same blocked interaction until the modal and locator are handled.

### Bug Should Be Raised

**No application bug.** Raise an automation defect against the shared `openFlights()` helper.

## Failed Test 2

**Tests:**

- `tests/ui/flight-booking/search-valid-flight.spec.ts`
- `tests/ui/flight-booking/search-invalid-values.spec.ts`
- `tests/flight-booking-data.ts`

### Error

Valid search cases failed while filling or asserting route fields. The first input resolved to a hidden `destination` input, and another indexed input resolved to a readonly hotel checkout date. An invalid passenger case timed out while trying to fill a non-editable control.

### Root Cause

Flight controls are located globally by input position using `locator('input').first()` and `nth()`. The page contains hidden state fields and hotel controls before the intended flight controls. The helper also does not verify that the active page is the flight search page.

### Failure Classification

**Locator Issue and Automation Script Defect**

### Evidence

- Results show `locator('input').first()` resolving to hidden input `name="destination"`.
- Results show `input.nth(2)` resolving to a readonly hotel checkout date input.
- The data-driven route tests fail before submitting a flight search.
- The intended test requirement is to enter departure, arrival, dates, and passenger count and then verify results; that workflow was not reached.

### Recommended Action

Scope controls to a verified flight form and use semantic locators or stable test IDs:

```ts
const flightForm = page.getByTestId('flight-search-form');
await flightForm.getByLabel(/departure/i).fill(data.departureCity);
await flightForm.getByLabel(/arrival/i).fill(data.arrivalCity);
await flightForm.getByLabel(/departure date/i).fill(data.departureDate);
```

Add a precondition that the flight form is visible and interactive. Replace global positional assertions with assertions against the same scoped controls.

### Retry Recommended

**No.** Repeating the test without changing the locator strategy will continue to target the wrong elements.

### Bug Should Be Raised

**No application bug.** Raise an automation defect for global positional selectors and missing flight-page setup.

## Failed Test 3

**Test:** `tests/ui/flight-booking/accessibility-labels.spec.ts`

### Error

The tests for `departure`, `arrival`, `passenger`, and `filter` failed because the fallback body-text assertion could not find those terms. The test was operating on a page that had not been verified as the flight form.

### Root Cause

The test does not navigate to a confirmed flight page before inspecting labels. It also uses visible body text as a fallback for accessibility validation, which does not prove that controls have accessible names.

### Failure Classification

**Automation Script Defect and Locator Issue**

### Evidence

- The failure expected `/departure/i`, `/arrival/i`, `/passenger/i`, or `/filter/i` in `body`.
- The received page content showed general PHPTRAVELS navigation and demo content rather than the expected flight form controls.
- The date case passing does not establish complete accessibility coverage; it only shows that one generic date-related condition was found.
- The UI code review identifies the same weak fallback assertion.

### Recommended Action

Navigate through the shared verified flight setup, then assert accessible names directly within the flight form using `getByRole` or `getByLabel`. Remove the body-text fallback. Test live regions separately from control naming.

### Retry Recommended

**No.** The page state and assertion strategy must be corrected first.

### Bug Should Be Raised

**No application bug.** Raise an automation defect. A product accessibility bug may be raised only after the corrected test confirms a missing accessible name on the actual flight form.

## Failed Test 4

**Tests:**

- `tests/ui/flight-booking/responsive-layout.spec.ts` for mobile portrait
- `tests/ui/flight-booking/responsive-layout.spec.ts` for mobile landscape

### Error

Both mobile cases timed out while attempting to click the Flights control. The demo warning modal intercepted pointer events.

### Root Cause

Responsive tests resize the page and call the shared navigation helper without dismissing the modal or verifying that navigation has completed. The modal covers the target more consistently at mobile viewport sizes.

### Failure Classification

**Timing/Synchronization Issue and Environment Issue**

### Evidence

- Desktop/tablet cases passed in the result set, while mobile portrait and landscape timed out.
- Playwright explicitly reports pointer events intercepted by `#demoWarningModal`.
- The timeout occurred during `openFlights()`, before any layout assertion could be made.

### Recommended Action

Use a fresh context per viewport. Dismiss the modal before navigating, assert the flight form is loaded, and only then perform responsive layout checks. Keep navigation setup separate from layout assertions.

### Retry Recommended

**No.** Retry after fixing modal handling and page readiness. A blind retry will only repeat the intercepted click.

### Bug Should Be Raised

**No application bug.** Raise an automation setup defect. Reassess the application only after the corrected mobile flow is executed.

## Failed Test 5

**Test:** `tests/ui/flight-booking/localization.spec.ts`

### Error

Localization cases can time out while clicking the language control because the demo modal remains open. In addition, the test loops over locale data without actually selecting the requested language or currency.

### Root Cause

The test is blocked by shared modal handling and does not use its data-driven `locale` values to perform a language or currency selection. The test can therefore not prove localization behavior.

### Failure Classification

**Automation Script Defect, Timing/Synchronization Issue, and Test Data Issue**

### Evidence

- Results include click timeouts caused by the modal overlay.
- The test only clicks the first matching language button.
- `locale.language` and `locale.currency` are not passed to selection controls.
- The available test data includes locales that may not be enabled by the demo; supported capabilities are not discovered at runtime.

### Recommended Action

Dismiss the modal, discover supported options, select the exact language and currency from the test data, and assert the selected state and resulting labels/price formatting. Mark unsupported locales as environment-dependent rather than passing them with generic body text.

### Retry Recommended

**No.** Correct the setup and data usage first.

### Bug Should Be Raised

**No application bug.** Raise an automation/data-configuration defect.

## Failed Test 6

**Tests:**

- `tests/ui/flight-booking/search-required-fields.spec.ts`
- `tests/ui/flight-booking/search-invalid-values.spec.ts`

### Error

Many validation cases were skipped because the expected flight form fields were not exposed by the demo. One invalid passenger case timed out on a readonly hotel control.

### Root Cause

The tests assume a specific global input order and do not establish the flight form as a precondition. The test environment also lacks a stable flight form or fixture for all intended validation cases.

### Failure Classification

**Environment Issue, Locator Issue, and Test Data/Fixture Issue**

### Evidence

- Results contain explicit skip annotations such as `Flight form fields are not exposed by the demo`.
- The test data document requires stable flight controls and supported route fixtures.
- The results show the fallback interaction landing on hotel inputs.

### Recommended Action

Provide a stable flight-page or supplier fixture and use named/scoped controls. Keep skipped tests visible as uncovered requirements. Do not count them as passed coverage.

### Retry Recommended

**No.** Skips and wrong-page interactions require environment or script changes, not retries.

### Bug Should Be Raised

**No application bug based on current evidence.** Raise a fixture/setup gap or automation defect.

## Failed Test 7

**Tests:** Supplier-dependent results, review, checkout, payment, confirmation, and integration cases

### Error

86 cases were skipped because required supplier, checkout, payment, mailbox, callback, or form fixtures were not configured.

### Root Cause

The run used a live demo environment without the approved fixtures required by the flight test plan. The plan explicitly marks these workflows as conditional.

### Failure Classification

**Environment Issue and Test Data/Fixture Issue**

### Evidence

The results contain skip annotations including:

- `Requires an approved supplier fixture`
- `Requires a stable results fixture`
- `Requires checkout fixture`
- `Requires approved supplier and payment fixtures`
- `Requires a test mailbox and approved booking fixtures`
- `Flight form fields are not exposed by the demo`

The test data document defines supplier, payment, email, callback, and dynamic-price roles that were not supplied to the run.

### Recommended Action

Create separate execution profiles:

- Live-demo smoke tests
- Supplier-fixture tests
- Payment-fixture tests
- Email/callback integration tests
- Accessibility-only tests using stable markup fixtures

Report skipped cases as uncovered requirements. Do not enable retries to hide missing environment configuration.

### Retry Recommended

**No.** Configure the required fixtures before execution.

### Bug Should Be Raised

**No application bug.** Raise an environment/fixture readiness issue if the suite is expected to run in CI.

## Failed Test 8

**Tests:** Payment, confirmation, optional extras, keyboard, and status-announcement cases that reported a green result

### Error

Several tests pass without executing the workflow named by the test. Examples include checking that a payment fixture string exists in a local array, checking generic page text, pressing one key, or checking whether any live region exists.

### Root Cause

Assertions are too weak and data-driven loops often vary only the test title. A passing result does not necessarily represent successful flight behavior.

### Failure Classification

**Automation Script Defect and Assertion Defect**

### Evidence

The UI code review identifies that:

- Payment tests do not submit payment or verify a booking.
- Idempotency tests do not perform double submission, reload, or back navigation.
- Name/email validation tests do not submit values or distinguish valid from invalid outcomes.
- Localization tests do not select data-driven locale values.
- Keyboard tests press one key without traversing the flight controls.
- Status tests do not trigger loading, no-results, price-change, failure, or confirmation states.

### Recommended Action

Replace generic assertions with action-and-outcome assertions. Use typed test data containing expected validity, expected message, and fixture role. Verify booking references, totals, selected itinerary, server responses, and accessibility announcements.

### Retry Recommended

**No.** A retry cannot improve assertion validity.

### Bug Should Be Raised

**No application bug.** Raise test-quality defects for false-positive coverage.

## Cross-Run Classification

| Failure area | Classification | Retry | Product bug? |
|---|---|---|---|
| Flights navigation | Locator/timing automation defect | No | No |
| Flight form entry | Locator/automation defect | No | No |
| Accessibility labels | Automation/assertion defect | No | Not yet |
| Mobile responsive cases | Timing/setup defect | No | No |
| Localization | Automation/data defect | No | No |
| Validation cases | Locator/fixture defect | No | No |
| Supplier/payment/confirmation cases | Environment/fixture issue | No | No |
| Passing but shallow cases | Assertion/test-quality defect | No | No |

## Root Cause Priority

### P0: Must fix before relying on results

1. Dismiss the demo modal in shared setup.
2. Use exact Flights navigation and verify the target route.
3. Replace global positional selectors with scoped semantic locators or stable test IDs.
4. Establish the flight form as a required precondition.

### P1: Must fix before claiming requirement coverage

1. Configure supplier, payment, mailbox, and callback fixtures.
2. Implement real submit-and-outcome assertions.
3. Separate live-demo smoke and fixture-backed suites.
4. Re-run with one worker and retries disabled.

### P2: Improve confidence and maintainability

1. Use data IDs instead of raw security payloads in titles.
2. Apply locale and currency data explicitly.
3. Assert accessibility names and live-region content directly.
4. Add diagnostics for URL, modal visibility, form visibility, and locator counts.

## Final Assessment

### Failed Test

The current run contains failures and timeouts across navigation, search, accessibility, responsive, localization, and validation tests, plus 86 fixture-gated skips.

### Error

Most errors are actionability timeouts, wrong-element interactions, and assertions against content absent from the intended flight page. No retry-based flaky transition was recorded.

### Root Cause

The dominant root causes are incorrect locator scope, unhandled demo-modal synchronization, missing verified page-state setup, weak assertions, and unavailable environment fixtures.

### Failure Classification

**Primary:** Automation Script Defect  
**Secondary:** Locator Issue, Timing/Synchronization Issue, Environment Issue, Test Data/Fixture Issue, and Assertion Defect  
**Not established:** Application Defect, API/Network Issue, or confirmed Flaky Test

### Evidence

The results report records 115 entries: 14 passed, 7 failed, 8 timed out, 86 skipped, 0 retries, and 0 flaky statuses. The supporting Markdown reports independently identify hidden-input targeting, modal pointer interception, wrong-page accessibility assertions, mobile timeouts, shallow data-driven tests, and missing fixtures.

### Recommended Action

Repair shared navigation and form setup, provide stable fixtures, strengthen assertions, then repeat the representative tests with one worker and retries disabled. Only after a corrected repeated run should any application defect or confirmed flaky test be raised.

### Retry Recommended

**No immediate retry.** Repair the test harness and environment first; then run controlled repeat tests to assess flakiness.

### Bug Should Be Raised

**No product bug should be raised from this run.** Raise automation and environment issues. Raise an application bug only if a corrected test reproduces the same behavior using a verified flight page, stable locators, and approved fixtures.
