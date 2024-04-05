package com.ecommerce_plant.plant.mapping;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ecommerce_plant.plant.mapping.modelmapping.MessageModelMap;
import com.ecommerce_plant.plant.model.Message;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.service.UserService;

import io.github.cdimascio.dotenv.Dotenv;

@Component
public class MessageMapping {
    @Autowired
    UserService userService;
    private static final int ROLE_ID_FAKE = -1;

    public List<MessageModelMap> getAllMessageAndUser(List<Message> messages) {
        List<MessageModelMap> messageModelMaps = new ArrayList<>();
        for (Message message : messages) {
            User user = userService.getUser(message.getUser_send_id());
            Dotenv dotenv = Dotenv.load();
            int admin_role = Integer.parseInt(dotenv.get("REACT_APP_ADMIN_ROLE"));
            if (admin_role == user.getRole_id()) {
                user.setRole_id(ROLE_ID_FAKE);
            }
            user.setPassword("");
            messageModelMaps.add(new MessageModelMap(user, message));
        }
        return messageModelMaps;
    }
}
