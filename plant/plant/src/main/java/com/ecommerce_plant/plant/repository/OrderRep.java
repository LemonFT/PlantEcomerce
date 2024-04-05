package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ecommerce_plant.plant.model.Order;

@Repository
public class OrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Order> findAllOrders() {
        String sql = "SELECT * FROM orders";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Order.class));
    }

    public boolean insertOrder(Order order) {
        String sql = "INSERT INTO orders (code, init_time, user_confirm_id, user_receive_id, address, phone_number, total_pay, pay_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, order.getCode(), order.getInit_time(), order.getUser_confirm_id(),
                order.getUser_receive_id(), order.getAddress(), order.getPhone_number(), order.getTotal_pay(),
                order.getPay_type_id()) > 0;
    }

    public boolean updateOrder(Order order) {
        String sql = "UPDATE orders SET code = ?, init_time = ?, user_confirm_id = ?, user_receive_id = ?, address = ?, phone_number = ?, total_pay = ?, pay_type_id = ? WHERE id = ?";
        return jdbcTemplate.update(sql, order.getCode(), order.getInit_time(), order.getUser_confirm_id(),
                order.getUser_receive_id(), order.getAddress(), order.getPhone_number(), order.getTotal_pay(),
                order.getPay_type_id(), order.getId()) > 0;
    }

    public boolean deleteOrder(int id) {
        String sql = "DELETE FROM orders WHERE id = ?";
        return jdbcTemplate.update(sql, id) > 0;
    }
}
