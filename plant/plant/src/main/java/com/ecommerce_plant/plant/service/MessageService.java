package com.ecommerce_plant.plant.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Message;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.repository.MessageRep;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class MessageService {
    @Autowired
    MessageRep messageRep;

    @Autowired
    UserService userService;

    public List<Message> getAllMessage(int user_id) {
        Dotenv dotenv = Dotenv.load();
        int admin_role = Integer.parseInt(dotenv.get("REACT_APP_ADMIN_ROLE"));
        User user = userService.getUser(user_id);
        if (user == null) {
            return null;
        }
        if (user.getRole_id() == admin_role) {
            return messageRep.findAllMessagesWithCustomers();
        }
        return messageRep.findAllMessagesWithAdmin(user_id);
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
}