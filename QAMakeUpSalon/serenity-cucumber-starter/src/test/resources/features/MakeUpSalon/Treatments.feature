Feature: Display the list of treatments for a make up salon
  As a user,
  I want to see a list of treatments available at the salon
  So that I can choose a suitable treatment

  Background:
    Given I am on the MakeUpSalon Page
    And I have successfully logged in

  @treatments
  Scenario: Treatments display

    When I click on the "My Account" icon
    And I select Treatments from the menu
    Then I should see a list of all available treatments displayed

