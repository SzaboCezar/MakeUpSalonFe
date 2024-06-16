package starter.pageobjects;

import net.serenitybdd.core.pages.PageObject;
import org.openqa.selenium.By;

public class LoginPage extends PageObject {

    public static final By LOGIN_ICON = By.id("signin");
    public static final By EMAIL_FIELD = By.id("email");
    public static final By PASSWORD_FIELD = By.id("password");
    public static final By LOGIN_BUTTON = By.xpath("/html/body/app-root/app-auth/section/div/div/div/div/div/div/form/div[3]/button");
    public static final By WELCOME_MESSAGE = By.xpath("//*[@id=\"navbarSupportedContent\"]/div[1]/ul/li[1]");
    public static final By LOGIN_ERROR_MESSAGE = By.xpath("/html/body/app-root/app-auth/section/div/div/div/div/div/div/div/p[1]");
}
