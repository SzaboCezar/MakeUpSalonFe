Feature: Login Feature for a make up salon
  As a user,
  I shouldn't be able to login into the make up salon if username or password are incorrect


  Background:
    Given I am on the MakeUpSalon Page

  @nonValidLogin
  Scenario Outline: Login with non-valid credentials
    Given I click on Login icon
    When I enter the email <email>
    And I enter the password <password>
    And I click on the Login button
    Then I should see the <message> message
    Examples:
      | email            | password       | message                      |
      | "Test@admin.com" | "Exemplu2024!" | "Invalid email or password!" |
      | "Test@admin.ro"  | "TestAdmin1!"  | "Invalid email or password!" |