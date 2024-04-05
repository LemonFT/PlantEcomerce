package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Message;

@Repository
public class MessageRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("deprecation")
    public List<Message> findAllMessagesWithAdmin(int user_send_id) {
        String sql = "SELECT * FROM message where user_send_id = ? or user_receive_id = ?";
        return jdbcTemplate.query(sql, new Object[] { user_send_id, user_send_id },
                BeanPropertyRowMapper.newInstance(Message.class));
    }

    public List<Message> findAllMessagesWithCustomers() {
        String sql = "SELECT * FROM message";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Message.class));
    }

    public boolean insertMessage(Message message) {
        String sql = "INSERT INTO message (user_send_id, user_receive_id, content, time) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, message.getUser_send_id(), message.getUser_receive_id(), message.getContent(),
                message.getTime()) > 0;
    }

    public boolean updateMessage(Message message) {
        String sql = "UPDATE message SET user_send_id = ?, user_receive_id = ?, content = ?, time = ? WHERE id = ?";
        return jdbcTemplate.update(sql, message.getUser_send_id(), message.getUser_receive_id(), message.getContent(),
                message.getTime(), message.getId()) > 0;
    }

    public boolean deleteMessage(int id) {
        String sql = "DELETE FROM message WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
