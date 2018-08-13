Feature: Test if SSO IngTrade functionality is implemented correctly

  # TODO: IE only
  #Scenario: Successful SSO redirect
  #  Given I am logged in CPA as "WB90000001"
  #  Given I am on the SSO redirect page
  #  Then Redirect to IngTrade is occurred

  Scenario: Unsupported browser warning is shown and redirect is not occured
    Given I am logged in CPA as "WB90000001"
    Given I am on the SSO redirect page
    Then Redirect to IngTrade is not occurred
    And Text should be "Unsupported browser for accessing ING Trade, by clicking on here you may try to start ING Trade. If it keeps failing please use a supported browser like Internet Explorer 11."

  Scenario: User is not setup in IngTrade SSO
    Given I am logged in CPA as "WB90000002"
    Given I am on the SSO redirect page
    Then Redirect to IngTrade is not occurred
    And Text should be "ING Trade user not verified"
    And Description should be "You are missing the permissions to visit the ING Trade module. Please contact support if this issue persists."
