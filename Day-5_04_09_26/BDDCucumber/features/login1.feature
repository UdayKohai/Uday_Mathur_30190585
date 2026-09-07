Feature: Login Feature

Scenario: Successful Login with Valid Credentials
    Given the user is on the Login Page
    When the user enters valid credentials
    When clicks the Login button
    Then the user should be redirected to the Dashboard page