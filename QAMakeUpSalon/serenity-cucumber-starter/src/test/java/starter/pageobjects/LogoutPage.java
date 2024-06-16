package starter.pageobjects;

import net.serenitybdd.core.pages.PageObject;
import org.openqa.selenium.By;

public class LogoutPage extends PageObject {

    public static final By LOGOUT_BUTTON = By.id("logout");
    public static final By LOGOUT_SUCCESS_MESSAGE = By.id("signin");
}
