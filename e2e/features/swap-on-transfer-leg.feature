Feature: As a customer I want to input near leg and far leg, when swap mode is set as on

  Background:
    Given I am logged in CPA as "WB90000001"
    Given I have no quote request remembered
    Given I am on the transfer swap page
    Given I switch on the swap mode
    Given I select Entity as "CBPortal_Test02"
    Given I select Account 1 as "678901 - USD"
    Given I select Account 2 as "678901 - EUR"

  Scenario: Should show correct currency options
    Then the "near" leg currency options should contain following rows
      | USD |
      | EUR |

  Scenario: Should show the same currency in two legs
    When I select the "near" leg currency as "USD"
    Then the "far" leg currency should display as "USD"
    When I select the "near" leg currency as "EUR"
    Then the "far" leg currency should display as "EUR"

  Scenario: Should show opposite buy-or-sell in two legs
    When I select the "near" leg buy-or-sell as "Buy"
    Then the "far" leg buy-or-sell should display as "Sell"
    When I select the "near" leg buy-or-sell as "Sell"
    Then the "far" leg buy-or-sell should display as "Buy"

  Scenario: Should sync amount to far leg with near leg amount
    When I input the "near" leg amount as "30000"
    Then the "far" leg amount should display as "30000"
    When I input the "near" leg amount as "31000"
    Then the "far" leg amount should display as "31000"

  Scenario: Should NOT sync amount to far leg when far leg has been modified
    When I input the "near" leg amount as "30000"
    Then the "far" leg amount should display as "30000"
    When I input the "far" leg amount as "1000"
    Then the "far" leg amount should display as "1000"
    And I input the "near" leg amount as "31000"
    Then the "far" leg amount should display as "1000"

  Scenario: Should contain later date options in far leg when near leg is selected
    When I select the "near" leg date as "In one month"
    Then the "far" leg date options should contain following rows
      | In two months     |
      | In three months   |
      | In six months     |
      | In one year       |
      | In eighteen months|
      | In two years      |
      | Other date        |
    When I select the "far" leg date as "In two months"
    Then the "near" leg date options should contain following rows
      | Spot          |
      | Today         |
      | Tomorrow      |
      | In one month  |
      | Other date    |

  Scenario: Should enable an extra date input in far leg when selected "Other date"
    Then the "far" leg other date should be disabled
    When I select the "far" leg date as "Other date"
    Then the "far" leg other date should be enabled
    When I input the "far" leg other date as "2017-01-01"
    Then the "far" leg other date should display as "2017-01-01"

  Scenario Outline: Clicking the "New Rate" button should show no error when all options are valid
    When I select the "near" leg buy-or-sell as "<side>"
    And I input the "near" leg amount as "<amount>"
    And I select the "near" leg currency as "<currency>"
    And I select the "near" leg date as "<date>"
    And I input the "far" leg amount as "<amount2>"
    And I select the "far" leg date as "<date2>"
    And I click the "New Rate" button
    Then the "Reject Rate" button should be visible
    And the "Accept Rate" button should be visible
    When I click the "Reject Rate" button
    Then the "New Rate" button should be visible
    When I click the "New Rate" button
    And I click the "Accept Rate" button
    Then the quote success message should be visible

    Examples:
      | side | amount | currency  | date    | amount2  | date2       |
      | Buy  | 30000  | USD       | Spot    | 20000    | Today       |
      | Sell | 30000  | EUR       | Today   | 20000    | Tomorrow    |

  Scenario Outline: Clicking the "New Rate" button should show error when any option is invalid
    When I select the "near" leg buy-or-sell as "<side>"
    And I input the "near" leg amount as "<amount>"
    And I select the "near" leg currency as "<currency>"
    And I select the "near" leg date as "<date>"
    And I input the "far" leg amount as "<amount2>"
    And I select the "far" leg date as "<date2>"
    And I click the "New Rate" button
    Then there will be at least one invalid component

    Examples:
      | side | amount | currency  | date       | amount2  | date2       |
      | -X-  | 30000  | USD       | Spot       | 20000    | Today       |
      | Buy  | -X-    | USD       | Spot       | 20000    | Today       |
      | Buy  | 30000  | -X-       | Spot       | 20000    | Today       |
      | Buy  | 30000  | USD       | -X-        | 20000    | Today       |
      | Buy  | 30000  | USD       | Spot       | -X-      | Today       |
      | Buy  | 30000  | USD       | Spot       | 20000    | -X-         |
      | Buy  | 30000  | USD       | Other date | 20000    | Today       |
      | Buy  | 30000  | USD       | Spot       | 20000    | Other date  |
