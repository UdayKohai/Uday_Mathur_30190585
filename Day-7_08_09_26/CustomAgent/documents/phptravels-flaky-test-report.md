# PHPTRAVELS Flight Booking Flaky Test Report

**Source:** `test-results/results.json`  
**Run command:** `npx playwright test tests/ui/flight-booking --project=chromium`  
**Run date:** 2026-09-08  
**Playwright:** 1.63.0  
**Project:** Chromium  
**Workers:** 6  
**Retries:** 0  
**Test timeout:** 30,000 ms

## Executive Finding

The report contains failed and skipped tests, but it does **not** prove intermittent flakiness: there are no retries and no test result with Playwright status `flaky`. The run should therefore be classified as a **first-run stability failure with high flakiness risk**, not as confirmed flaky behavior.

The strongest common causes are:

1. Broad positional selectors such as `locator('input').first()` and `nth()` target hidden or unrelated hotel controls.
2. `openFlights()` selects a broad `/flight/i` link and does not close the demo-warning modal before clicking.
3. The public demo landing page does not expose the assumed flight form immediately, so tests assert against a page state that has not been reached.
4. Mobile runs are especially vulnerable because the modal intercepts pointer events and the click retries until the 30-second timeout.
5. Many cases are intentionally skipped because supplier, payment, mailbox, or form fixtures are not configured; skips are environment gating, not flaky outcomes.

## Run Evidence

- Configuration reports `failOnFlakyTests: false`.
- Configuration reports `retries: 0`.
- The run used 6 workers against a live demo site.
- The JSON includes `ok: false` records and failed/timed-out results, but no `status: flaky` result.
- The JSON includes many expected skips with annotations such as `Requires an approved supplier fixture` and `Flight form fields are not exposed by the demo`.
- Several failures include screenshots, video, trace, and error-context attachments, which should be retained for reproduction.

## Findings

### Finding 1: Flight form interaction uses hidden/unrelated inputs

**Tests:**

- `tests/ui/flight-booking/search-valid-flight.spec.ts`
- `tests/ui/flight-booking/search-invalid-values.spec.ts`
- Shared helper: `tests/flight-booking-data.ts`

**Flakiness probability:** High

**Evidence:**

- `search-valid-flight.spec.ts` asserts `locator('input').first()` and `.nth(1)`.
- The failure shows the first input was a hidden input named `destination` and its value remained empty.
- The helper attempts `fill()` on the first generic input; the result shows the locator resolved to a hidden input that was not visible/editable.
- The invalid-passenger test attempted to fill `input.nth(2)` but that element was a readonly hotel check-out date field, causing a 30-second timeout.

**Possible cause:**

The locator strategy is positional and page-global. The application contains hidden state inputs and hotel controls before the intended flight controls. DOM order can also change with responsive layout or demo content, making these tests unstable across runs and viewports.

**Recommended fix:**

Use semantic, flight-form-scoped locators. Identify the flight form by a stable `data-testid`, form name, route, or accessible landmark, then target fields by label/name. Do not use `locator('input').first()` or `nth()` for business fields.

**Locator improvement:**

```ts
const flightForm = page.getByTestId('flight-search-form');
await flightForm.getByLabel(/departure/i).fill(data.departureCity);
await flightForm.getByLabel(/arrival/i).fill(data.arrivalCity);
await flightForm.getByLabel(/departure date/i).fill(data.departureDate);
```

If the application currently lacks stable labels or test IDs, add them before relying on these cases. A controlled fallback should use `input[name="..."]` or a scoped visible input, never hidden inputs.

**Synchronization improvement:**

Wait for the flight form to be visible and interactive before filling it. Do not use a generic page load as proof that the target form is ready.

**Test isolation improvement:**

Run search tests against a known flight route/fixture or a dedicated flight URL. The current helper can land on the home page where the visible form is for hotel stays.

---

### Finding 2: Demo warning modal intercepts flight navigation clicks

**Tests:**

- `tests/ui/flight-booking/open-flights-service.spec.ts`
- `tests/ui/flight-booking/responsive-layout.spec.ts`
- Any test using `openFlights()` from `tests/flight-booking-data.ts`

**Flakiness probability:** High

**Evidence:**

- `openFlights()` clicks the first broad link or button matching `/flight/i`.
- `open-flights-service.spec.ts` failed because no matching visible role was available at the assertion point.
- Mobile responsive failures timed out while clicking a flight link.
- The Playwright call log states that `#demoWarningModal` intercepted pointer events, including the modal's content and footer subtree.
- The click retried repeatedly until the 30-second test timeout.

**Possible cause:**

The demo warning modal appears asynchronously and is not handled by the shared setup. The target flight link is present, but the modal overlays it. At different viewport sizes the modal's timing and layout alter whether the click succeeds, producing viewport-sensitive failures.

**Recommended fix:**

Handle the demo modal immediately after navigation. Prefer its actual accessible button, such as `I Understand & Continue`, and assert it is dismissed before selecting Flights. Do not use `force: true`, because that would hide a real user-blocking overlay.

**Synchronization improvement:**

```ts
await page.goto(baseUrl);
const continueButton = page.getByRole('button', { name: /i understand.*continue/i });
if (await continueButton.isVisible().catch(() => false)) {
  await continueButton.click();
}
await expect(page.locator('#demoWarningModal')).toBeHidden();
```

Use a bounded helper with a short timeout for the optional modal, and wait for the target flight navigation control to be visible after dismissal.

**Locator improvement:**

Use the exact flight navigation destination or accessible name, for example `getByRole('link', { name: /Flights Booking/i })`, scoped to the Services menu. Avoid `getByRole(..., { name: /flight/i }).first()` because it can match property cards or unrelated content.

---

### Finding 3: Accessibility label assertions assume labels that are absent from the loaded page

**Tests:**

- `tests/ui/flight-booking/accessibility-labels.spec.ts`

**Flakiness probability:** Medium to High

**Evidence:**

- Failed cases include `departure`, `arrival`, `passenger`, and `filter`.
- The fallback assertion `expect(page.locator('body')).toContainText(/departure/i)` timed out.
- The received page text contained the home page navigation, including `Flights Booking`, but not the expected field words.
- The `date` case passed, showing the result varies by available text/control rather than proving the full flight form is accessible.

**Possible cause:**

The test does not navigate to a verified flight search page before checking controls. It also conflates visible text presence with accessible naming. A control can have an accessible label without the exact word appearing in body text, and the public home page may show a hotel form instead.

**Recommended fix:**

Navigate through the same supported flight entry path used by the product, dismiss the demo modal, and inspect the accessibility tree or `getByRole`/`getByLabel` on the scoped flight form. Remove the body-text fallback as an accessibility assertion.

**Locator improvement:**

Assert accessible names directly:

```ts
const flightForm = page.getByTestId('flight-search-form');
await expect(flightForm.getByRole('textbox', { name: /departure/i })).toBeVisible();
```

**Synchronization improvement:**

Wait for the flight form landmark and its fields, not merely `page.goto()` completion.

---

### Finding 4: Mobile responsive cases are blocked by the same modal overlay

**Tests:**

- `tests/ui/flight-booking/responsive-layout.spec.ts`

**Flakiness probability:** High

**Evidence:**

- Desktop and tablet results include passing cases in the available excerpt.
- Mobile portrait and mobile landscape timed out.
- The error states that `#demoWarningModal` intercepted pointer events while `openFlights()` attempted to click.
- The timeout was 30 seconds, indicating repeated actionability retries rather than a clean application assertion.

**Possible cause:**

The modal is not dismissed before navigation, and its responsive layout covers the target link more reliably on small viewports.

**Recommended fix:**

Dismiss the modal before resizing or after resizing, then wait for the visible flight navigation control. Keep the viewport test focused on layout after navigation is complete.

**Test isolation improvement:**

Use a fresh context per viewport and a shared `beforeEach` that completes demo onboarding. Avoid reusing a page state where a modal may be open from a previous action.

---

### Finding 5: Unconfigured environment cases are skipped, not flaky

**Tests:**

- Supplier-dependent result, review, payment, and integration cases
- Required-field cases where the form is not exposed

**Flakiness probability:** Low as flakiness; high as coverage risk

**Evidence:**

The JSON records expected skips with explicit annotations, including:

- `Requires an approved supplier fixture`
- `Requires a stable results fixture`
- `Requires checkout fixture`
- `Requires approved supplier and payment fixtures`
- `Flight form fields are not exposed by the demo`

**Interpretation:**

These are intentional environment gates. They should not be reported as passing product coverage, and they should not be retried as though they were flaky.

**Recommended fix:**

Separate tests into `smoke`, `fixture-required`, and `environment-dependent` projects or tags. Provide stable supplier/payment fixtures before treating skipped cases as executable acceptance coverage.

## Stabilization Plan

### Priority 0

1. Update `openFlights()` to dismiss `#demoWarningModal` using its real continue button.
2. Replace global positional input locators with scoped semantic locators.
3. Navigate to and assert the actual flight form before interacting with route/date/passenger controls.
4. Add stable application test IDs or accessible labels for departure, arrival, date, passengers, filters, and payment controls.

### Priority 1

1. Run a single representative search spec repeatedly, for example 10 times, after the locator/modal fixes.
2. Run the mobile responsive spec repeatedly at portrait and landscape sizes.
3. Add a controlled supplier fixture for results, selection, review, and price-change states.
4. Configure Playwright retries only after root-cause fixes; retries must not conceal actionability or locator defects.

### Priority 2

1. Split live-demo smoke tests from fixture-backed contract tests.
2. Add test tags for `@live-demo`, `@supplier-fixture`, `@payment-fixture`, and `@accessibility`.
3. Use a lower-cost setup for accessibility label checks that does not depend on live inventory.
4. Record modal state, current URL, visible form landmarks, and locator counts in failure diagnostics.

## Recommended Flakiness Verification Run

After applying the fixes, execute:

```powershell
npx playwright test tests/ui/flight-booking/open-flights-service.spec.ts --project=chromium --repeat-each=10 --workers=1
npx playwright test tests/ui/flight-booking/search-valid-flight.spec.ts --project=chromium --repeat-each=10 --workers=1
npx playwright test tests/ui/flight-booking/responsive-layout.spec.ts --project=chromium --repeat-each=5 --workers=1
```

A test should be called flaky only when the same test passes and fails across repeated equivalent runs, ideally with at least one retry that changes the outcome. The current JSON does not contain that evidence.

## Final Classification

| Area | Classification | Reason |
|---|---|---|
| `openFlights()` navigation | High flakiness risk | Modal overlay and broad flight locator cause actionability failures/timeouts. |
| Flight form data entry | High flakiness risk | Generic positional locators target hidden hotel inputs or readonly fields. |
| Accessibility labels | Medium/High risk | Assertions run before verified flight-form navigation and use weak body-text fallback. |
| Mobile responsive tests | High flakiness risk | Modal overlay intercepts clicks on small viewports. |
| Fixture-gated tests | Not flaky; skipped | Explicit environment annotations explain why they did not execute. |
| Entire run | Not confirmed flaky | One run, zero retries, no Playwright `flaky` statuses. |
