Feature: Logout Feature for a make up salon
  As a user,
  I should be able to logout with success if I am logged in and I navigate to home page

  Background:
    Given I am on the MakeUpSalon Page
    And I have successfully logged in

  @validLogout
  Scenario: Logout successful

    When I click on logout button
    Then I should see the "Login" icon