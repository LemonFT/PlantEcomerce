package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.ecommerce_plant.plant.model.Message;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.service.MessageService;
import com.ecommerce_plant.plant.service.UserService;

import io.github.cdimascio.dotenv.Dotenv;

@Controller
@CrossOrigin(origins = "*")
public class SocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    MessageService messageService;

    @Autowired
    UserService userService;

    public SocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @SuppressWarnings("null")
    @MessageMapping("/chat")
    @SendTo("/topic/room_private_chat")
    public void chat(Message message) {
        Dotenv dotenv = Dotenv.load();
        int admin_role = Integer.parseInt(dotenv.get("REACT_APP_ADMIN_ROLE"));
        User user = userService.getUser(message.getUser_send_id());
        System.err.println(message.toString());
        if (user.getRole_id() == admin_role) {
            messagingTemplate.convertAndSendToUser(String.valueOf(admin_role), "/queue/reply",
                    "Message admin reply");
        } else {
            System.err.println("customer");
            messagingTemplate.convertAndSendToUser("customers", "/queue/reply", "Message customer reply");
        }
        try {
            String rs = messageService.insertMessage(message);
            System.err.println("result insert: " + rs);
        } catch (Exception e) {
            System.err.println("false insert");
        }
    }

    @MessageMapping("/testService")
    @SendTo("/topic/test")
    public String tesString() {
        System.err.println("socket IO is connect success backend");
        return "service ok";
    }

}
