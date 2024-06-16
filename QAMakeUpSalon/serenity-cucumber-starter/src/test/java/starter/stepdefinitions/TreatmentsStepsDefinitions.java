package starter.stepdefinitions;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.annotations.Steps;
import starter.actions.TreatmentsSteps;


public class TreatmentsStepsDefinitions {
    @Steps
    TreatmentsSteps treatments;

    @When("I click on the {string} icon")
    public void i_select_the_icon(String iconName) {
        treatments.clickOnIcon(iconName);
    }

    @When("I select Treatments from the menu")
    public void i_click_on_treatments() {
        treatments.selectTreatmentsOption();
    }

    @Then("I should see a list of all available treatments displayed")
    public void i_should_see_a_list_of_all_available_treatments_displayed() {
        treatments.verifyTreatmentsListIsDisplayed();
    }
    }


