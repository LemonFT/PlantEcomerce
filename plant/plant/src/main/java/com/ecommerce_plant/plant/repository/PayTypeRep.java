package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.PayType;

@Repository
public class PayTypeRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<PayType> findAllPayTypes() {
        String sql = "SELECT * FROM pay_type";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(PayType.class));
    }

    public boolean insertPayType(PayType payType) {
        String sql = "INSERT INTO pay_type (name) VALUES (?)";
        return jdbcTemplate.update(sql, payType.getName()) > 0;
    }

    public boolean updatePayType(PayType payType) {
        String sql = "UPDATE pay_type SET name = ? WHERE id = ?";
        return jdbcTemplate.update(sql, payType.getName(), payType.getId()) > 0;
    }

    public boolean deletePayType(int id) {
        String sql = "DELETE FROM pay_type WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
