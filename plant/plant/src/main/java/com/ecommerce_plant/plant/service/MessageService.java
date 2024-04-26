package com.ecommerce_plant.plant.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Message;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.repository.MessageRep;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * @author lemonftdev
 */
@Service
public class MessageService {
    @Autowired
    MessageRep messageRep;

    @Autowired
    UserService userService;

    public List<Message> getAllMessage(int userId) {
        Dotenv dotenv = Dotenv.load();
        int customer = Integer.parseInt(dotenv.get("REACT_APP_CUSTOMER_ROLE"));
        User user = userService.getUser(userId);
        if (user == null) {
            return null;
        }
        if (user.getRoleId() != customer) {
            return messageRep.findAllMessagesWithCustomers();
        }
        return messageRep.findAllMessagesWithAdmin(userId);
    }

    public String insertMessage(Message message) {
        if (message.getUser_receive_id() == 0) {
            User admin = userService.getUserIsAdmin();
            if (admin == null) {
                System.err.println("admin null");
                return "";
            }
            message.setUser_receive_id(admin.getId());
            message.setTime(new Date());
        } else {
            message.setTime(new Date());
        }
        boolean result = messageRep.insertMessage(message);
        return result ? "Insert successfully" : "Insert false";
    }

    public boolean deleteMessage(int userId) {
        return messageRep.deleteMessage(userId);
    }
}