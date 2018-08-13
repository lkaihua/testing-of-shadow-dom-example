Feature: As a customer I want to see the fx history

  Background:
    Given I am logged in CPA as "WB90000001"
    Given I am on the fx history page

  Scenario: Page should contains at least following lines
    Then I see the history table should contain following rows
      |  Trade date | Ind | User ID        |  Value date | Trade ID  | Product type | CCY bought | Amount bought | CCY sold  | Amount sold | FX rate |
      | 13-Aug-2014 | BUY | Joe Rogan      | 15-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 12-Aug-2014 | BUY | Marcelo Garcia | 15-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 11-Aug-2014 | BUY | Barbara Oakley | 13-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 08-Aug-2014 | BUY | Ray Kurzweil   | 10-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 07-Aug-2014 | BUY | Bryan Cranston | 09-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |

  Scenario: Page should contains pagination buttons
    Given I see the history table contains at least "10" lines
    Then there should be clickable pagination buttons to go to next pages


  Scenario: Clicking next pagination button should update table content
    When I click on the next pagination button
    And I wait "3" seconds
    Then I see the history table should contain following rows
      |  Trade date | Ind | User ID         |  Value date | Trade ID  | Product type | CCY bought | Amount bought | CCY sold  | Amount sold | FX rate |
      | 29-Jul-2014 | BUY | Vincent Freeman | 31-Jul-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 28-Jul-2014 | BUY | Tommy Wiseau    | 30-Jul-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 27-Jul-2014 | BUY | Russel Peters   | 29-Jul-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 26-Jul-2014 | BUY | John Doe        | 28-Jul-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 26-Jul-2014 | BUY | Robert Downey   | 28-Jul-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |

  Scenario: Clicking previous pagination button should update table content
    When I click on the previous pagination button
    And I wait "3" seconds
    Then I see the history table should contain following rows
      |  Trade date | Ind | User ID        |  Value date | Trade ID  | Product type | CCY bought | Amount bought | CCY sold  | Amount sold | FX rate |
      | 13-Aug-2014 | BUY | Joe Rogan      | 15-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 12-Aug-2014 | BUY | Marcelo Garcia | 15-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 11-Aug-2014 | BUY | Barbara Oakley | 13-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 08-Aug-2014 | BUY | Ray Kurzweil   | 10-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
      | 07-Aug-2014 | BUY | Bryan Cranston | 09-Aug-2014 | 5703895   |   FxSpot     |    USD     |   1,500.00    |   EUR     |   1,176.10  |   0.769 |
