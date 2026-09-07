Feature: Login Feature

Scenario: Successful Login with Valid Credentials
    Given the user is on the Login Page
    When the user enters valid credentials
    When clicks the Login button
    Then the user should be redirected to the Dashboard page

Scenario: Unsuccessful Login with Invalid Credentials
    Given the user is on the Login Page
    When the user enters invalid credentials
    When clicks the Login button
    Then an error message should be displayed indicating invalid login

@smoke,@regression
Scenario Outline: Verify login with multiple users 
    Given User opens the application
    When User enters "<username>" and "<password>"
    Then an error message should be displayed indicating invalid login

    Examples:

        | username                  | password       |
        | standard_user             | secret_sauce   |
        | problem_user              | secret_sauce1  |
        | performance_glitch_user   | secret_sauce1  |
        | error_user                | secret_sauce1  |
        | visual_user               | secret_sauce1  |

@smoke
Scenario Outline: Verify login with multiple users successfully
    Given User opens the application
    When User enters "<username>" and "<password>"
    Then the user should be redirected to the Dashboard page


    Examples:

        | username                  | password      |
        | problem_user              | secret_sauce  |
        | standard_user             | secret_sauce  |
        | performance_glitch_user   | secret_sauce  |
        | error_user                | secret_sauce  |
        | visual_user               | secret_sauce  |