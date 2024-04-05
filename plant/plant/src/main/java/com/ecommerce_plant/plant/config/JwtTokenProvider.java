package com.ecommerce_plant.plant.config;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.ecommerce_plant.plant.mapping.modelmapping.JwtToken;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
    public boolean isTokenValid(String jwt) {
        try {
            Dotenv env = Dotenv.configure().load();
            String keySecret = env.get("REACT_APP_SECRETKEY");
            Key secretKey = Keys.hmacShaKeyFor(keySecret.getBytes());
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(jwt);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    public String createJWT(int id, String username, String email, int role,
            boolean refresh) {
        Dotenv env = Dotenv.configure().load();
        String keySecret = env.get("REACT_APP_SECRETKEY");
        Key secretKey = Keys.hmacShaKeyFor(keySecret.getBytes());
        String jwtToken = Jwts.builder()
                .claim("id", id)
                .claim("uname", username)
                .claim("email", email)
                .claim("role", role)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(refresh ? 30l : 10l, ChronoUnit.MINUTES)))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
        return jwtToken;
    }

    public Claims decodeJWT(String jwt) {

        Dotenv env = Dotenv.configure().load();
        String keySecret = env.get("REACT_APP_SECRETKEY");
        Key secretKey = Keys.hmacShaKeyFor(keySecret.getBytes());
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt);

        return claimsJws.getBody();
    }

    public JwtToken refreshTokens(String jwt) {
        System.err.println("refresh token start");
        Dotenv env = Dotenv.configure().load();
        String keySecret = env.get("REACT_APP_SECRETKEY");
        Key secretKey = Keys.hmacShaKeyFor(keySecret.getBytes());
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt);
        Claims claims = claimsJws.getBody();
        int id = claims.get("id", Integer.class);
        String name = claims.get("uname", String.class);
        String email = claims.get("email", String.class);
        int role = claims.get("role", Integer.class);
        return new JwtToken(createJWT(id, name, email, role, false), createJWT(id, name, email, role, true));
    }

    public String getUsernameFromToken(String jwt) {
        Dotenv env = Dotenv.configure().load();
        String keySecret = env.get("REACT_APP_SECRETKEY");
        Key secretKey = Keys.hmacShaKeyFor(keySecret.getBytes());
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt);
        return claimsJws.getBody().get("uname", String.class);
    }

    public int getUserIDFromToken(String jwt) {
        Dotenv env = Dotenv.configure().load();
        String keySecret = env.get("REACT_APP_SECRETKEY");
        Key secretKey = Keys.hmacShaKeyFor(keySecret.getBytes());
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt);
        return claimsJws.getBody().get("id", Integer.class);
    }

    public String convertObjToJson(Object e) throws JsonProcessingException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String json = ow.writeValueAsString(e);
        return json;
    }
}
