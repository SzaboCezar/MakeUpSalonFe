package starter.pageobjects;

import net.serenitybdd.core.pages.PageObject;
import org.openqa.selenium.By;

public class ChangePasswordPage extends PageObject {
    public static final By CHANGE_PASSWORD_ICON = By.xpath("//*[@id=\"navbarSupportedContent\"]/div[1]/ul/li[4]/a");
    public static final By NEW_PASSWORD_FIELD = By.id("newPassword");
    public static final By CONFIRM_PASSWORD_FIELD = By.id("confirmationPassword");
    public static final By DONE_BUTTON = By.xpath("/html/body/app-root/app-change-password/section/div/div/div/div/div/div/form/div[4]/button");

}
