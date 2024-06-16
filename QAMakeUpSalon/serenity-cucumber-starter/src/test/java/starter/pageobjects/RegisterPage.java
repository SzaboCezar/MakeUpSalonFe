package starter.pageobjects;

import net.serenitybdd.core.pages.PageObject;
import org.openqa.selenium.By;

public class RegisterPage extends PageObject {

    public static final By CREATE_ACCOUNT_ICON = By.xpath("//*[@id=\"navbarSupportedContent\"]/div[1]/a");
    public static final By FIRST_NAME = By.id("firstName");
    public static final By LAST_NAME = By.id("lastName");
    public static final By CONFIRM_PASSWORD_FIELD = By.id("confirmPassword");
    public static final By REGISTER_BUTTON = By.xpath("/html/body/app-root/app-enrollment/section/div/div/div/div/div/div/form/div[7]/button");
    public static final By MY_ACCOUNT_ICON = By.xpath("//*[@id=\"dropdownMenuButton\"]/span");

}
