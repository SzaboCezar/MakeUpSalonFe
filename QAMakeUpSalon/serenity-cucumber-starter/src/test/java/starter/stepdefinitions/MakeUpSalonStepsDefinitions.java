package starter.stepdefinitions;

import io.cucumber.java.en.Given;
import net.serenitybdd.annotations.Steps;
import starter.actions.MakeUpSalonSteps;

public class MakeUpSalonStepsDefinitions {

    @Steps
    MakeUpSalonSteps navigate;

    @Given("I am on the MakeUpSalon Page")
    public void i_am_on_the_home_page() {
        navigate.getMakeUpSalonPage();
    }
}
