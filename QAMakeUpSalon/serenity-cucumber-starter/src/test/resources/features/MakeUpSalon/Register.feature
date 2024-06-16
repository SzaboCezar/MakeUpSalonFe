Feature: Register Feature for a make up salon
  As a user,
  I should be able to register into the make up salon if I provide the data correctly

  Background:
    Given I am on the MakeUpSalon Page

  @validRegister
  Scenario: Register with valid data
    Given I click on Create Account
    When I enter First Name "Andrada"
    And I enter Last Name "Cosma"
    And I enter the email "andrada.cosma@gmail.com"
    And I enter the password "Andrada1!"
    And I confirm the password "Andrada1!"
    And I click on Register button
    Then I should be redirected to the My account page
    And I should see the "Welcome, Andrada Cosma" message

