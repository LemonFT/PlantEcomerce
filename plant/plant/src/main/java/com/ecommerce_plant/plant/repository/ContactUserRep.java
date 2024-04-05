package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ContactUser;

@Repository
public class ContactUserRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("deprecation")
    public List<ContactUser> findAllContactUsers(int user_id) {
        String sql = "SELECT * FROM contact_user where user_id = ?";
        try {
            return jdbcTemplate.query(sql, new Object[] { user_id },
                    BeanPropertyRowMapper.newInstance(ContactUser.class));
        } catch (Exception e) {
            return null;
        }
    }

    public boolean checkExistContact(ContactUser contactUser) {
        String sql = "SELECT * FROM contact_user where user_id = ? and address_category = ? and address = ? and phone_number = ?";
        try {
            @SuppressWarnings("deprecation")
            List<ContactUser> contactUsers = jdbcTemplate.query(sql,
                    new Object[] { contactUser.getUser_id(), contactUser.getAddress_category(),
                            contactUser.getAddress(), contactUser.getPhone_number() },
                    BeanPropertyRowMapper.newInstance(ContactUser.class));
            if (!contactUsers.isEmpty()) {
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    public boolean insertContactUser(ContactUser contactUser) {
        String sql = "INSERT INTO contact_user (user_id, address_category, address, phone_number) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, contactUser.getUser_id(), contactUser.getAddress_category(),
                contactUser.getAddress(), contactUser.getPhone_number()) > 0;
    }

    public boolean updateContactUser(ContactUser contactUser) {
        String sql = "UPDATE contact_user SET address_category = ?, address = ?, phone_number = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql, contactUser.getAddress_category(), contactUser.getAddress(),
                contactUser.getPhone_number(), contactUser.getUser_id()) > 0;
    }

    public boolean deleteContactUser(int userId) {
        String sql = "DELETE FROM contact_user WHERE user_id = ?";
        return jdbcTemplate.update(sql, userId) > 0;
    }
}
