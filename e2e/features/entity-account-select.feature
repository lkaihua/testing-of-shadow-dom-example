Feature: As a customer I want to select entity and related accounts

  Background:
    Given I am logged in CPA as "WB90000001"
    Given I have no quote request remembered
    Given I am on the transfer swap page
    Given I switch off the swap mode

  Scenario: Page should be inited
    Then Entity should be enabled
    And Account 1 should be disabled
    And Account 2 should be disabled

  Scenario: When the user select entity, then the accounts should be loaded
    Given I select Entity as "CBPortal_Test02"
    Then Entity should display as "CBPortal_Test02"
    Then Account 1 should display as empty
    And Account 1 should contain following accounts
        | 678901 - USD |
        | 678901 - EUR |
        | 890123 - PLN |
    And Account 2 should display as empty
    And Account 2 should contain following accounts
        | 678901 - USD |
        | 678901 - EUR |
        | 890123 - PLN |

  Scenario: When the user select account one, then account two should be updated
    Given I select Entity as "CBPortal_Test02"
    When I select Account 1 as "678901 - USD"
    And Account 1 should contain following accounts
      | 678901 - USD |
      | 678901 - EUR |
      | 890123 - PLN |
    And Account 2 should display as empty
    And Account 2 should contain following accounts
        | 678901 - EUR |
        | 890123 - PLN |

  Scenario: When the user select account one and select account two, then account one should be updated
    Given I select Entity as "CBPortal_Test02"
    Given I select Account 1 as "678901 - USD"
    When I select Account 2 as "890123 - PLN"
    And Account 2 should contain following accounts
        | 678901 - EUR |
        | 890123 - PLN |
    And Account 1 should contain following accounts
        | 678901 - USD |
        | 678901 - EUR |

  Scenario: When the user re-select the entity, then accounts should be reset if its value has been updated
    Given I select Entity as "CBPortal_Test02"
    Given I select Account 1 as "678901 - USD"
    Given I select Account 2 as "890123 - PLN"
    When I select Entity as "CBPortal_Test03"
    Then Account 1 should display as empty
    And Account 2 should be set value as "PLN"


