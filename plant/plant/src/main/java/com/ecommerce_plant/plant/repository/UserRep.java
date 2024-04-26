package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.User;

/**
 * @author lemonftdev
 */
@Repository
public class UserRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> findAllUsers() {
        String sql = "SELECT * FROM user WHERE deleted = 0";
        try {
            return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUser(int userId) {
        String sql = "SELECT * FROM user where id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { userId },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUser(String email) {
        String sql = "SELECT * FROM user where email COLLATE utf8mb4_bin = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { email },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUserByName(String username) {
        String sql = "SELECT * FROM user where username COLLATE utf8mb4_bin = ? and deleted = ? and block = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { username, false, false },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUserIsAdmin(int roleId) {
        String sql = "SELECT * FROM user join role on role.id = user.role_id where role.id = ? and block = ? limit 1";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { roleId, false },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception e) {
            return null;
        }
    }

    public boolean insertUser(User user) {
        String sql = "INSERT INTO user (username, password, email, avatar, gender, join_date, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getEmail(), user.getAvatar(),
                user.isGender(), user.getJoinDate(), user.getRoleId()) > 0;
    }

    public boolean updateUser(User user) {
        String sql = "UPDATE user SET username = ?, password = ?, email = ?, avatar = ?, gender = ?, join_date = ?, role_id = ?, block = ?, deleted = ? WHERE id = ?";
        return jdbcTemplate.update(sql, user.getUsername(), user.getPassword(), user.getEmail(), user.getAvatar(),
                user.isGender(), user.getJoinDate(), user.getRoleId(), user.isBlock(), user.isDeleted(),
                user.getId()) > 0;
    }

    public boolean deleteUser(int id) {
        String sql = "UPDATE user SET deleted = 1 WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }

}
