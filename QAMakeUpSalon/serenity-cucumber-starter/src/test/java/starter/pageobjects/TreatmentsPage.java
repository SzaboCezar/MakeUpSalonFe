package starter.pageobjects;

import net.serenitybdd.core.pages.PageObject;
import org.openqa.selenium.By;

public class TreatmentsPage extends PageObject {
    public static final By TREATMENTS_ICON = By.xpath("//*[@id=\"navbarSupportedContent\"]/div[1]/ul/li[3]/a");
    public static final By TREATMENTS_LIST = By.xpath("//*[@id=\"treatment1\"]/div/div[1]/h6");


}
