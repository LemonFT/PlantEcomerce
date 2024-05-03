package com.ecommerce_plant.plant.config;

import java.util.Random;

/**
 * @author lemonftdev
 */

public class EmailProperty {
    public static final String HOST_NAME = "smtp.gmail.com";

    public static final int SSL_PORT = 465;

    public static final int TSL_PORT = 587;

    public static final String APP_EMAIL = "nguyenthiennam.npk@gmail.com";

    public static final String APP_PASSWORD = "gkua dhbc hzqp rbxe";

    public static final String TITLE_MAIL = "Confirm your email address with Plants";

    public static final String CONTENT_MAIL = "Verification code is: ";

    public static final int MAX_ITERATIONS = 6;

    public static String uniqueNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < MAX_ITERATIONS; i++) {
            sb.append(random.nextInt(10));
        }
        String uniqN = sb.toString();
        return uniqN;
    }
}