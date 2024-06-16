package starter.actions;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.steps.UIInteractionSteps;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import starter.pageobjects.RegisterPage;
import starter.pageobjects.TreatmentsPage;

import java.time.Duration;
import java.util.List;

public class TreatmentsSteps extends UIInteractionSteps {
    TreatmentsPage treatments;

    @Step("Click on the {string} icon")
    public void clickOnIcon(String iconName) {
        $(RegisterPage.MY_ACCOUNT_ICON).click();
    }

    @Step("Select Treatments from the menu")
    public void selectTreatmentsOption() {
        $(TreatmentsPage.TREATMENTS_ICON).click();
    }

    public void verifyTreatmentsListIsDisplayed() {
        // Explicitly wait for the treatments list to be present
        WebDriverWait wait = new WebDriverWait(getDriver(), Duration.ofSeconds(20));
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(TreatmentsPage.TREATMENTS_LIST));

        // Locate treatments list
        List<WebElement> treatmentsList = getDriver().findElements(TreatmentsPage.TREATMENTS_LIST);

        // Verify if treatments list is displayed
        if (treatmentsList.isEmpty()) {
            throw new AssertionError("Treatments list is not displayed");
        }
   }

}



