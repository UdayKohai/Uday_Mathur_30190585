Feature: Student Registration Feature

Scenario Outline: Verify a student can register successfully
    Given User opens the student application
    When User enters "<name>" and "<email>" and "<mobile>" and "<dob>" and "<Subject>" and "<address>" and "<state>" and "<city>" and "<gender>" and "<hobby>"
    Then Login button is enabled

    Examples:

        | name         | email                  | mobile     | dob        | Subject   | address          | state      | city       | gender | hobby|
        | Uday         |test@gmail.com          | 1234567890 | 2000-01-01 | Math      | 123 Amul Point   | Rajasthan  | Agra       | Male   | Reading|
        | Test1        |test1@gmail.com         | 1234566890 | 2000-05-01 | English   | 126 Amul Point   | Rajasthan  | Meerut     | Female | Sports |