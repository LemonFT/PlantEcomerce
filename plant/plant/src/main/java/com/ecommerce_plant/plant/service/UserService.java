package com.ecommerce_plant.plant.service;

import java.util.Date;
import java.util.List;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.config.EmailProperty;
import com.ecommerce_plant.plant.model.ContactUser;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.repository.ContactUserRep;
import com.ecommerce_plant.plant.repository.UserRep;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * @author lemonftdev
 */
@Service
public class UserService {

    private static final int MIN_USERNAME_LENGTH = 6;
    private static final int MIN_PASSWORD_LENGTH = 8;

    @Autowired
    UserRep userRep;
    @Autowired
    ContactUserRep contactUserRep;
    @Autowired
    IEmailService iEmailService;

    public List<User> findAllUser() {
        return userRep.findAllUsers();
    }

    public User getUser(int userId) {
        return userRep.findUser(userId);
    }

    public User getUserIsAdmin() {
        Dotenv dotenv = Dotenv.load();
        int roleId = Integer.parseInt(dotenv.get("REACT_APP_ADMIN_ROLE"));
        return userRep.findUserIsAdmin(roleId);
    }

    public String insertUser(User user) {
        Dotenv dotenv = Dotenv.load();
        boolean emailRegex = EmailValidator.getInstance().isValid(user.getEmail());
        if ((user.getUsername().length() < MIN_USERNAME_LENGTH || user.getPassword().length() < MIN_PASSWORD_LENGTH
                || !emailRegex)) {
            return "Insert false";
        }
        user.setAvatar("");
        user.setGender(false);
        user.setJoinDate(new Date());
        user.setBlock(false);
        user.setDeleted(false);
        user.setRoleId(Integer.parseInt(dotenv.get("REACT_APP_CUSTOMER_ROLE")));
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

    public String registerByPersonnel(User user) {
        boolean emailRegex = EmailValidator.getInstance().isValid(user.getEmail());
        if ((user.getUsername().length() < MIN_USERNAME_LENGTH || user.getPassword().length() < MIN_PASSWORD_LENGTH)) {
            return "Username or password invalid!";
        }
        if (!emailRegex) {
            return "Email invalid!";
        }
        user.setAvatar("");
        user.setGender(false);
        user.setJoinDate(new Date());
        user.setBlock(false);
        user.setDeleted(false);
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(5)));
        if (userRep.findUserByName(user.getUsername()) != null) {
            return "Username already exist";
        }
        if (userRep.findUser(user.getEmail()) != null) {
            return "Email already exist";
        }
        try {
            boolean result = userRep.insertUser(user);
            return result ? "Create account successful" : "Insert false";
        } catch (Exception e) {
            return "Create account false, check internet and try again!";
        }
    }

    public boolean updatePwd(User user) {
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(5)));
        if (userRep.findUser(user.getEmail()) == null) {
            return false;
        }
        return userRep.updatePwd(user);
    }

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

    public List<ContactUser> getContactUser(int userId) {
        return contactUserRep.findAllContactUsers(userId);
    }

    public boolean insertContact(ContactUser contactUser) {
        return contactUserRep.insertContactUser(contactUser);
    }

    public boolean checkExistContact(ContactUser contactUser) {
        return contactUserRep.checkExistContact(contactUser);
    }

    public String updateAccount(User user) {
        boolean emailRegex = EmailValidator.getInstance().isValid(user.getEmail());
        if (user.getUsername().length() < MIN_USERNAME_LENGTH) {
            return "Username invalid (>=6)!";
        }
        if (!emailRegex) {
            return "Email invalid!";
        }
        User userExist = getUser(user.getId());
        if (userExist != null) {
            userExist.setEmail(user.getEmail());
            userExist.setUsername(user.getUsername());
            userExist.setBlock(user.isBlock());
            return userRep.updateUser(userExist) ? "Update successful" : "Update Failed, check internet and try again!";
        }
        return "User doesn't exist, reload page and try again!";
    }

    public String updateRoleAccount(User user) {
        User userExist = getUser(user.getId());
        if (userExist != null) {
            userExist.setRoleId(user.getRoleId());
            return userRep.updateUser(userExist) ? "Update successful" : "Update Failed, check internet and try again!";
        }
        return "User doesn't exist, reload page and try again!";
    }

    public String deleteAccount(int userId) {
        User user = getUser(userId);
        if (user != null) {
            return userRep.deleteUser(userId) ? "Delete account successful"
                    : "Delete account failed, check internet and try again!";
        }
        return "User doesn't exist, reload page and try again!";
    }

    public String sendVerifiCode(String email) {
        User similarUser = userRep.findUser(email);
        if (similarUser == null) {
            return "";
        }

        String to = email;
        String uniqN = EmailProperty.uniqueNumber();
        String subject = EmailProperty.TITLE_MAIL;
        String message = EmailProperty.CONTENT_MAIL + uniqN;
        return !iEmailService.send(to, subject, message).equals("") ? uniqN + "" : "";
    }

    public int countUsers() {
        return userRep.countUsers();
    }
}