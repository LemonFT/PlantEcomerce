package com.ecommerce_plant.plant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * @author lemonftdev
 */

@Service
public class EmailServiceImpl implements IEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public String send(String to, String subject, String messageContent) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ftgarden@gmail.com");
            message.setTo(to);
            message.setText(messageContent);
            message.setSubject(subject);
            mailSender.send(message);
            return messageContent;
        } catch (Exception e) {
            return "";
        }
    }

}