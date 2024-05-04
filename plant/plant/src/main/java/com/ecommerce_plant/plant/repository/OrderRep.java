package com.ecommerce_plant.plant.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.mapping.modelmapping.OrderModelMap;
import com.ecommerce_plant.plant.model.Order;
import com.ecommerce_plant.plant.model.OrderItem;
import com.ecommerce_plant.plant.model.Product;
import com.ecommerce_plant.plant.model.ProgressingOrder;

/**
 * @author lemonftdev
 * 
 */
@Repository
@Transactional(rollbackFor = { SQLException.class, DataAccessException.class })
public class OrderRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private OrderItemRep orderItemRep;
    @Autowired
    private ProgressingOrderRep progressingOrderRep;
    @Autowired
    private ProductRep productRep;

    public List<Order> findAllOrders() {
        String sql = "SELECT * FROM `order`";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(Order.class));
    }

    @SuppressWarnings("deprecation")
    public Order findOrders(int orderId) {
        String sql = "SELECT * FROM `order` WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[] { orderId },
                BeanPropertyRowMapper.newInstance(Order.class));
    }

    @SuppressWarnings("deprecation")
    public List<Order> findAllOrders(int userId) {
        String sql = "SELECT * FROM `order` WHERE user_receive_id = ? ORDER BY init_time DESC";
        return jdbcTemplate.query(sql, new Object[] { userId }, BeanPropertyRowMapper.newInstance(Order.class));
    }

    public int insertOrder(OrderModelMap orderModelMap) {
        try {
            System.err.println(orderModelMap.getOrder());
            Order order = orderModelMap.getOrder();
            String sql = "INSERT INTO `order` (code, init_time, user_receive_id, address, phone_number, total_pay, pay_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, order.getCode());
                ps.setTimestamp(2, order.getInitTime());
                ps.setInt(3, order.getUserReceiveId());
                ps.setString(4, order.getAddress());
                ps.setString(5, order.getPhoneNumber());
                ps.setDouble(6, order.getTotalPay());
                ps.setInt(7, order.getPayTypeId());
                return ps;
            }, keyHolder);
            int orderId = keyHolder.getKey().intValue();
            for (OrderItem orderItem : orderModelMap.getOrderItems()) {
                Product product = productRep.findProduct(orderItem.getProductId());
                System.err.println(product.getAmount() + "");
                System.err.println(orderItem.getNumber());
                if (product.getAmount() < orderItem.getNumber()) {
                    TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                    return 0;
                }
                orderItem.setOrderId(orderId);
                productRep.updateProductNumber(product.getId(), product.getAmount() - orderItem.getNumber());
                orderItemRep.insertOrderItem(orderItem);
            }
            progressingOrderRep.insertProgressingOrder(new ProgressingOrder(orderId, 0, null, null, null));
            return orderId;
        } catch (Exception e) {
            System.err.println(e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return 0;
    }

    public boolean updateOrder(Order order) {
        String sql = "UPDATE `order` SET code = ?, init_time = ?, user_confirm_id = ?, user_receive_id = ?, address = ?, phone_number = ?, total_pay = ?, pay_type_id = ? WHERE id = ?";
        return jdbcTemplate.update(sql, order.getCode(), order.getInitTime(), order.getUserConfirmId(),
                order.getUserReceiveId(), order.getAddress(), order.getPhoneNumber(), order.getTotalPay(),
                order.getPayTypeId(), order.getId()) > 0;
    }

    public boolean deleteOrder(int id) {
        try {
            progressingOrderRep.deleteProgressingOrder(id);
            orderItemRep.deleteOrderItemByOrderId(id);
            String sql = "DELETE FROM `order` WHERE id = ?";
            jdbcTemplate.update(sql, id);
            return true;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
    }
}
