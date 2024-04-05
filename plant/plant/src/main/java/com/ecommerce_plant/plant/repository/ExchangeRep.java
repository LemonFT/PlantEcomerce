package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Exchange;

@Repository
public class ExchangeRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Exchange> findAllExchanges() {
        String sql = "SELECT * FROM exchange";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Exchange.class));
    }

    public boolean insertExchange(Exchange exchange) {
        String sql = "INSERT INTO exchange (transaction, pay_type_id) VALUES (?, ?)";
        return jdbcTemplate.update(sql, exchange.getTransaction(), exchange.getPay_type_id()) > 0;
    }

    public boolean updateExchange(Exchange exchange) {
        String sql = "UPDATE exchange SET transaction = ?, pay_type_id = ? WHERE id = ?";
        return jdbcTemplate.update(sql, exchange.getTransaction(), exchange.getPay_type_id(), exchange.getId()) > 0;
    }

    public boolean deleteExchange(int id) {
        String sql = "DELETE FROM exchange WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
