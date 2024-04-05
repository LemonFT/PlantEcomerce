package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Role;

@Repository
public class RoleRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Role> findAllRoles() {
        String sql = "SELECT * FROM role";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Role.class));
    }

    public boolean insertRole(Role role) {
        String sql = "INSERT INTO role (name) VALUES (?)";
        return jdbcTemplate.update(sql, role.getName()) > 0;
    }

    public boolean updateRole(Role role) {
        String sql = "UPDATE role SET name = ? WHERE id = ?";
        return jdbcTemplate.update(sql, role.getName(), role.getId()) > 0;
    }

    public boolean deleteRole(int id) {
        String sql = "DELETE FROM role WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
