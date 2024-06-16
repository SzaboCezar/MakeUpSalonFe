package starter.actions;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.steps.UIInteractionSteps;
import starter.pageobjects.LoginPage;
import starter.pageobjects.LogoutPage;

public class LogoutSteps extends UIInteractionSteps {

    @Step("Perform login")
    public void performLogin() {
        $(LoginPage.LOGIN_ICON).click();
        $(LoginPage.EMAIL_FIELD).sendKeys("roxana.ciuci@gmail.com");
        $(LoginPage.PASSWORD_FIELD).sendKeys("Roxana1!");
        $(LoginPage.LOGIN_BUTTON).click();
    }

    @Step("I click on logout button")
    public void iClickOnLogoutButton() {
        $(LogoutPage.LOGOUT_BUTTON).click();
    }

    @Step("Get logout success message")
    public String getLogoutSuccessMessage() {
        return $(LogoutPage.LOGOUT_SUCCESS_MESSAGE).getText();
    }
}
