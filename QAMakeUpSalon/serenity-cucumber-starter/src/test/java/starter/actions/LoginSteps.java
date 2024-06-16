package starter.actions;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.steps.UIInteractionSteps;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import starter.pageobjects.LoginPage;

import java.time.Duration;

public class LoginSteps extends UIInteractionSteps {

    @Step("I click on Login icon")
    public void clickLoginIcon() {
        find(LoginPage.LOGIN_ICON).click();
    }

    @Step("I enter the email {string}")
    public void iEnterTheEmail(String string) {
        find(LoginPage.EMAIL_FIELD).sendKeys(string);
    }

    @Step("I enter the password {string}")
    public void iEnterThePassword(String string) {
        find(LoginPage.PASSWORD_FIELD).sendKeys(string);
    }

    @Step("I click on the Login button")
    public void clickLoginButton() {
        find(LoginPage.LOGIN_BUTTON).click();
    }

    @Step("I should see the welcome message")
    public String getWelcomeMessage() {
        WebDriver driver = getDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        WebElement welcomeMessageElement = wait.until(ExpectedConditions.visibilityOfElementLocated(LoginPage.WELCOME_MESSAGE));
        return welcomeMessageElement.getText().trim();
    }

    @Step("I should see the {string} error message")
    public String getLoginErrorMessage() {
        WebDriver driver = getDriver();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        WebElement errorMessageElement = wait.until(ExpectedConditions.visibilityOfElementLocated(LoginPage.LOGIN_ERROR_MESSAGE));
        return errorMessageElement.getText();
    }
}
