Feature: As a customer I want to input the only transfer leg when swap mode is set as off

  Background:
    Given I am logged in CPA as "WB90000001"
    Given I have no quote request remembered
    Given I am on the transfer swap page
    Given I switch off the swap mode
    Given I select Entity as "CBPortal_Test02"
    Given I select Account 1 as "678901 - USD"
    Given I select Account 2 as "678901 - EUR"

  Scenario: Should show correct currency options
    Then the "near" leg currency options should contain following rows
      | USD |
      | EUR |

  Scenario: Should enable an extra date input when selected "Other date"
    Then the "near" leg other date should be disabled
    When I select the "near" leg date as "Other date"
    Then the "near" leg other date should be enabled
    When I input the "near" leg other date as "2017-01-01"
    Then the "near" leg other date should display as "2017-01-01"

  Scenario Outline: Clicking the "New Rate" button should show no error when all options are valid
    When I select the "near" leg buy-or-sell as "<side>"
    And I input the "near" leg amount as "<amount>"
    And I select the "near" leg currency as "<currency>"
    And I select the "near" leg date as "<date>"
    And I click the "New Rate" button
    Then the "Reject Rate" button should be visible
    And the "Accept Rate" button should be visible
    When I click the "Reject Rate" button
    Then the "New Rate" button should be visible
    When I click the "New Rate" button
    And I click the "Accept Rate" button
    Then the quote success message should be visible

    Examples:
      | side | amount | currency  | date       |
      | Buy  | 30000  | USD       | Spot       |
      | Sell | 30000  | EUR       | Today      |

  Scenario Outline: Clicking the "New Rate" button should show error when any option is invalid
    When I select the "near" leg buy-or-sell as "<side>"
    And I input the "near" leg amount as "<amount>"
    And I select the "near" leg currency as "<currency>"
    And I select the "near" leg date as "<date>"
    And I click the "New Rate" button
    Then there will be at least one invalid component

    Examples:
      | side | amount | currency  | date       |
      | -X-  | 30000  | USD       | Spot       |
      | Buy  | -X-    | USD       | Spot       |
      | Buy  | 30000  | -X-       | Spot       |
      | Buy  | 30000  | USD       | -X-        |
      | Buy  | 30000  | USD       | Other date |
