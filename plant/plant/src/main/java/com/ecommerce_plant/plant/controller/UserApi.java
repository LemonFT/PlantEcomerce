package com.ecommerce_plant.plant.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.config.JwtTokenProvider;
import com.ecommerce_plant.plant.mapping.UserMapping;
import com.ecommerce_plant.plant.mapping.modelmapping.JwtToken;
import com.ecommerce_plant.plant.model.ContactUser;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.service.UserService;

@RequestMapping("")
@Controller
public class UserApi {
    @Autowired
    UserService userService;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    UserMapping userMapping;

    // get token use -- permitAll
    @PostMapping("authenticed/api/user/")
    public ResponseEntity<?> getInfoUser(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("token");
        int user_id = jwtTokenProvider.getUserIDFromToken(token);
        User user = userService.getUser(user_id);
        return ResponseEntity.ok().body(userMapping.getInformationUser(user));
    }

    // get info contact --- authenticed
    @GetMapping("authenticed/api/user/contact/{id}")
    public ResponseEntity<?> getContactByUserId(@PathVariable int id) {
        List<ContactUser> contactUsers = userService.getContactUser(id);
        return userService.getContactUser(id) == null ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(contactUsers);
    }

    // insert info contact --- authenticed
    @PostMapping("authenticed/api/user/contact")
    public ResponseEntity<?> insertContact(@RequestBody ContactUser contactUser) {
        System.err.println("contact");
        boolean checkExist = userService.checkExistContact(contactUser);
        if (checkExist) {
            return ResponseEntity.ok().body("Contact already exist");
        }
        boolean resultInsert = userService.insertContact(contactUser);
        return resultInsert ? ResponseEntity.ok().body("Added successfully")
                : ResponseEntity.badRequest().body("Insert false");
    }

    // update info contact --- authenticed
    @PutMapping("authenticed/api/user/contact")
    public ResponseEntity<?> updateContact(@RequestBody ContactUser contactUser) {
        System.err.println("contact");
        boolean checkExist = userService.checkExistContact(contactUser);
        if (checkExist) {
            return ResponseEntity.ok().body("Contact already exist");
        }
        boolean resultInsert = userService.insertContact(contactUser);
        return resultInsert ? ResponseEntity.ok().body("Update successfully")
                : ResponseEntity.badRequest().body("Update false");
    }

    // register account --- all
    @PostMapping("api/user/register")
    public ResponseEntity<?> insertUser(@RequestBody User user) {
        String result = userService.insertUser(user);
        return result.equals("Insert successfully") ? ResponseEntity.ok().body(result)
                : ResponseEntity.badRequest().body(result);
    }

    // sign in --- all
    @PostMapping("api/user/signin")
    public ResponseEntity<?> signIn(@RequestBody User user) {
        System.err.println("signin signin");
        User result = userService.signIn(user);
        if (result == null) {
            return ResponseEntity.badRequest().body("doesn't exist");
        } else {
            String token = jwtTokenProvider.createJWT(result.getId(), result.getUsername(), result.getEmail(),
                    result.getRole_id(), false);
            String refreshToken = jwtTokenProvider.createJWT(result.getId(), result.getUsername(), result.getEmail(),
                    result.getRole_id(), true);
            JwtToken tokens = new JwtToken(token, refreshToken);
            return ResponseEntity.ok().body(tokens);
        }
    }

    // refresh token --- authenticed
    @PostMapping("authenticed/api/user/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> requestBody) {
        String jwtTokenOld = requestBody.get("jwtTokenOld");
        System.err.println(jwtTokenOld);
        if (!jwtTokenProvider.isTokenValid(jwtTokenOld)) {
            return ResponseEntity.badRequest().body("token invalid");
        }
        JwtToken jwtTokenNew = jwtTokenProvider.refreshTokens(jwtTokenOld);
        System.out.println("refresh token success");
        return ResponseEntity.ok().body(jwtTokenNew);
    }
}
