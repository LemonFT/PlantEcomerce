package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.CancelOrder;

@Repository
public class CancelOrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<CancelOrder> findAllCancelOrders() {
        String sql = "SELECT * FROM cancel_order";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(CancelOrder.class));
    }

    public boolean insertCancelOrder(CancelOrder cancelOrder) {
        String sql = "INSERT INTO cancel_order (order_id, exchange_id, refund_code, cancel_time, cancel_purpose) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, cancelOrder.getOrder_id(), cancelOrder.getExchange_id(),
                cancelOrder.getRefund_code(), cancelOrder.getCancel_time(), cancelOrder.getCancel_purpose()) > 0;
    }

    public boolean updateCancelOrder(CancelOrder cancelOrder) {
        String sql = "UPDATE cancel_order SET exchange_id = ?, refund_code = ?, cancel_time = ?, cancel_purpose = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, cancelOrder.getExchange_id(), cancelOrder.getRefund_code(),
                cancelOrder.getCancel_time(), cancelOrder.getCancel_purpose(), cancelOrder.getOrder_id()) > 0;
    }

    public boolean deleteCancelOrder(int orderId) {
        String sql = "DELETE FROM cancel_order WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId) > 0;
    }
}
