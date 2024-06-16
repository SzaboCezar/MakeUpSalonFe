package starter.utils;

import org.junit.Assert;

public class MessageVerifier {
    public static void verifyMessage(String actualMessage, String expectedMessage) {
        Assert.assertEquals(expectedMessage, actualMessage);
    }
}
