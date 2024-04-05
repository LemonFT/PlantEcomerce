package com.ecommerce_plant.plant.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Permission;

@Repository
public class PermissionRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @SuppressWarnings("deprecation")
    public List<Permission> findPermissionByUserID(int user_id) {
        List<Permission> permissions = new ArrayList<>();
        String sql = "select permission.id, permission.name from user join role on user.role_id = role.id " +
                "join role_permission on role.id = role_permission.id_role " +
                "join permission on role_permission.id_permission = permission.id  " +
                "where user.id = ?";
        try {
            permissions = jdbcTemplate.query(sql, new Object[] { user_id },
                    BeanPropertyRowMapper.newInstance(Permission.class));
            return permissions;
        } catch (Exception e) {
            System.err.println(e);
        }
        return permissions;
    }

}
