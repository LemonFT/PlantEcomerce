package com.ecommerce_plant.plant.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.ecommerce_plant.plant.mapping.modelmapping.OrderItemProduct;
import com.ecommerce_plant.plant.model.OrderItem;
import com.ecommerce_plant.plant.model.Product;

/**
 * @author lemonftdev
 */
@Repository
@Transactional(rollbackFor = { Exception.class, DataAccessException.class })
public class OrderItemRep {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private ProductRep productRep;

    public List<OrderItem> findAllOrderItems() {
        String sql = "SELECT * FROM order_item";
        return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(OrderItem.class));
    }

    @SuppressWarnings("deprecation")
    public List<OrderItemProduct> findAllOrderItems(int orderId) {
        String sql = "SELECT oi.order_id, oi.product_id, oi.number, oi.price, oi.voucher, p.name AS productName FROM order_item AS oi JOIN product AS p ON oi.product_id = p.id  WHERE oi.order_id = ?";
        return jdbcTemplate.query(sql, new Object[] { orderId },
                BeanPropertyRowMapper.newInstance(OrderItemProduct.class));
    }

    public boolean insertOrderItem(OrderItem orderItem) {
        String sql = "INSERT INTO order_item (order_id, product_id, number, price, voucher) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, orderItem.getOrderId(), orderItem.getProductId(), orderItem.getNumber(),
                orderItem.getPrice(), orderItem.getVoucher()) > 0;
    }

    public boolean updateOrderItem(OrderItem orderItem) {
        String sql = "UPDATE order_item SET number = ?, price = ?, voucher = ? WHERE order_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, orderItem.getNumber(), orderItem.getPrice(), orderItem.getVoucher(),
                orderItem.getOrderId(), orderItem.getProductId()) > 0;
    }

    public boolean deleteOrderItem(int orderId, int productId) {
        String sql = "DELETE FROM order_item WHERE order_id = ? AND product_id = ?";
        return jdbcTemplate.update(sql, orderId, productId) > 0;
    }

    public boolean deleteOrderItemByOrderId(int orderId) {
        try {
            List<OrderItemProduct> orderItems = findAllOrderItems(orderId);
            for (OrderItemProduct orderItem : orderItems) {
                Product product = productRep.findProduct(orderItem.getProductId());
                productRep.updateProductNumber(product.getId(), product.getAmount() + orderItem.getNumber());
            }
            String sql = "DELETE FROM order_item WHERE order_id = ?";
            return jdbcTemplate.update(sql, orderId) > 0;
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
        return false;
    }
}
