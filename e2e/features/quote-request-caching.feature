Feature: As a customer I want to my last quote request remembered

  Background:
    Given I am logged in CPA as "WB90000001"
    Given I have no quote request remembered
    Given I am on the transfer swap page

  Scenario: FxForward is being cached on Rate request
    Given I switch off the swap mode
    Given I select Entity as "CBPortal_Test02"
    Given I select Account 1 as "678901 - USD"
    Given I select Account 2 as "678901 - EUR"
    When I select the "near" leg buy-or-sell as "Sell"
    And I input the "near" leg amount as "30000"
    And I select the "near" leg currency as "USD"
    And I select the "near" leg date as "Today"
    Then the "New Rate" button should be visible
    And I click the "New Rate" button
    And the "Accept Rate" button should be visible
    Given I click the "Accept Rate" button
    Given the quote success message should be visible
    When I refresh the page
    Then Entity should display as "CBPortal_Test02"
    And Account 1 should be set value as "USD"
    And Account 2 should be set value as "EUR"
    And the "near" leg buy-or-sell should display as "Sell"
    And the "near" leg amount should be empty
    And the "near" leg date should be empty
    And I input the "near" leg amount as "30000"
    And I select the "near" leg date as "Today"
    Then the "New Rate" button should be visible
    And I click the "New Rate" button
    And the "Accept Rate" button should be visible
    When I click the "Accept Rate" button
    Then the quote success message should be visible


  Scenario: FxForward is being cached on Rate request
    Given I switch on the swap mode
    Given I select Entity as "CBPortal_Test02"
    Given I select Account 1 as "678901 - USD"
    Given I select Account 2 as "678901 - EUR"
    When I select the "near" leg currency as "USD"
    When I select the "near" leg buy-or-sell as "Buy"
    When I input the "near" leg amount as "30000"
    When I input the "far" leg amount as "31000"
    And I select the "near" leg date as "Today"
    And I select the "far" leg date as "In one year"
    Then the "New Rate" button should be visible
    And I click the "New Rate" button
    And the "Accept Rate" button should be visible
    And I click the "Accept Rate" button
    Then the quote success message should be visible
    When I refresh the page
    Then Entity should display as "CBPortal_Test02"
    And Account 1 should be set value as "USD"
    And Account 2 should be set value as "EUR"
    And the "near" leg buy-or-sell should display as "Buy"
    And the "far" leg buy-or-sell should display as "Sell"
    And the "near" leg currency should display as "USD"
    And the "far" leg currency should display as "USD"
    And the "near" leg amount should be empty
    And the "near" leg date should be empty
    And the "far" leg amount should be empty
    And the "far" leg date should be empty
    When I input the "near" leg amount as "30000"
    When I input the "far" leg amount as "31000"
    And I select the "near" leg date as "Today"
    And I select the "far" leg date as "In one year"
    Then the "New Rate" button should be visible
    And I click the "New Rate" button
    And the "Accept Rate" button should be visible
    When I click the "Accept Rate" button
    Then the quote success message should be visible



