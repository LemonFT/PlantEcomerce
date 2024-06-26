package com.ecommerce_plant.plant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce_plant.plant.mapping.MessageMapping;
import com.ecommerce_plant.plant.model.Message;
import com.ecommerce_plant.plant.service.MessageService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@RestController
public class MessageApi {
    @Autowired
    MessageService messageService;

    @Autowired
    MessageMapping messageMapping;

    @GetMapping("authenticed/api/message/{userId}")
    public ResponseEntity<?> getAllMessageWithCustomer(@PathVariable int userId) {
        List<Message> messages = messageService.getAllMessage(userId);
        if (!messages.isEmpty()) {
            return ResponseEntity.ok().body(messageMapping.getAllMessageAndUser(messages));
        }
        return ResponseEntity.ok().body(messages);
    }

    @DeleteMapping("authenticed/api/message/{userId}")
    public ResponseEntity<?> deleteMessage(@PathVariable int userId) {
        boolean result = messageService.deleteMessage(userId);
        return result ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }
}