# Sauce Demo (Swag Labs) — Master Test Plan

## Application Overview

**Document ID:** TP-SAUCEDEMO-001 · **Version:** 1.0 · **Author:** Senior QA Test Lead · **AUT:** https://www.saucedemo.com/

---

## 1. Introduction

### 1.1 Purpose
This document defines the strategy, scope, resources, schedule and exit criteria for testing the **Sauce Demo (Swag Labs)** e-commerce demo application. It is the single reference for QA engineers, developers, automation engineers and stakeholders and serves as the baseline for both manual verification and automated regression suites.

### 1.2 Scope
Testing covers the complete browser-based purchase journey: authentication, product catalogue browsing, sorting, cart management, the three-step checkout workflow, order confirmation, the burger navigation menu and session handling. Both positive and negative paths are exercised, along with UI, cross-browser, responsive, accessibility, basic security and performance verification.

### 1.3 Objectives
| # | Objective |
|---|---|
| O1 | Validate that every functional requirement of the purchase flow behaves as specified. |
| O2 | Verify authentication and authorisation, including locked-out users and unauthenticated deep links. |
| O3 | Confirm price, tax and total calculations are arithmetically correct. |
| O4 | Confirm consistent rendering and behaviour across Chrome, Edge, Firefox and Safari. |
| O5 | Confirm behavioural differences of the special personas (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) are detected as defects. |
| O6 | Establish a maintainable Page Object Model automation suite integrated into CI/CD. |
| O7 | Achieve ≥ 95 % requirement coverage and zero open Critical/High defects at exit. |

---

## 2. Application Overview

### 2.1 Description
Sauce Demo (branded *Swag Labs*) is a publicly hosted React single-page application published by Sauce Labs as a practice target for test automation. It simulates a minimal storefront selling six branded merchandise items. State is held client-side in browser session storage; there is no real payment gateway or persistent order database. The application intentionally ships with seeded personas that reproduce classic front-end defects, making it ideal for negative and visual regression training.

### 2.2 Key Modules and Functionalities
| Module | URL | Functionality |
|---|---|---|
| Login | `/` | Username/password authentication, inline error banner, accepted-credentials help panel |
| Inventory (Products) | `/inventory.html` | Grid of 6 products with image, name, description, price, Add/Remove button |
| Product Detail | `/inventory-item.html?id=n` | Single item view with Back to products, Add/Remove |
| Sorting | `/inventory.html` | Dropdown: Name (A to Z), Name (Z to A), Price (low to high), Price (high to low) |
| Cart | `/cart.html` | Line items with QTY, Remove, Continue Shopping, Checkout |
| Checkout Step One | `/checkout-step-one.html` | First Name, Last Name, Zip/Postal Code, Cancel, Continue |
| Checkout Step Two (Overview) | `/checkout-step-two.html` | Payment info, shipping info, Item total, Tax, Total, Cancel, Finish |
| Checkout Complete | `/checkout-complete.html` | "Thank you for your order!" confirmation, Back Home |
| Burger Menu | global | All Items, About, Logout, Reset App State |
| Footer | global | Twitter, Facebook, LinkedIn links and copyright |

### 2.3 Reference Data Captured from the Live Application
**Product catalogue**

| # | Product | Price |
|---|---|---|
| 1 | Sauce Labs Backpack | $29.99 |
| 2 | Sauce Labs Bike Light | $9.99 |
| 3 | Sauce Labs Bolt T-Shirt | $15.99 |
| 4 | Sauce Labs Fleece Jacket | $49.99 |
| 5 | Sauce Labs Onesie | $7.99 |
| 6 | Test.allTheThings() T-Shirt (Red) | $15.99 |

**Verified system messages**

| Condition | Exact text |
|---|---|
| Empty username | `Epic sadface: Username is required` |
| Empty password | `Epic sadface: Password is required` |
| Invalid credentials | `Epic sadface: Username and password do not match any user in this service` |
| Locked-out user | `Epic sadface: Sorry, this user has been locked out.` |
| Unauthenticated deep link | `Epic sadface: You can only access '/inventory.html' when you are logged in.` |
| Missing first name | `Error: First Name is required` |
| Missing last name | `Error: Last Name is required` |
| Missing postal code | `Error: Postal Code is required` |
| Order success | `Thank you for your order!` |

**Verified tax rule:** tax = 8 % of item total, rounded to 2 dp. Example: item total `$29.99` → tax `$2.40` → total `$32.39`.

---

## 3. Test Scope

### 3.1 Features To Be Tested
1. Login / authentication for all six seeded personas
2. Logout and session invalidation
3. Product inventory rendering, images, descriptions and prices
4. Product detail page navigation
5. Product sorting (all four options)
6. Add to cart (single, multiple, all six items)
7. Remove from cart (inventory page, detail page, cart page)
8. Cart badge counter accuracy
9. Shopping cart contents, quantity and pricing
10. Checkout information form and field validation
11. Checkout overview totals, tax and price summary
12. Order completion and confirmation
13. Burger navigation menu (All Items, About, Logout, Reset App State)
14. Error handling and error banner dismissal
15. Session management, refresh, back/forward, deep links
16. Cross-browser, responsive, accessibility and basic security checks

### 3.2 Features Not To Be Tested
| Item | Rationale |
|---|---|
| Real payment gateway / card processing | Not implemented; payment is a static "SauceCard #31337" |
| Order history / order persistence backend | No server-side persistence exists |
| User registration, password reset, email flows | Not present in the application |
| Third-party destinations (saucelabs.com, Twitter, Facebook, LinkedIn) | Out of AUT boundary; only link presence and `target`/`href` are verified |
| Load/stress at production scale | Public demo environment; prohibited by acceptable-use |
| Penetration testing / active exploitation | Not authorised on a third-party host; only passive, read-only security observations are recorded |
| Native mobile applications | Web application only |

---

## 4. Test Strategy

### 4.1 Functional Testing
Black-box, requirement-driven verification of each module using **equivalence partitioning**, **boundary value analysis**, **decision tables** (login outcome matrix) and **state transition testing** (guest → authenticated → cart populated → checkout → order complete). Executed manually first for exploratory value, then codified into the automated regression suite.

### 4.2 UI Testing
Verification of layout, alignment, branding, image-to-product mapping, button states, currency formatting (`$` prefix, 2 decimals), field labels and placeholders, and the sort dropdown label synchronisation. `visual_user` is used deliberately to surface CSS/layout regressions; screenshot-based visual diffing with a 0.2 % pixel threshold is recommended.

### 4.3 Regression Testing
A tagged suite (`@smoke`, `@regression`) is maintained. `@smoke` (~12 tests, < 2 min) runs on every pull request; the full `@regression` suite runs nightly and before every release. Any defect fix is accompanied by a new regression test that reproduces the original failure.

### 4.4 Cross-browser Testing
Matrix execution across Chromium (Chrome/Edge), Firefox (Gecko) and WebKit (Safari) using the same specification files. Priority-1 flows run on all engines; lower-priority flows run on Chromium only to control execution time.

### 4.5 Responsive Testing
Viewport emulation at 1920×1080, 1440×900, 1366×768 (desktop), 768×1024 (tablet portrait) and 375×667 / 390×844 (mobile). Checks: no horizontal scrollbar, burger menu remains reachable, product cards reflow to a single column, checkout form fields remain fully visible and tappable (≥ 44×44 px targets).

### 4.6 Security Testing
Passive, non-intrusive checks only: password field masking, absence of credentials in URL query strings, session storage clearing on logout, enforcement of authenticated-only routes, verification that error messages do not disclose whether a username exists (user enumeration), HTTPS enforcement and HSTS header presence, and inspection of security headers (CSP, X-Content-Type-Options, X-Frame-Options). Input-reflection checks use benign payloads to confirm output encoding, mapped to **OWASP Top 10 A01 (Broken Access Control)**, **A03 (Injection)** and **A07 (Identification & Authentication Failures)**.

### 4.7 Performance Testing
Client-side timing captured via the Navigation Timing API and Lighthouse: Time to First Byte, First Contentful Paint, Largest Contentful Paint and DOM Content Loaded. `performance_glitch_user` is used to validate that the suite reliably detects a degraded (≈ 5 s) login. Thresholds: inventory page LCP ≤ 2.5 s, page transitions ≤ 1 s for `standard_user`.

### 4.8 Accessibility Testing
Automated axe-core scans (WCAG 2.1 AA) on every page, supplemented by manual keyboard-only traversal (Tab/Shift+Tab/Enter/Space/Esc), focus-visible verification, form-label association, image `alt` text, heading hierarchy, colour-contrast ratio ≥ 4.5:1 and screen-reader announcement of the error banner via an ARIA live region.

---

## 5. Test Environment

### 5.1 Browsers
| Browser | Versions | Priority |
|---|---|---|
| Google Chrome | Latest and latest-1 | P1 |
| Microsoft Edge (Chromium) | Latest | P1 |
| Mozilla Firefox | Latest ESR and latest | P2 |
| Apple Safari / WebKit | 17.x and 18.x | P2 |
| Mobile Chrome (Pixel 7) / Mobile Safari (iPhone 14) | Emulated | P3 |

### 5.2 Operating Systems
Windows 11 (primary), Windows 10, macOS Sonoma/Sequoia, Ubuntu 22.04 LTS (CI runners), Android 13+ and iOS 16+ via emulation.

### 5.3 Tooling
Node.js 20 LTS, Playwright 1.4x + TypeScript, Java 17 + Selenium 4 + TestNG (alternative stack), Allure/Playwright HTML reporting, Jira + Xray for test and defect management, GitHub Actions for CI.

### 5.4 Test Data Requirements
**Users** (password for all users: `secret_sauce`)

| Username | Purpose |
|---|---|
| `standard_user` | Golden path, all positive flows |
| `locked_out_user` | Negative authentication |
| `problem_user` | Broken images, non-functional Remove buttons, form field defects |
| `performance_glitch_user` | Slow response / timeout handling |
| `error_user` | Failures during cart and checkout operations |
| `visual_user` | Layout and CSS regressions |

**Checkout data**

| Set | First Name | Last Name | Zip/Postal Code | Intent |
|---|---|---|---|---|
| CD-VALID | John | Doe | 12345 | Valid, typical |
| CD-MIN | A | B | 1 | Lower boundary (1 char) |
| CD-MAX | 50-char string | 50-char string | 10-char string | Upper boundary |
| CD-ALPHA-ZIP | John | Doe | AB1 2CD | UK-format alphanumeric postcode |
| CD-SPACES | (3 spaces) | (3 spaces) | (3 spaces) | Whitespace-only, trimming check |
| CD-SPECIAL | Jöhn-Ö'Neil | D'Souza | 12345 | Unicode / apostrophe / hyphen |
| CD-INJECT | `<script>alert(1)</script>` | `'; DROP TABLE users;--` | 12345 | Output-encoding check |
| CD-EMPTY | (blank) | (blank) | (blank) | Mandatory-field validation |

**Equivalence partitions — Zip/Postal Code**

| Partition | Example | Expected |
|---|---|---|
| Invalid (empty) | `` | `Error: Postal Code is required` |
| Valid numeric | `12345` | Accepted |
| Valid alphanumeric | `AB1 2CD` | Accepted |
| Boundary min (1 char) | `1` | Accepted |
| Boundary max (10+ chars) | `1234567890` | Accepted |

---

## 6. Test Scenarios
Thirteen scenario groups are defined and expanded into executable suites below: **Login, Logout, Product Inventory, Product Sorting, Add to Cart, Remove from Cart, Shopping Cart, Checkout Information, Checkout Overview, Order Completion, Navigation Menu, Error Handling, Session Management**, plus a cross-cutting non-functional suite. Each suite in the *Test Suites* section of this document contains the corresponding step-by-step test cases with preconditions, data and expected results.

---

## 7. Test Cases — Traceability and Priority Matrix

| TC ID | Scenario | Preconditions | Test Data | Priority | Severity |
|---|---|---|---|---|---|
| TC-LGN-001 | Login with valid standard credentials | Login page loaded | standard_user / secret_sauce | High | Critical |
| TC-LGN-002 | Login page UI elements present | Fresh browser | — | Medium | Low |
| TC-LGN-003 | Password field is masked | Login page loaded | secret_sauce | High | Major |
| TC-LGN-004 | Login with empty username and password | Login page loaded | blank / blank | High | Major |
| TC-LGN-005 | Login with username only | Login page loaded | standard_user / blank | High | Major |
| TC-LGN-006 | Login with password only | Login page loaded | blank / secret_sauce | High | Major |
| TC-LGN-007 | Login with invalid password | Login page loaded | standard_user / wrong | High | Critical |
| TC-LGN-008 | Login with non-existent username | Login page loaded | ghost_user / secret_sauce | High | Major |
| TC-LGN-009 | Locked-out user is denied access | Login page loaded | locked_out_user / secret_sauce | High | Critical |
| TC-LGN-010 | Username is case-sensitive | Login page loaded | STANDARD_USER / secret_sauce | Medium | Minor |
| TC-LGN-011 | Leading/trailing whitespace in username | Login page loaded | ` standard_user ` | Medium | Minor |
| TC-LGN-012 | Error banner can be dismissed with X | Error banner displayed | invalid creds | Medium | Minor |
| TC-LGN-013 | Login via Enter key | Credentials entered | standard_user | Medium | Minor |
| TC-LGN-014 | problem_user logs in (defect persona) | Login page loaded | problem_user | Medium | Major |
| TC-LGN-015 | performance_glitch_user login latency | Login page loaded | performance_glitch_user | Medium | Major |
| TC-LGN-016 | Credentials are not exposed in URL | Login submitted | standard_user | High | Critical |
| TC-LGN-017 | Injection payload in username is rejected safely | Login page loaded | CD-INJECT | High | Critical |
| TC-OUT-001 | Logout returns user to login page | Logged in | — | High | Critical |
| TC-OUT-002 | Back button after logout does not restore session | Logged out | — | High | Critical |
| TC-OUT-003 | Cart is cleared/session invalidated after logout | Item in cart, logged out | Backpack | Medium | Major |
| TC-INV-001 | Six products are displayed | Logged in | — | High | Critical |
| TC-INV-002 | Product names, prices and descriptions are correct | Logged in | Catalogue table | High | Major |
| TC-INV-003 | All product images load and match the product | Logged in | — | Medium | Major |
| TC-INV-004 | Product name link opens the detail page | Logged in | Backpack | High | Major |
| TC-INV-005 | Back to products returns to inventory | On detail page | — | Medium | Minor |
| TC-INV-006 | Prices are formatted with 2 decimals | Logged in | — | Low | Minor |
| TC-INV-007 | problem_user shows incorrect/duplicated images | problem_user logged in | — | Medium | Major |
| TC-SRT-001 | Sort by Name (A to Z) | On inventory | — | High | Major |
| TC-SRT-002 | Sort by Name (Z to A) | On inventory | — | High | Major |
| TC-SRT-003 | Sort by Price (low to high) | On inventory | — | High | Major |
| TC-SRT-004 | Sort by Price (high to low) | On inventory | — | High | Major |
| TC-SRT-005 | Sort selection persists after navigation | Sort applied | — | Medium | Minor |
| TC-SRT-006 | Default sort is Name (A to Z) | Fresh login | — | Medium | Minor |
| TC-ADD-001 | Add a single item to the cart | On inventory | Backpack | High | Critical |
| TC-ADD-002 | Add multiple items and verify badge | On inventory | 3 items | High | Critical |
| TC-ADD-003 | Add all six items | On inventory | All | Medium | Major |
| TC-ADD-004 | Add from the product detail page | On detail page | Bike Light | High | Major |
| TC-ADD-005 | Button toggles to Remove after adding | On inventory | Onesie | Medium | Minor |
| TC-ADD-006 | Cart badge is absent when the cart is empty | Fresh login | — | Medium | Minor |
| TC-REM-001 | Remove an item from the inventory page | 1 item in cart | Backpack | High | Critical |
| TC-REM-002 | Remove an item from the cart page | 2 items in cart | Bike Light | High | Critical |
| TC-REM-003 | Remove an item from the detail page | 1 item in cart | Fleece Jacket | Medium | Major |
| TC-REM-004 | Remove all items empties the cart | 3 items in cart | — | High | Major |
| TC-CRT-001 | Cart lists the correct items, prices and QTY | 2 items in cart | — | High | Critical |
| TC-CRT-002 | Continue Shopping returns to inventory | On cart page | — | Medium | Minor |
| TC-CRT-003 | Cart contents persist across navigation | 1 item in cart | — | High | Major |
| TC-CRT-004 | Checkout from an empty cart | Empty cart | — | Medium | Major |
| TC-CRT-005 | Cart icon opens the cart page | Logged in | — | High | Major |
| TC-CHK-001 | Checkout with valid information | 1 item in cart | CD-VALID | High | Critical |
| TC-CHK-002 | First Name required validation | On step one | CD-EMPTY | High | Major |
| TC-CHK-003 | Last Name required validation | First name entered | — | High | Major |
| TC-CHK-004 | Postal Code required validation | Names entered | — | High | Major |
| TC-CHK-005 | Cancel returns to the cart | On step one | — | Medium | Minor |
| TC-CHK-006 | Boundary values in checkout fields | On step one | CD-MIN / CD-MAX | Medium | Minor |
| TC-CHK-007 | Whitespace-only input is rejected | On step one | CD-SPACES | Medium | Major |
| TC-CHK-008 | Special/Unicode characters accepted | On step one | CD-SPECIAL | Low | Minor |
| TC-CHK-009 | Injection payload is safely encoded | On step one | CD-INJECT | High | Critical |
| TC-OVW-001 | Overview lists all cart items | Step one completed | 2 items | High | Critical |
| TC-OVW-002 | Item total equals the sum of item prices | On overview | 2 items | High | Critical |
| TC-OVW-003 | Tax equals 8 % of the item total | On overview | $29.99 → $2.40 | High | Critical |
| TC-OVW-004 | Total equals item total plus tax | On overview | $32.39 | High | Critical |
| TC-OVW-005 | Payment and shipping information displayed | On overview | — | Medium | Minor |
| TC-OVW-006 | Cancel from overview returns to inventory | On overview | — | Medium | Minor |
| TC-ORD-001 | Finish completes the order | On overview | — | High | Critical |
| TC-ORD-002 | Cart badge resets after order completion | Order placed | — | High | Major |
| TC-ORD-003 | Back Home returns to the inventory page | On complete page | — | Medium | Minor |
| TC-NAV-001 | Burger menu opens and closes | Logged in | — | Medium | Minor |
| TC-NAV-002 | All Items navigates to inventory | On cart page | — | Medium | Major |
| TC-NAV-003 | About navigates to saucelabs.com | Logged in | — | Low | Minor |
| TC-NAV-004 | Reset App State clears the cart | 2 items in cart | — | Medium | Major |
| TC-NAV-005 | Footer social links are present and correct | Logged in | — | Low | Minor |
| TC-SES-001 | Direct URL access without login is blocked | Logged out | /inventory.html | High | Critical |
| TC-SES-002 | Direct checkout URL access without login is blocked | Logged out | /checkout-step-one.html | High | Critical |
| TC-SES-003 | Page refresh preserves cart and session | 1 item in cart | — | High | Major |
| TC-SES-004 | Browser back/forward during checkout | Mid-checkout | — | Medium | Major |
| TC-NFR-001 | Keyboard-only end-to-end purchase | Logged out | — | Medium | Major |
| TC-NFR-002 | axe-core WCAG 2.1 AA scan on all pages | Logged in | — | Medium | Major |
| TC-NFR-003 | Responsive layout at 375 px width | Logged in | — | Medium | Major |
| TC-NFR-004 | Inventory page load performance budget | Logged in | — | Medium | Minor |

**Priority definition** — *High*: blocks the core revenue flow or security; *Medium*: impacts usability or a secondary flow; *Low*: cosmetic.
**Severity definition** — *Critical*: no workaround, flow blocked; *Major*: significant impairment with a workaround; *Minor*: cosmetic or low impact.

---

## 8. Negative Test Cases

| ID | Negative condition | Input | Expected result |
|---|---|---|---|
| NEG-01 | Invalid username and password | `ghost_user` / `bad_pass` | `Epic sadface: Username and password do not match any user in this service`; user remains on `/` |
| NEG-02 | Valid username, invalid password | `standard_user` / `wrong` | Same generic message (no user enumeration) |
| NEG-03 | Empty username and password | blank / blank | `Epic sadface: Username is required` |
| NEG-04 | Empty password only | `standard_user` / blank | `Epic sadface: Password is required` |
| NEG-05 | Empty username only | blank / `secret_sauce` | `Epic sadface: Username is required` |
| NEG-06 | Locked-out user | `locked_out_user` / `secret_sauce` | `Epic sadface: Sorry, this user has been locked out.`; no redirect |
| NEG-07 | Case-altered username | `Standard_User` | Login rejected with the generic mismatch message |
| NEG-08 | Whitespace-padded username | `  standard_user  ` | Behaviour recorded; rejection expected unless trimming is specified |
| NEG-09 | SQL-injection payload | `' OR '1'='1` | Login rejected; no stack trace, no data disclosure |
| NEG-10 | XSS payload in username | `<script>alert(1)</script>` | Rendered as inert text; no dialog fires |
| NEG-11 | Over-long input (1000 chars) | 1000-char username | Graceful rejection; no crash or layout break |
| NEG-12 | Checkout with all fields empty | blank | `Error: First Name is required` |
| NEG-13 | Checkout missing last name | `John` / blank / `12345` | `Error: Last Name is required` |
| NEG-14 | Checkout missing postal code | `John` / `Doe` / blank | `Error: Postal Code is required` |
| NEG-15 | Checkout with whitespace-only values | 3 spaces in each field | Should be rejected; if accepted, raise a validation defect |
| NEG-16 | Checkout XSS payload | CD-INJECT | Value echoed as encoded text on the overview page; no script execution |
| NEG-17 | Checkout with an empty cart | no items | Order should not be creatable; defect if `Finish` succeeds with a `$0.00` total |
| NEG-18 | Session timeout / cookie deletion mid-flow | delete session storage, then act | Redirect to login with the access-restriction message |
| NEG-19 | Deep link to `/inventory.html` while logged out | direct URL | `Epic sadface: You can only access '/inventory.html' when you are logged in.` |
| NEG-20 | Deep link to `/checkout-step-two.html` while logged out | direct URL | Equivalent access-restriction message |
| NEG-21 | Browser refresh on the checkout overview page | F5 | Page state preserved or a safe redirect; no duplicate order |
| NEG-22 | Browser back after order completion | Back | No duplicate order is created |
| NEG-23 | Back button after logout | Back | Session is not restored; login page is shown |
| NEG-24 | `problem_user` remove buttons | click Remove | Known defect: item not removed — must be detected |
| NEG-25 | `error_user` checkout | complete checkout | Known defect: operation fails — must be detected and reported |

---

## 9. Automation Strategy

### 9.1 Automation Scope
**In scope:** all High-priority functional cases, the full smoke suite, sorting arithmetic, cart and pricing calculations, checkout validation, session guards, cross-browser matrix, axe-core accessibility scans and responsive viewport checks — approximately **80 %** of the total case inventory.
**Out of scope:** exploratory testing, subjective visual/aesthetic judgement, one-off usability studies and any case requiring manual environment manipulation.

### 9.2 Recommended Framework

**Primary — Playwright + TypeScript**
- Native cross-browser support (Chromium, Firefox, WebKit) from one codebase
- Auto-waiting and web-first assertions eliminate flaky explicit sleeps
- Built-in trace viewer, video and screenshot artefacts for triage
- `storageState` reuse to bypass repeated logins and cut suite runtime
- Parallel execution via workers and sharding
- Prefer `data-test` locators already present in the DOM (`[data-test="username"]`, `[data-test="add-to-cart-sauce-labs-backpack"]`, `[data-test="error"]`)

**Alternative — Selenium 4 + Java 17 + TestNG**
- Suitable where an existing Java ecosystem, Selenium Grid or enterprise standard mandates it
- Maven build, WebDriverManager for driver resolution, TestNG `@DataProvider` for data-driven login and checkout cases, `ITestListener` for screenshot-on-failure, Allure for reporting

### 9.3 Page Object Model Design
```
src/
  pages/
    BasePage.ts            // navigation, waits, common header/footer actions
    LoginPage.ts           // login(), getErrorMessage(), dismissError()
    InventoryPage.ts       // sortBy(), addToCart(name), getProductNames/Prices()
    ProductDetailPage.ts   // addToCart(), backToProducts()
    CartPage.ts            // getItems(), removeItem(name), checkout()
    CheckoutStepOnePage.ts // fillInformation(), continue(), cancel()
    CheckoutStepTwoPage.ts // getItemTotal(), getTax(), getTotal(), finish()
    CheckoutCompletePage.ts// getHeader(), backHome()
    components/HeaderComponent.ts, BurgerMenuComponent.ts
  fixtures/  authFixture.ts, testData.ts
  utils/     priceUtils.ts, axeHelper.ts
tests/
  login/  inventory/  cart/  checkout/  e2e/  a11y/
```
Principles: one class per page; locators private and centralised; methods express user intent and return page objects to enable fluent chaining; **no assertions inside page objects** — all assertions live in specs; test data externalised to fixtures; a custom `authFixture` injects a pre-authenticated context.

### 9.4 CI/CD Integration — GitHub Actions
```yaml
name: E2E Regression
on:
  pull_request:
  push: { branches: [main] }
  schedule: [{ cron: '0 2 * * *' }]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        project: [chromium, firefox, webkit]
        shard: [1, 2]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.project }}
      - run: npx playwright test --project=${{ matrix.project }} --shard=${{ matrix.shard }}/2
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-${{ matrix.project }}-${{ matrix.shard }}
          path: playwright-report/
          retention-days: 14
```
Gating: `@smoke` must pass before merge; the nightly full matrix publishes an HTML report and auto-raises a Jira ticket on failure. Credentials are stored as GitHub Secrets, never committed. Flaky tests are quarantined with `test.fixme` and tracked to resolution rather than being retried indefinitely.

---

## 10. Entry and Exit Criteria

### 10.1 Entry Criteria
1. Test plan reviewed and signed off by the QA Lead and Product Owner.
2. Application build deployed and reachable at the test URL; smoke check passes.
3. Requirements/user stories baselined; acceptance criteria available.
4. Test environment, browsers, drivers and test data provisioned.
5. Test cases written, peer-reviewed and linked to requirements in Xray.
6. Defect tracking workflow configured and accessible to the team.

### 10.2 Exit Criteria
1. 100 % of planned High-priority test cases executed.
2. ≥ 95 % overall pass rate; ≥ 98 % for High-priority cases.
3. Zero open Critical or High-severity defects; open Medium/Low defects triaged and accepted by the Product Owner with documented workarounds.
4. Requirement traceability coverage ≥ 95 %.
5. Regression suite green on the last three consecutive nightly runs.
6. No Critical or Serious axe-core accessibility violations outstanding.
7. Test summary report published and signed off.

---

## 11. Risk Analysis

| ID | Risk | Likelihood | Impact | Exposure | Mitigation |
|---|---|---|---|---|---|
| R1 | Public demo site availability/outage blocks execution | Medium | High | High | Maintain a local Docker mirror of the app; retry with backoff; schedule off-peak runs |
| R2 | Client-side-only state causes non-deterministic cart data | Medium | Medium | Medium | Reset app state and clear storage in `beforeEach`; isolate browser contexts per test |
| R3 | Flaky tests from animations and dynamic rendering | High | Medium | High | Web-first assertions, no hard sleeps, quarantine + root-cause policy |
| R4 | Deliberate persona defects mistaken for automation bugs | Medium | Medium | Medium | Document expected persona behaviour; assert on known defects explicitly |
| R5 | Cross-browser rendering differences (WebKit) | Medium | Medium | Medium | Run the full matrix nightly; browser-specific expectations where justified |
| R6 | Test data collisions during parallel execution | Medium | Medium | Medium | Independent contexts per worker; no shared mutable data |
| R7 | Schedule compression reduces regression depth | Medium | High | High | Risk-based prioritisation; protect the High-priority subset |
| R8 | Application UI changes break locators | Medium | Medium | Medium | Rely on stable `data-test` attributes; centralise locators in page objects |
| R9 | Limited security testing permitted on a third-party host | High | Low | Medium | Restrict to passive checks; document scope limitation formally |
| R10 | Key QA resource unavailability | Low | Medium | Low | Cross-training, documented runbooks, peer review of all artefacts |

---

## 12. Deliverables

| # | Deliverable | Owner | Timing |
|---|---|---|---|
| D1 | Master Test Plan (this document) | QA Lead | Planning phase |
| D2 | Test scenarios and detailed test cases (Xray) | QA Engineers | Before execution |
| D3 | Requirement Traceability Matrix (RTM) | QA Lead | Before execution, updated continuously |
| D4 | Test data sets and fixtures | QA Engineers | Before execution |
| D5 | Automation framework (POM) and spec files | SDET | Sprint-by-sprint |
| D6 | CI/CD pipeline configuration | SDET / DevOps | Before execution |
| D7 | Test execution reports (HTML/Allure), traces, videos | CI | Per run |
| D8 | Defect reports and triage log | QA Team | Continuous |
| D9 | Accessibility (axe) and performance (Lighthouse) reports | QA Engineers | Per cycle |
| D10 | Test Summary / Closure Report with metrics and sign-off | QA Lead | End of cycle |

---

## 13. Test Metrics

| Metric | Formula | Target |
|---|---|---|
| Test case execution rate | (Executed / Planned) × 100 | 100 % |
| Test case pass rate | (Passed / Executed) × 100 | ≥ 95 % |
| Requirement coverage | (Requirements with ≥ 1 test / Total) × 100 | ≥ 95 % |
| Automation coverage | (Automated / Automatable) × 100 | ≥ 80 % |
| Defect density | Defects / module | Monitored, trend down |
| Defect detection percentage (DDP) | (Defects found in test / Total defects) × 100 | ≥ 90 % |
| Defect leakage | (Production defects / Total defects) × 100 | ≤ 5 % |
| Defect removal efficiency (DRE) | (Pre-release / (Pre + Post)) × 100 | ≥ 95 % |
| Defect reopen rate | (Reopened / Fixed) × 100 | ≤ 5 % |
| Test flakiness rate | (Flaky runs / Total runs) × 100 | ≤ 2 % |
| Mean time to detect (MTTD) | Avg. commit → failure detected | ≤ 30 min |
| Suite execution time | Wall clock, full regression | ≤ 15 min sharded |
| Critical/High open defects at exit | Count | 0 |

---

## 14. Defect Management Process

### 14.1 Lifecycle
`New → Assigned → In Progress → Fixed → Ready for Retest → Retest → Closed`, with side transitions to `Reopened`, `Deferred`, `Duplicate` and `Rejected / Not a Bug`.

### 14.2 Severity vs Priority Matrix
| Severity | Definition | Typical Priority | Target Fix SLA |
|---|---|---|---|
| S1 – Critical | Core flow blocked (cannot log in, cannot place order), data loss, security breach | P1 | 24 hours |
| S2 – Major | Major function impaired with a workaround (wrong tax, sorting incorrect) | P1/P2 | 3 business days |
| S3 – Minor | Limited impact (misaligned layout, unclear message) | P3 | Next release |
| S4 – Cosmetic | Typographical or purely visual, no functional impact | P4 | Backlog |

### 14.3 Mandatory Defect Report Fields
Title (concise, `[Module] symptom`), environment (browser, version, OS, viewport, build), test case ID, preconditions, exact reproduction steps, actual vs expected result, severity, priority, evidence (screenshot, Playwright trace, video, console log, HAR), reproducibility rate and assignee.

### 14.4 Triage and Governance
A daily triage attended by the QA Lead, Development Lead and Product Owner sets severity/priority and assignment. Aged S1/S2 defects are escalated to engineering management after the SLA. Every fixed defect requires a retest plus a targeted regression test added to the automated suite. Defects reopened more than twice trigger a root-cause analysis. Deferred defects require written Product Owner approval and are re-reviewed at the next release planning session.

---

## 15. Test Suites and Executable Test Cases
The suites below contain the step-by-step, executable form of the scenarios in Section 6 and the cases in Section 7. Every test assumes a fresh browser context with cleared storage unless the preconditions state otherwise, and each test is independent and may be run in any order.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-LGN-001 Login with valid standard credentials

**File:** `tests/login/valid-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: The login page is displayed with the 'Swag Labs' logo
    - expect: Username, Password fields and the Login button are visible
  2. Enter 'standard_user' in the Username field
    - expect: The typed value is visible in the Username field
  3. Enter 'secret_sauce' in the Password field
    - expect: The characters are masked as dots
  4. Click the Login button
    - expect: The URL becomes https://www.saucedemo.com/inventory.html
    - expect: The page header shows 'Products'
    - expect: The app logo reads 'Swag Labs'
    - expect: Six product cards are displayed

#### 1.2. TC-LGN-002 Login page UI elements are present and correct

**File:** `tests/login/login-page-ui.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: The 'Swag Labs' bot logo image is displayed
    - expect: The Username field shows the placeholder 'Username'
    - expect: The Password field shows the placeholder 'Password'
    - expect: The Login button is enabled
  2. Read the accepted credentials help panel
    - expect: The panel lists standard_user, locked_out_user, problem_user, performance_glitch_user, error_user and visual_user
    - expect: The password panel states 'Password for all users: secret_sauce'

#### 1.3. TC-LGN-003 Password field masks the entered value

**File:** `tests/login/password-masking.spec.ts`

**Steps:**
  1. Navigate to the login page and type 'secret_sauce' into the Password field
    - expect: The input element has type='password'
    - expect: The value is rendered as dots and is not readable on screen

#### 1.4. TC-LGN-004 Login with both fields empty

**File:** `tests/login/empty-credentials.spec.ts`

**Steps:**
  1. Navigate to the login page and click Login without entering any data
    - expect: The error banner displays exactly 'Epic sadface: Username is required'
    - expect: The URL remains https://www.saucedemo.com/
    - expect: Both input fields are highlighted with an error state

#### 1.5. TC-LGN-005 Login with username only

**File:** `tests/login/empty-password.spec.ts`

**Steps:**
  1. Enter 'standard_user' in the Username field, leave the Password field blank and click Login
    - expect: The error banner displays exactly 'Epic sadface: Password is required'
    - expect: The user is not redirected

#### 1.6. TC-LGN-006 Login with password only

**File:** `tests/login/empty-username.spec.ts`

**Steps:**
  1. Leave the Username field blank, enter 'secret_sauce' in the Password field and click Login
    - expect: The error banner displays exactly 'Epic sadface: Username is required'
    - expect: The user is not redirected

#### 1.7. TC-LGN-007 Login with a valid username and an invalid password

**File:** `tests/login/invalid-password.spec.ts`

**Steps:**
  1. Enter 'standard_user' / 'wrong_password' and click Login
    - expect: The error banner displays 'Epic sadface: Username and password do not match any user in this service'
    - expect: The message does not reveal that the username exists
    - expect: The URL remains https://www.saucedemo.com/

#### 1.8. TC-LGN-008 Login with a non-existent username

**File:** `tests/login/unknown-user.spec.ts`

**Steps:**
  1. Enter 'ghost_user' / 'secret_sauce' and click Login
    - expect: The error banner displays 'Epic sadface: Username and password do not match any user in this service'
    - expect: The message is identical to the invalid-password message, preventing user enumeration

#### 1.9. TC-LGN-009 Locked-out user is denied access

**File:** `tests/login/locked-out-user.spec.ts`

**Steps:**
  1. Enter 'locked_out_user' / 'secret_sauce' and click Login
    - expect: The error banner displays exactly 'Epic sadface: Sorry, this user has been locked out.'
    - expect: The user remains on the login page
    - expect: No session is created and /inventory.html is not reachable

#### 1.10. TC-LGN-010 Username is treated as case-sensitive

**File:** `tests/login/username-case-sensitivity.spec.ts`

**Steps:**
  1. Enter 'STANDARD_USER' / 'secret_sauce' and click Login
    - expect: Login is rejected with the generic credential-mismatch message
    - expect: The behaviour is consistent for 'Standard_User'

#### 1.11. TC-LGN-011 Username with leading and trailing whitespace

**File:** `tests/login/username-whitespace.spec.ts`

**Steps:**
  1. Enter '  standard_user  ' (with surrounding spaces) / 'secret_sauce' and click Login
    - expect: The actual behaviour is recorded
    - expect: If input trimming is not specified, login is rejected with the credential-mismatch message and no crash occurs

#### 1.12. TC-LGN-012 Error banner can be dismissed

**File:** `tests/login/dismiss-error.spec.ts`

**Steps:**
  1. Trigger an error by clicking Login with empty fields
    - expect: The error banner is displayed
  2. Click the 'X' close button on the error banner
    - expect: The error banner is removed from the DOM
    - expect: The input fields return to their normal state

#### 1.13. TC-LGN-013 Login can be submitted with the Enter key

**File:** `tests/login/login-with-enter-key.spec.ts`

**Steps:**
  1. Enter valid credentials and press Enter while focus is in the Password field
    - expect: The form is submitted
    - expect: The inventory page is displayed

#### 1.14. TC-LGN-014 problem_user login exposes known UI defects

**File:** `tests/login/problem-user.spec.ts`

**Steps:**
  1. Log in as 'problem_user' / 'secret_sauce'
    - expect: The inventory page is reached
  2. Inspect all product images and their src attributes
    - expect: The known defect is detected: images are identical or incorrect for the products
    - expect: A defect record is raised referencing the affected products

#### 1.15. TC-LGN-015 performance_glitch_user login latency is measured

**File:** `tests/login/performance-glitch-user.spec.ts`

**Steps:**
  1. Record the timestamp, log in as 'performance_glitch_user' / 'secret_sauce' and record the time when the inventory page renders
    - expect: Login eventually succeeds
    - expect: The elapsed time is significantly higher than for standard_user (approximately 5 seconds)
    - expect: The measured duration is reported against the performance budget

#### 1.16. TC-LGN-016 Credentials are never exposed in the URL

**File:** `tests/login/no-credentials-in-url.spec.ts`

**Steps:**
  1. Log in with valid credentials and inspect the resulting URL and browser history
    - expect: The URL contains no username or password query parameters
    - expect: The request is submitted over HTTPS

#### 1.17. TC-LGN-017 Injection payloads in the login form are handled safely

**File:** `tests/login/injection-payloads.spec.ts`

**Steps:**
  1. Enter "' OR '1'='1" as the username and "' OR '1'='1" as the password, then click Login
    - expect: Login is rejected
    - expect: No stack trace, database error or unexpected data is displayed
  2. Enter '<script>alert(1)</script>' as the username and click Login
    - expect: No JavaScript dialog appears
    - expect: The payload is rendered as inert text if echoed
    - expect: The application remains stable

### 2. Logout

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-OUT-001 Logout returns the user to the login page

**File:** `tests/logout/logout.spec.ts`

**Steps:**
  1. Log in as standard_user and click the 'Open Menu' burger button
    - expect: The side menu opens showing All Items, About, Logout and Reset App State
  2. Click 'Logout'
    - expect: The URL returns to https://www.saucedemo.com/
    - expect: The Username and Password fields are displayed and empty

#### 2.2. TC-OUT-002 Browser back after logout does not restore the session

**File:** `tests/logout/back-after-logout.spec.ts`

**Steps:**
  1. Log in, then log out via the burger menu
    - expect: The login page is displayed
  2. Press the browser Back button
    - expect: The inventory page content is not restored
    - expect: The login page is shown or the access-restriction error is displayed

#### 2.3. TC-OUT-003 Session and cart state are cleared on logout

**File:** `tests/logout/session-cleared-on-logout.spec.ts`

**Steps:**
  1. Log in, add 'Sauce Labs Backpack' to the cart and log out
    - expect: The login page is displayed
  2. Log in again as standard_user
    - expect: The cart badge state is verified and any residual cart contents are reported as a defect if session isolation is required

### 3. Product Inventory

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-INV-001 Inventory displays exactly six products

**File:** `tests/inventory/product-count.spec.ts`

**Steps:**
  1. Log in as standard_user
    - expect: The inventory page is displayed with the title 'Products'
    - expect: Exactly 6 product cards are rendered
    - expect: Each card shows an image, a name, a description, a price and an 'Add to cart' button

#### 3.2. TC-INV-002 Product names, prices and descriptions are correct

**File:** `tests/inventory/product-details.spec.ts`

**Steps:**
  1. Read the name and price of every product card
    - expect: Sauce Labs Backpack is $29.99
    - expect: Sauce Labs Bike Light is $9.99
    - expect: Sauce Labs Bolt T-Shirt is $15.99
    - expect: Sauce Labs Fleece Jacket is $49.99
    - expect: Sauce Labs Onesie is $7.99
    - expect: Test.allTheThings() T-Shirt (Red) is $15.99
  2. Read each product description
    - expect: Every product has a non-empty description matching the catalogue baseline

#### 3.3. TC-INV-003 All product images load and match their product

**File:** `tests/inventory/product-images.spec.ts`

**Steps:**
  1. Inspect each product image element
    - expect: Every image has naturalWidth greater than 0 (no broken images)
    - expect: Each image alt text matches its product name
    - expect: No two products share the same image source

#### 3.4. TC-INV-004 Product name link opens the product detail page

**File:** `tests/inventory/open-product-detail.spec.ts`

**Steps:**
  1. Click the product name 'Sauce Labs Backpack'
    - expect: The URL contains inventory-item.html
    - expect: The detail page shows the name, full description and price $29.99
    - expect: An 'Add to cart' button and a 'Back to products' button are present

#### 3.5. TC-INV-005 Back to products returns to the inventory

**File:** `tests/inventory/back-to-products.spec.ts`

**Steps:**
  1. Open any product detail page and click 'Back to products'
    - expect: The URL returns to /inventory.html
    - expect: All six products are displayed again

#### 3.6. TC-INV-006 Prices are formatted consistently

**File:** `tests/inventory/price-format.spec.ts`

**Steps:**
  1. Read every displayed price on the inventory page
    - expect: Every price matches the pattern $ followed by digits and exactly two decimal places

#### 3.7. TC-INV-007 problem_user image defect is detected

**File:** `tests/inventory/problem-user-images.spec.ts`

**Steps:**
  1. Log in as problem_user and compare each image source with the expected product image
    - expect: The mismatch is detected and reported
    - expect: The test fails deliberately, confirming the assertion is effective

### 4. Product Sorting

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-SRT-006 Default sort order is Name (A to Z)

**File:** `tests/sorting/default-sort.spec.ts`

**Steps:**
  1. Log in as standard_user and read the sort dropdown label and product order
    - expect: The dropdown displays 'Name (A to Z)'
    - expect: Products are ordered ascending by name starting with 'Sauce Labs Backpack'

#### 4.2. TC-SRT-001 Sort by Name (A to Z)

**File:** `tests/sorting/name-asc.spec.ts`

**Steps:**
  1. Select 'Name (Z to A)' and then re-select 'Name (A to Z)' from the sort dropdown
    - expect: Product names are displayed in ascending alphabetical order
    - expect: The displayed order equals the locally sorted copy of the same list

#### 4.3. TC-SRT-002 Sort by Name (Z to A)

**File:** `tests/sorting/name-desc.spec.ts`

**Steps:**
  1. Select 'Name (Z to A)' from the sort dropdown
    - expect: Product names are displayed in descending alphabetical order
    - expect: 'Test.allTheThings() T-Shirt (Red)' appears first

#### 4.4. TC-SRT-003 Sort by Price (low to high)

**File:** `tests/sorting/price-asc.spec.ts`

**Steps:**
  1. Select 'Price (low to high)' from the sort dropdown
    - expect: Prices are ordered ascending: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99
    - expect: The first card is 'Sauce Labs Onesie' at $7.99

#### 4.5. TC-SRT-004 Sort by Price (high to low)

**File:** `tests/sorting/price-desc.spec.ts`

**Steps:**
  1. Select 'Price (high to low)' from the sort dropdown
    - expect: Prices are ordered descending: $49.99, $29.99, $15.99, $15.99, $9.99, $7.99
    - expect: The first card is 'Sauce Labs Fleece Jacket' at $49.99

#### 4.6. TC-SRT-005 Sort selection persists across navigation

**File:** `tests/sorting/sort-persistence.spec.ts`

**Steps:**
  1. Select 'Price (high to low)', open a product detail page and click 'Back to products'
    - expect: The dropdown still displays 'Price (high to low)'
    - expect: The product order is still descending by price

### 5. Add to Cart

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-ADD-006 Cart badge is absent for an empty cart

**File:** `tests/cart/empty-cart-badge.spec.ts`

**Steps:**
  1. Log in as standard_user and inspect the cart icon
    - expect: No numeric badge is rendered on the cart icon

#### 5.2. TC-ADD-001 Add a single item to the cart

**File:** `tests/cart/add-single-item.spec.ts`

**Steps:**
  1. Click 'Add to cart' on 'Sauce Labs Backpack'
    - expect: The cart badge displays '1'
    - expect: The button label for that product changes to 'Remove'
  2. Open the cart page
    - expect: 'Sauce Labs Backpack' is listed once with QTY 1 and price $29.99

#### 5.3. TC-ADD-002 Add multiple items and verify the badge count

**File:** `tests/cart/add-multiple-items.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack', 'Sauce Labs Bike Light' and 'Sauce Labs Onesie' to the cart
    - expect: The cart badge increments to 1, then 2, then 3
    - expect: All three product buttons display 'Remove'
  2. Open the cart page
    - expect: All three products are listed with QTY 1 each
    - expect: Prices $29.99, $9.99 and $7.99 are shown correctly

#### 5.4. TC-ADD-003 Add all six products to the cart

**File:** `tests/cart/add-all-items.spec.ts`

**Steps:**
  1. Click 'Add to cart' on every product card
    - expect: The cart badge displays '6'
    - expect: Every product button displays 'Remove'
  2. Open the cart page
    - expect: Six line items are listed matching the full catalogue

#### 5.5. TC-ADD-004 Add to cart from the product detail page

**File:** `tests/cart/add-from-detail-page.spec.ts`

**Steps:**
  1. Open the detail page for 'Sauce Labs Bike Light' and click 'Add to cart'
    - expect: The cart badge displays '1'
    - expect: The button changes to 'Remove'
  2. Click 'Back to products'
    - expect: The 'Sauce Labs Bike Light' card on the inventory page also shows 'Remove'
    - expect: The badge still displays '1'

#### 5.6. TC-ADD-005 Add/Remove button toggle state is consistent

**File:** `tests/cart/button-toggle-state.spec.ts`

**Steps:**
  1. Click 'Add to cart' on 'Sauce Labs Onesie'
    - expect: The button label becomes 'Remove'
  2. Click 'Remove' on the same product
    - expect: The button label returns to 'Add to cart'
    - expect: The cart badge is no longer displayed

### 6. Remove from Cart

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC-REM-001 Remove an item from the inventory page

**File:** `tests/cart/remove-from-inventory.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack' to the cart, then click 'Remove' on the same card
    - expect: The button reverts to 'Add to cart'
    - expect: The cart badge disappears
  2. Open the cart page
    - expect: The cart is empty and no line items are displayed

#### 6.2. TC-REM-002 Remove an item from the cart page

**File:** `tests/cart/remove-from-cart-page.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light', then open the cart page
    - expect: Two line items are listed and the badge displays '2'
  2. Click 'Remove' on the 'Sauce Labs Bike Light' row
    - expect: The row is removed from the cart
    - expect: The badge decrements to '1'
    - expect: 'Sauce Labs Backpack' remains in the cart

#### 6.3. TC-REM-003 Remove an item from the product detail page

**File:** `tests/cart/remove-from-detail-page.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Fleece Jacket' from the inventory page and open its detail page
    - expect: The detail page shows a 'Remove' button
  2. Click 'Remove' on the detail page
    - expect: The button changes to 'Add to cart'
    - expect: The cart badge is no longer displayed

#### 6.4. TC-REM-004 Removing all items empties the cart

**File:** `tests/cart/remove-all-items.spec.ts`

**Steps:**
  1. Add three products, open the cart page and remove each item one by one
    - expect: The badge decrements after each removal and disappears after the last one
    - expect: The cart page shows no line items
    - expect: The Checkout button remains visible for the empty-cart negative test

### 7. Shopping Cart

**Seed:** `tests/seed.spec.ts`

#### 7.1. TC-CRT-005 Cart icon navigates to the cart page

**File:** `tests/cart/open-cart.spec.ts`

**Steps:**
  1. Log in as standard_user and click the shopping cart icon
    - expect: The URL becomes https://www.saucedemo.com/cart.html
    - expect: The page title 'Your Cart' and the QTY/Description column headers are displayed

#### 7.2. TC-CRT-001 Cart displays correct items, quantities and prices

**File:** `tests/cart/cart-contents.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack' and 'Sauce Labs Onesie' and open the cart page
    - expect: Two rows are shown with QTY 1 each
    - expect: Prices $29.99 and $7.99 are displayed
    - expect: Each row has a Remove button
    - expect: Continue Shopping and Checkout buttons are present

#### 7.3. TC-CRT-002 Continue Shopping returns to the inventory

**File:** `tests/cart/continue-shopping.spec.ts`

**Steps:**
  1. Open the cart page with one item and click 'Continue Shopping'
    - expect: The URL returns to /inventory.html
    - expect: The cart badge still displays '1'

#### 7.4. TC-CRT-003 Cart contents persist across navigation

**File:** `tests/cart/cart-persistence.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack', navigate to a product detail page, back to products and then to the cart
    - expect: The item is still present in the cart
    - expect: The badge consistently displays '1' on every page

#### 7.5. TC-CRT-004 Attempt to checkout with an empty cart

**File:** `tests/cart/checkout-empty-cart.spec.ts`

**Steps:**
  1. Open the cart page with no items and click 'Checkout'
    - expect: The observed behaviour is recorded
  2. Complete the checkout form with valid data and continue to the overview
    - expect: No line items are shown and the item total is $0.00
    - expect: If the order can be completed with an empty cart, a Major defect is raised for missing validation

### 8. Checkout Information

**Seed:** `tests/seed.spec.ts`

#### 8.1. TC-CHK-001 Checkout with valid information

**File:** `tests/checkout/valid-checkout-info.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack', open the cart and click 'Checkout'
    - expect: The URL becomes /checkout-step-one.html
    - expect: The header reads 'Checkout: Your Information'
    - expect: First Name, Last Name and Zip/Postal Code fields are displayed
  2. Enter First Name 'John', Last Name 'Doe', Zip/Postal Code '12345' and click Continue
    - expect: The URL becomes /checkout-step-two.html
    - expect: The header reads 'Checkout: Overview'
    - expect: No validation error is displayed

#### 8.2. TC-CHK-002 First Name is mandatory

**File:** `tests/checkout/first-name-required.spec.ts`

**Steps:**
  1. On the checkout information page, click Continue with all fields empty
    - expect: The error banner displays exactly 'Error: First Name is required'
    - expect: The user remains on /checkout-step-one.html

#### 8.3. TC-CHK-003 Last Name is mandatory

**File:** `tests/checkout/last-name-required.spec.ts`

**Steps:**
  1. Enter First Name 'John' only and click Continue
    - expect: The error banner displays exactly 'Error: Last Name is required'
    - expect: The user remains on /checkout-step-one.html

#### 8.4. TC-CHK-004 Postal Code is mandatory

**File:** `tests/checkout/postal-code-required.spec.ts`

**Steps:**
  1. Enter First Name 'John' and Last Name 'Doe', leave Zip/Postal Code empty and click Continue
    - expect: The error banner displays exactly 'Error: Postal Code is required'
    - expect: The user remains on /checkout-step-one.html

#### 8.5. TC-CHK-005 Cancel from the information page returns to the cart

**File:** `tests/checkout/cancel-checkout-step-one.spec.ts`

**Steps:**
  1. On the checkout information page, click Cancel
    - expect: The URL returns to /cart.html
    - expect: The cart still contains the previously added items

#### 8.6. TC-CHK-006 Boundary values in the checkout fields

**File:** `tests/checkout/boundary-values.spec.ts`

**Steps:**
  1. Submit the minimum boundary data: First Name 'A', Last Name 'B', Zip '1'
    - expect: The form is accepted and the overview page is reached
  2. Return to the information page and submit 50-character names with a 10-character postal code
    - expect: The form is accepted
    - expect: The values are not truncated in a way that breaks the layout
    - expect: No overflow or clipping is observed on the overview page

#### 8.7. TC-CHK-007 Whitespace-only values are rejected

**File:** `tests/checkout/whitespace-only-values.spec.ts`

**Steps:**
  1. Enter three spaces in each of the three fields and click Continue
    - expect: The submission should be rejected with a required-field error
    - expect: If the form is accepted, a Major validation defect is raised

#### 8.8. TC-CHK-008 Special and Unicode characters are accepted

**File:** `tests/checkout/special-characters.spec.ts`

**Steps:**
  1. Enter First Name "Jöhn-Ö'Neil", Last Name "D'Souza", Zip 'AB1 2CD' and click Continue
    - expect: The form is accepted
    - expect: Characters are rendered correctly without mojibake

#### 8.9. TC-CHK-009 Injection payloads are safely encoded

**File:** `tests/checkout/injection-payload.spec.ts`

**Steps:**
  1. Enter '<script>alert(1)</script>' as First Name and "'; DROP TABLE users;--" as Last Name, enter a valid postal code and click Continue
    - expect: No JavaScript dialog is triggered
    - expect: Any echoed value is rendered as literal, HTML-encoded text
    - expect: The application remains functional and no server error is exposed

### 9. Checkout Overview

**Seed:** `tests/seed.spec.ts`

#### 9.1. TC-OVW-001 Overview lists all cart items

**File:** `tests/checkout/overview-items.spec.ts`

**Steps:**
  1. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light', checkout and submit valid information
    - expect: The overview page lists both products with QTY 1 each
    - expect: Prices $29.99 and $9.99 are displayed
    - expect: Cancel and Finish buttons are present

#### 9.2. TC-OVW-002 Item total equals the sum of the item prices

**File:** `tests/checkout/overview-item-total.spec.ts`

**Steps:**
  1. Reach the overview page with 'Sauce Labs Backpack' ($29.99) and 'Sauce Labs Bike Light' ($9.99)
    - expect: The summary displays 'Item total: $39.98'
    - expect: The value equals the arithmetic sum of the listed line prices

#### 9.3. TC-OVW-003 Tax is 8 percent of the item total

**File:** `tests/checkout/overview-tax.spec.ts`

**Steps:**
  1. Reach the overview page with only 'Sauce Labs Backpack' ($29.99)
    - expect: 'Item total: $29.99' is displayed
    - expect: 'Tax: $2.40' is displayed, equal to 8 percent of the item total rounded to two decimals

#### 9.4. TC-OVW-004 Total equals item total plus tax

**File:** `tests/checkout/overview-total.spec.ts`

**Steps:**
  1. Reach the overview page with only 'Sauce Labs Backpack'
    - expect: 'Total: $32.39' is displayed
    - expect: The total equals item total $29.99 plus tax $2.40 exactly

#### 9.5. TC-OVW-005 Payment and shipping information are displayed

**File:** `tests/checkout/overview-payment-shipping.spec.ts`

**Steps:**
  1. Reach the checkout overview page
    - expect: 'Payment Information:' shows 'SauceCard #31337'
    - expect: 'Shipping Information:' shows 'Free Pony Express Delivery!'

#### 9.6. TC-OVW-006 Cancel from the overview returns to the inventory

**File:** `tests/checkout/cancel-checkout-overview.spec.ts`

**Steps:**
  1. On the checkout overview page, click Cancel
    - expect: The URL returns to /inventory.html
    - expect: The cart badge still reflects the previously added items
    - expect: No order is created

### 10. Order Completion

**Seed:** `tests/seed.spec.ts`

#### 10.1. TC-ORD-001 Complete an order end to end

**File:** `tests/checkout/complete-order.spec.ts`

**Steps:**
  1. Log in as standard_user, add 'Sauce Labs Backpack', open the cart and click Checkout
    - expect: The checkout information page is displayed
  2. Submit First Name 'John', Last Name 'Doe', Zip '12345' and click Continue, then click Finish
    - expect: The URL becomes /checkout-complete.html
    - expect: The heading reads 'Thank you for your order!'
    - expect: The body reads 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    - expect: A 'Back Home' button is displayed

#### 10.2. TC-ORD-002 Cart is emptied after order completion

**File:** `tests/checkout/cart-reset-after-order.spec.ts`

**Steps:**
  1. Complete an order with two items and inspect the cart icon on the confirmation page
    - expect: No cart badge is displayed
  2. Open the cart page
    - expect: The cart is empty

#### 10.3. TC-ORD-003 Back Home returns to the inventory page

**File:** `tests/checkout/back-home.spec.ts`

**Steps:**
  1. On the order confirmation page, click 'Back Home'
    - expect: The URL returns to /inventory.html
    - expect: All six products are displayed with 'Add to cart' buttons

### 11. Navigation Menu

**Seed:** `tests/seed.spec.ts`

#### 11.1. TC-NAV-001 Burger menu opens and closes

**File:** `tests/navigation/burger-menu-toggle.spec.ts`

**Steps:**
  1. Click the 'Open Menu' button
    - expect: The side menu becomes visible with All Items, About, Logout and Reset App State
  2. Click 'Close Menu'
    - expect: The side menu is hidden and the page content is fully interactive again

#### 11.2. TC-NAV-002 All Items navigates to the inventory page

**File:** `tests/navigation/all-items.spec.ts`

**Steps:**
  1. Navigate to the cart page, open the burger menu and click 'All Items'
    - expect: The URL becomes /inventory.html
    - expect: The six product cards are displayed

#### 11.3. TC-NAV-003 About link points to the Sauce Labs website

**File:** `tests/navigation/about-link.spec.ts`

**Steps:**
  1. Open the burger menu and inspect the 'About' link
    - expect: The href is https://saucelabs.com/
  2. Click the 'About' link
    - expect: Navigation to the Sauce Labs marketing site occurs without an application error

#### 11.4. TC-NAV-004 Reset App State clears the cart

**File:** `tests/navigation/reset-app-state.spec.ts`

**Steps:**
  1. Add two products to the cart, open the burger menu and click 'Reset App State'
    - expect: The cart badge is removed
  2. Close the menu and inspect the inventory buttons and the cart page
    - expect: The cart page contains no items
    - expect: Any product buttons still labelled 'Remove' after a reset are reported as a known defect

#### 11.5. TC-NAV-005 Footer links are present and correct

**File:** `tests/navigation/footer-links.spec.ts`

**Steps:**
  1. Inspect the footer on the inventory page
    - expect: Twitter links to https://twitter.com/saucelabs
    - expect: Facebook links to https://www.facebook.com/saucelabs
    - expect: LinkedIn links to https://www.linkedin.com/company/sauce-labs/
    - expect: The copyright line contains 'Sauce Labs. All Rights Reserved.'

### 12. Session Management and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 12.1. TC-SES-001 Direct inventory URL access without login is blocked

**File:** `tests/session/direct-inventory-access.spec.ts`

**Steps:**
  1. With no active session, navigate directly to https://www.saucedemo.com/inventory.html
    - expect: The user is redirected to https://www.saucedemo.com/
    - expect: The error banner reads "Epic sadface: You can only access '/inventory.html' when you are logged in."
    - expect: No product data is exposed

#### 12.2. TC-SES-002 Direct checkout URL access without login is blocked

**File:** `tests/session/direct-checkout-access.spec.ts`

**Steps:**
  1. With no active session, navigate directly to https://www.saucedemo.com/checkout-step-one.html
    - expect: The user is redirected to the login page
    - expect: An access-restriction error is displayed
    - expect: The checkout form is not rendered
  2. Repeat for /cart.html and /checkout-step-two.html
    - expect: Each protected route enforces authentication consistently

#### 12.3. TC-SES-003 Page refresh preserves session and cart state

**File:** `tests/session/refresh-preserves-state.spec.ts`

**Steps:**
  1. Log in, add 'Sauce Labs Backpack' and refresh the inventory page
    - expect: The user remains logged in
    - expect: The cart badge still displays '1'
    - expect: The product button still reads 'Remove'
  2. Navigate to the checkout overview page and refresh
    - expect: No duplicate order is created
    - expect: The page state is preserved or the user is safely redirected

#### 12.4. TC-SES-004 Session invalidation mid-flow is handled gracefully

**File:** `tests/session/session-invalidation.spec.ts`

**Steps:**
  1. Log in, add an item, then clear the browser session storage and cookies
    - expect: The storage is cleared
  2. Attempt to continue to the checkout information page
    - expect: The user is redirected to the login page with the access-restriction message
    - expect: No unhandled JavaScript exception is thrown

#### 12.5. TC-SES-005 Browser back and forward navigation during checkout

**File:** `tests/session/back-forward-checkout.spec.ts`

**Steps:**
  1. Progress to the checkout overview page, then press the browser Back button
    - expect: The checkout information page is displayed without an application crash
  2. Press the browser Forward button and then click Finish
    - expect: The order completes exactly once
    - expect: The confirmation message 'Thank you for your order!' is displayed

#### 12.6. TC-ERR-001 Error banners are consistent and dismissible across the application

**File:** `tests/session/error-banner-consistency.spec.ts`

**Steps:**
  1. Trigger a login validation error and a checkout validation error in turn
    - expect: Both use the same red banner component with a close control
    - expect: Both messages are specific to the failing field
  2. Dismiss each banner using its close button
    - expect: The banner is removed and the form remains usable

### 13. Non-functional Checks

**Seed:** `tests/seed.spec.ts`

#### 13.1. TC-NFR-001 Keyboard-only end-to-end purchase

**File:** `tests/nfr/keyboard-navigation.spec.ts`

**Steps:**
  1. Using only Tab, Shift+Tab, Enter and Space, log in, add a product, open the cart and complete checkout
    - expect: Every interactive control is reachable in a logical order
    - expect: A visible focus indicator is present on each focused element
    - expect: The order completes successfully without using a mouse

#### 13.2. TC-NFR-002 Accessibility scan against WCAG 2.1 AA

**File:** `tests/nfr/accessibility-scan.spec.ts`

**Steps:**
  1. Run an axe-core scan on the login, inventory, cart, checkout step one, checkout overview and confirmation pages
    - expect: No Critical or Serious violations are reported
    - expect: All form inputs have associated labels
    - expect: All images expose meaningful alt text
    - expect: Text colour contrast is at least 4.5 to 1

#### 13.3. TC-NFR-003 Responsive layout at mobile and tablet widths

**File:** `tests/nfr/responsive-layout.spec.ts`

**Steps:**
  1. Set the viewport to 375x667 and inspect the login, inventory, cart and checkout pages
    - expect: No horizontal scrollbar appears
    - expect: Product cards reflow to a single column
    - expect: The burger menu and cart icon remain visible and tappable
    - expect: Form fields and buttons remain fully visible
  2. Repeat at 768x1024 and 1920x1080
    - expect: The layout adapts without overlapping or clipped content at every breakpoint

#### 13.4. TC-NFR-004 Page load performance budget

**File:** `tests/nfr/performance-budget.spec.ts`

**Steps:**
  1. Log in as standard_user and capture Navigation Timing metrics for the inventory page
    - expect: Largest Contentful Paint is at most 2.5 seconds
    - expect: DOM Content Loaded is at most 1.5 seconds
    - expect: No console errors are logged during page load
  2. Measure navigation between inventory, cart and checkout pages
    - expect: Each transition completes within 1 second for standard_user
    - expect: Any breach of the budget is recorded in the performance report
