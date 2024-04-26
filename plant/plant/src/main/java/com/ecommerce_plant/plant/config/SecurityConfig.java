package com.ecommerce_plant.plant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @author lemonftdev
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @SuppressWarnings({ "deprecation" })
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http,
                        JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
                return http
                                .csrf(csrf -> csrf.disable())
                                .addFilterBefore(jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)
                                .authorizeRequests(requests -> requests
                                                .requestMatchers("/authenticed/**").authenticated()
                                                .requestMatchers("/ws/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/product/**").permitAll()
                                                .anyRequest().permitAll())
                                .build();
        }
}