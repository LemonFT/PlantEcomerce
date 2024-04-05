package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Router;

@Repository
public class RouterRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Router> findAllRouters() {
        String sql = "SELECT * FROM router";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Router.class));
    }

    public boolean insertRouter(Router router) {
        String sql = "INSERT INTO router (role_id, path) VALUES (?, ?)";
        return jdbcTemplate.update(sql, router.getRole_id(), router.getPath()) > 0;
    }

    public boolean updateRouter(Router router) {
        String sql = "UPDATE router SET role_id = ?, path = ? WHERE id = ?";
        return jdbcTemplate.update(sql, router.getRole_id(), router.getPath(), router.getId()) > 0;
    }

    public boolean deleteRouter(int id) {
        String sql = "DELETE FROM router WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
