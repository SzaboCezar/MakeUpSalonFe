package starter.stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.annotations.Steps;
import starter.actions.RegisterSteps;

public class RegisterStepsDefinitions {

    @Steps
    RegisterSteps registerSteps;

    @Given("I click on Create Account")
    public void i_click_on_create_an_account() {
        registerSteps.clickOnCreateAccount();
    }
    @When("I enter First Name {string}")
    public void i_enter_first_name(String string) {
        registerSteps.iEnterFirstName(string);
    }
    @When("I enter Last Name {string}")
    public void i_enter_last_name(String string) {
        registerSteps.iEnterLastName(string);
    }
    @When("I confirm the password {string}")
    public void i_confirm_the_password(String string) {
        registerSteps.iConfirmPassword(string);
    }
    @When("I click on Register button")
    public void i_click_on_register_button() {
        registerSteps.iClickOnRegisterButton();
    }
    @Then("I should be redirected to the My account page")
    public void i_should_be_logged_into_my_account() {
        registerSteps.iShouldBeRedirectedToTheMyAccountPage();
    }
}
