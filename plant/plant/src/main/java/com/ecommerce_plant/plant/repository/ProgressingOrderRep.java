package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.ProgressingOrder;

/**
 * @author lemonftdev
 */
@Repository
public class ProgressingOrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ProgressingOrder> findAllProgressingOrders() {
        String sql = "SELECT * FROM progressing_order";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(ProgressingOrder.class));
    }

    @SuppressWarnings("deprecation")
    public ProgressingOrder findProgressingByOrderId(int orderId) {
        String sql = "SELECT * FROM progressing_order WHERE order_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { orderId },
                    BeanPropertyRowMapper.newInstance(ProgressingOrder.class));
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean insertProgressingOrder(ProgressingOrder progressingOrder) {
        String sql = "INSERT INTO progressing_order (order_id, status_order, exchange_id, delivery_time, cancel_purpose) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, progressingOrder.getOrderId(), progressingOrder.getStatusOrder(),
                progressingOrder.getExchangeId(), progressingOrder.getDeliveryTime(),
                progressingOrder.getCancelPurpose()) > 0;
    }

    public boolean updateProgressingOrder(ProgressingOrder progressingOrder) {
        String sql = "UPDATE progressing_order SET status_order = ?, exchange_id = ?, delivery_time = ?, cancel_purpose = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, progressingOrder.getStatusOrder(), progressingOrder.getExchangeId(),
                progressingOrder.getDeliveryTime(), progressingOrder.getCancelPurpose(),
                progressingOrder.getOrderId()) > 0;
    }

    public boolean updateExchangeProgressingOrder(int orderId, int exchangeId) {
        String sql = "UPDATE progressing_order SET exchange_id = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, exchangeId, orderId) > 0;
    }

    public boolean updateStatusProgressingOrder(int orderId, int statusOrder) {
        String sql = "UPDATE progressing_order SET status_order = ? WHERE order_id = ?";
        return jdbcTemplate.update(sql, statusOrder, orderId) > 0;
    }

    public boolean deleteProgressingOrder(int orderId) {
        String sql = "DELETE FROM progressing_order WHERE order_id = ?";
        return jdbcTemplate.update(sql, orderId) > 0;
    }
}
