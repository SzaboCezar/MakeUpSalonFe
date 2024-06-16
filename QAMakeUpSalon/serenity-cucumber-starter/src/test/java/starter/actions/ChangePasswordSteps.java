package starter.actions;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.steps.UIInteractionSteps;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import starter.pageobjects.ChangePasswordPage;

import java.time.Duration;

public class ChangePasswordSteps extends UIInteractionSteps {

    @Step("I select Change password from the menu")
    public void selectChangePasswordOption(){
        find(ChangePasswordPage.CHANGE_PASSWORD_ICON).click();
    }
    @Step("I enter new password {string}")
    public void iEnterNewPassword(String string){
        find(ChangePasswordPage.NEW_PASSWORD_FIELD).sendKeys(string);
    }

    @Step("I enter confirm password {string}")
    public void iEnterConfirmPassword(String string){
        find(ChangePasswordPage.CONFIRM_PASSWORD_FIELD).sendKeys(string);
    }

    @Step("I click on {string} button")
    public void iClickOnDoneButton(){
        find(ChangePasswordPage.DONE_BUTTON).click();
    }
}
