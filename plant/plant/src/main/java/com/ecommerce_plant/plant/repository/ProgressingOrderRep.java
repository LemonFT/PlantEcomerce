package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ProgressingOrder;

@Repository
public class ProgressingOrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ProgressingOrder> findAllProgressingOrders() {
        String sql = "SELECT * FROM progressing_order";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ProgressingOrder.class));
    }

    public boolean insertProgressingOrder(ProgressingOrder progressingOrder) {
        String sql = "INSERT INTO progressing_order (order_id, status_order, exchange_id, delivery_time, cancel_purpose) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, progressingOrder.getOrder_id(), progressingOrder.getStatus_order(),
                progressingOrder.getExchange_id(), progressingOrder.getDelivery_time(),
                progressingOrder.getCancel_purpose()) > 0;
    }

    public boolean updateProgressingOrder(ProgressingOrder progressingOrder) {
        String sql = "UPDATE progressing_order SET status_order = ?, exchange_id = ?, delivery_time = ?, cancel_purpose = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, progressingOrder.getStatus_order(), progressingOrder.getExchange_id(),
                progressingOrder.getDelivery_time(), progressingOrder.getCancel_purpose(),
                progressingOrder.getOrder_id()) > 0;
    }

    public boolean deleteProgressingOrder(int orderId) {
        String sql = "DELETE FROM progressing_order WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId) > 0;
    }
}
