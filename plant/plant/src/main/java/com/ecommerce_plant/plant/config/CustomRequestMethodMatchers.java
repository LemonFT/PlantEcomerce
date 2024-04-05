package com.ecommerce_plant.plant.config;

import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.RequestMatcher;

public class CustomRequestMethodMatchers implements RequestMatcher {

    private HttpMethod getUserDefinedHttpMethod(String username) {
        if (username.equals("admin")) {
            return HttpMethod.GET;
        } else {
            return HttpMethod.POST;
        }
    }

    @Override
    public boolean matches(jakarta.servlet.http.HttpServletRequest request) {
        String httpMethod = request.getMethod();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        HttpMethod userDefinedMethod = getUserDefinedHttpMethod(username);
        return httpMethod.equalsIgnoreCase(userDefinedMethod.toString());
    }

}
