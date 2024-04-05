package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.User;

@Repository
public class UserRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> findAllUsers() {
        String sql = "SELECT * FROM user";
        try {
            return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUser(int user_id) {
        String sql = "SELECT * FROM user where id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { user_id },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUser(String email) {
        String sql = "SELECT * FROM user where email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { email },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUserByName(String username) {
        String sql = "SELECT * FROM user where username = ? and deleted = ? and block = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { username, false, false },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUserIsAdmin(int role_id) {
        String sql = "SELECT * FROM user join role on role.id = user.role_id where role.id = ? and block = ? limit 1";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { role_id, false },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception e) {
            return null;
        }
    }

    public boolean insertUser(User user) {
        String sql = "INSERT INTO user (username, password, email, avatar, gender, join_date, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getEmail(), user.getAvatar(),
                user.isGender(), user.getJoin_date(), user.getRole_id()) > 0;
    }

    public boolean updateUser(User user) {
        String sql = "UPDATE user SET username = ?, password = ?, email = ?, avatar = ?, gender = ?, join_date = ?, role_id = ?, block = ?, deleted = ? WHERE id = ?";
        return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getEmail(), user.getAvatar(),
                user.isGender(), user.getJoin_date(), user.getRole_id(), user.isBlock(), user.isDeleted(),
                user.getId()) > 0;
    }

    public boolean deleteUser(int id) {
        String sql = "DELETE FROM user WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

}
