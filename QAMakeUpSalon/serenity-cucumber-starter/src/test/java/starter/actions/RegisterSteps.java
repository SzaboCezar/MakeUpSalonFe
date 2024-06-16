package starter.actions;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.steps.UIInteractionSteps;
import starter.pageobjects.RegisterPage;

public class RegisterSteps extends UIInteractionSteps {

    @Step("I click on Create Account")
    public void clickOnCreateAccount(){
        find(RegisterPage.CREATE_ACCOUNT_ICON).click();
    }

    @Step("I enter First Name {string}")
    public void iEnterFirstName(String string){
        find(RegisterPage.FIRST_NAME).sendKeys(string);
    }

    @Step("I enter last Name {string}")
    public void iEnterLastName(String string){
        find(RegisterPage.LAST_NAME).sendKeys(string);
    }

    @Step("I confirm the password {string}")
    public void iConfirmPassword(String string){
        find(RegisterPage.CONFIRM_PASSWORD_FIELD).sendKeys(string);
    }

    @Step("I click on Register button")
    public void iClickOnRegisterButton(){
        find(RegisterPage.REGISTER_BUTTON).click();
    }

    @Step("I should be redirected to the My account page")
    public void iShouldBeRedirectedToTheMyAccountPage(){
        find(RegisterPage.MY_ACCOUNT_ICON).click();
    }

}
