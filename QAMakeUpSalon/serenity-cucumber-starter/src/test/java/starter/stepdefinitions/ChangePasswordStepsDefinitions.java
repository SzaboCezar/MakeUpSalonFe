package starter.stepdefinitions;

import io.cucumber.java.en.When;
import net.serenitybdd.annotations.Steps;
import starter.actions.ChangePasswordSteps;

public class ChangePasswordStepsDefinitions {

    @Steps
    ChangePasswordSteps changePasswordSteps;

    @When("I select Change password from the menu")
    public void i_click_on_change_password(){
        changePasswordSteps.selectChangePasswordOption();
    }

    @When("I enter new password {string}")
    public void i_enter_new_password(String string) {
        changePasswordSteps.iEnterNewPassword(string);
    }

    @When("I enter confirm password {string}")
    public void i_enter_confirm_password(String string) {
        changePasswordSteps.iEnterConfirmPassword(string);
    }

    @When("I click on {string} button")
    public void i_click_on_button(String string) {
        changePasswordSteps.iClickOnDoneButton();
    }

}
