package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.model.User;

/**
 * @author lemonftdev
 */
@Repository
@Transactional
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
        String sql = "SELECT * FROM user where id = ? AND deleted = 0";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { userId },
                    BeanPropertyRowMapper.newInstance(User.class));
        } catch (Exception ex) {
            return null;
        }
    }

    @SuppressWarnings("deprecation")
    public User findUser(String email) {
        String sql = "SELECT * FROM user where email COLLATE utf8mb4_bin = ? AND deleted = 0";
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
        String sql = "SELECT * FROM user join role on role.id = user.role_id where role.id = ? and block = ? and deleted = 0 limit 1";
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

    public boolean updatePwd(User user) {
        String sql = "UPDATE user SET password = ? WHERE email = ?";
        return jdbcTemplate.update(sql, user.getPassword(), user.getEmail()) > 0;
    }

    public boolean deleteUser(int id) {
        try {
            String sql = "UPDATE user SET deleted = 1 WHERE id = ?";
            jdbcTemplate.update(sql, id);
            String sqlProcedure = "{CALL update_email_username_after_update_procedure(?)}";
            jdbcTemplate.update(sqlProcedure, id);
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return false;
        }
    }

    public int countUsers() {
        String sql = "SELECT COUNT(id) FROM user";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
}
