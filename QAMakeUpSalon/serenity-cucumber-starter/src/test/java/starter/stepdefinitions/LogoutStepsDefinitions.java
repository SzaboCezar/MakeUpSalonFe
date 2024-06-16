package starter.stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.annotations.Steps;
import starter.actions.LogoutSteps;
import starter.utils.MessageVerifier;

public class LogoutStepsDefinitions {

    @Steps
    LogoutSteps logoutSteps;

    @Given("I have successfully logged in")
    public void i_am_logged_in() {
        logoutSteps.performLogin();
    }

    @When("I click on logout button")
    public void i_click_on_logout_button() {
        logoutSteps.iClickOnLogoutButton();
    }

    @Then("I should see the {string} icon")
    public void i_should_see_the_message(String expectedMessage) {
        String actualMessage = logoutSteps.getLogoutSuccessMessage();
        MessageVerifier.verifyMessage(actualMessage, expectedMessage);
    }
}
