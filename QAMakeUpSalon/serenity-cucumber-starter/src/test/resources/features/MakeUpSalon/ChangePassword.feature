Feature: Change Password Feature for a make up salon
  As a user,
  I should be able to change password with success if I am logged in

  Background:
    Given I am on the MakeUpSalon Page
    And I have successfully logged in

  @changePassword
  Scenario: Change password successfully
    When I click on the "My Account" icon
    And I select Change password from the menu
    And I enter new password "Roxana1!"
    And I enter confirm password "Roxana1!"
    And I click on "Done" button
    Then I should be redirected to the My account page
    And I should see the "Welcome, Roxana Ciuci" message

