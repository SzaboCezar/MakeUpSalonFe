package starter.stepdefinitions;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.annotations.Steps;
import starter.actions.LoginSteps;
import starter.utils.MessageVerifier;


public class LoginStepsDefinitions {

    @Steps
    LoginSteps loginSteps;

    @Given("I click on Login icon")
    public void i_click_on_login_icon() {
        loginSteps.clickLoginIcon();
    }

    @When("I enter the email {string}")
    public void i_enter_the_email(String string) {
        loginSteps.iEnterTheEmail(string);
    }

    @And("I enter the password {string}")
    public void i_enter_the_password(String string) {
        loginSteps.iEnterThePassword(string);
    }

    @And("I click on the Login button")
    public void i_click_on_the_login_button() {
        loginSteps.clickLoginButton();
    }

    @Then("I should see the {string} message")
    public void i_should_see_the_message(String expectedMessage) {
        String actualMessage;
        if (expectedMessage.contains("Welcome")) {
            actualMessage = loginSteps.getWelcomeMessage();
        } else {
            actualMessage = loginSteps.getLoginErrorMessage();
        }
        MessageVerifier.verifyMessage(actualMessage, expectedMessage);
    }
}
