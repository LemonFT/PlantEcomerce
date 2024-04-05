package com.ecommerce_plant.plant.service;

import java.util.Date;
import java.util.List;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.ContactUser;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.repository.ContactUserRep;
import com.ecommerce_plant.plant.repository.UserRep;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class UserService {

    @Autowired
    UserRep userRep;
    @Autowired
    ContactUserRep contactUserRep;

    public User getUser(int user_id) {
        return userRep.findUser(user_id);
    }

    public User getUserIsAdmin() {
        Dotenv dotenv = Dotenv.load();
        int role_id = Integer.parseInt(dotenv.get("REACT_APP_ADMIN_ROLE"));
        return userRep.findUserIsAdmin(role_id);
    }

    public String insertUser(User user) {
        Dotenv dotenv = Dotenv.load();
        boolean email_regex = EmailValidator.getInstance().isValid(user.getEmail());
        if (user.getUsername().length() < 6 || user.getPassword().length() < 8 || !email_regex) {
            return "Insert false";
        }
        user.setAvatar("");
        user.setGender(false);
        user.setJoin_date(new Date());
        user.setBlock(false);
        user.setDeleted(false);
        user.setRole_id(
                user.getRole_id() == 0 ? Integer.parseInt(dotenv.get("REACT_APP_CUSTOMER_ROLE")) : user.getRole_id());
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(5)));
        if (userRep.findUserByName(user.getUsername()) != null) {
            return "Username already exist";
        }
        if (userRep.findUser(user.getEmail()) != null) {
            return "Email already exist";
        }
        try {
            boolean result = userRep.insertUser(user);
            return result ? "Insert successfully" : "Insert false";
        } catch (Exception e) {
            return "Insert false";
        }
    }

    @SuppressWarnings("null")
    public User signIn(User user) {
        User userSimilar = null;
        try {
            userSimilar = userRep.findUserByName(user.getUsername());
        } catch (Exception ex) {
            System.out.println("Exception: " + ex);
        }
        if (BCrypt.checkpw(user.getPassword(), userSimilar.getPassword())) {
            return userSimilar;
        }
        return null;
    }

    public List<ContactUser> getContactUser(int user_id) {
        return contactUserRep.findAllContactUsers(user_id);
    }

    public boolean insertContact(ContactUser contactUser) {
        return contactUserRep.insertContactUser(contactUser);
    }

    public boolean checkExistContact(ContactUser contactUser) {
        return contactUserRep.checkExistContact(contactUser);
    }
}