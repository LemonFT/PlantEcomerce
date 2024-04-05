package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.OrderItem;

@Repository
public class OrderItemRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<OrderItem> findAllOrderItems() {
        String sql = "SELECT * FROM order_item";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(OrderItem.class));
    }

    public boolean insertOrderItem(OrderItem orderItem) {
        String sql = "INSERT INTO order_item (order_id, product_id, number, price, voucher) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, orderItem.getOrder_id(), orderItem.getProduct_id(), orderItem.getNumber(),
                orderItem.getPrice(), orderItem.getVoucher()) > 0;
    }

    public boolean updateOrderItem(OrderItem orderItem) {
        String sql = "UPDATE order_item SET number = ?, price = ?, voucher = ? WHERE order_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, orderItem.getNumber(), orderItem.getPrice(), orderItem.getVoucher(),
                orderItem.getOrder_id(), orderItem.getProduct_id()) > 0;
    }

    public boolean deleteOrderItem(int orderId, int productId) {
        String sql = "DELETE FROM order_item WHERE order_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, orderId, productId) > 0;
    }
}
