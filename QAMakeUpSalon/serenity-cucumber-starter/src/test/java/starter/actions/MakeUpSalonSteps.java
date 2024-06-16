package starter.actions;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.Serenity;
import net.serenitybdd.core.steps.UIInteractionSteps;
import starter.pageobjects.MakeUpSalonPage;

public class MakeUpSalonSteps extends UIInteractionSteps {

    MakeUpSalonPage navigate;

    @Step("I am on the MakeUpSalon Page")
    public void getMakeUpSalonPage() {
        navigate.open();
        Serenity.getDriver().manage().window().maximize();
    }
}
