Feature: Login Feature for a make up salon
  As a user,
  I should be able to login into the make up salon if username and password are correct


  Background:
    Given I am on the MakeUpSalon Page

  @validLogin
  Scenario: Login with valid credentials
    Given I click on Login icon
    When I enter the email "roxana.ciuci@gmail.com"
    And I enter the password "Roxana1!"
    And I click on the Login button
    Then I should be redirected to the My account page
    And I should see the "Welcome, Roxana Ciuci" message

