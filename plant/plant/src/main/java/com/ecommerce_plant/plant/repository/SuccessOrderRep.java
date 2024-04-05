package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.SuccessOrder;

@Repository
public class SuccessOrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<SuccessOrder> findAllSuccessOrders() {
        String sql = "SELECT * FROM success_order";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(SuccessOrder.class));
    }

    public boolean insertSuccessOrder(SuccessOrder successOrder) {
        String sql = "INSERT INTO success_order (order_id, exchange_id, delivery_time, complete_time) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, successOrder.getOrder_id(), successOrder.getExchange_id(),
                successOrder.getDelivery_time(), successOrder.getComplete_time()) > 0;
    }

    public boolean updateSuccessOrder(SuccessOrder successOrder) {
        String sql = "UPDATE success_order SET exchange_id = ?, delivery_time = ?, complete_time = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, successOrder.getExchange_id(), successOrder.getDelivery_time(),
                successOrder.getComplete_time(), successOrder.getOrder_id()) > 0;
    }

    public boolean deleteSuccessOrder(int orderId) {
        String sql = "DELETE FROM success_order WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId) > 0;
    }
}
