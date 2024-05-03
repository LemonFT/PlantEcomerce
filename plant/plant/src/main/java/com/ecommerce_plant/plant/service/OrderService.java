package com.ecommerce_plant.plant.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.mapping.modelmapping.OrderItemProduct;
import com.ecommerce_plant.plant.mapping.modelmapping.OrderManagementUser;
import com.ecommerce_plant.plant.mapping.modelmapping.OrderModelMap;
import com.ecommerce_plant.plant.model.Order;
import com.ecommerce_plant.plant.model.ProgressingOrder;
import com.ecommerce_plant.plant.repository.OrderItemRep;
import com.ecommerce_plant.plant.repository.OrderRep;
import com.ecommerce_plant.plant.repository.ProgressingOrderRep;

/**
 * @author lemonftdev
 */

@Service
public class OrderService {
    @Autowired
    OrderRep orderRep;
    @Autowired
    OrderItemRep orderItemRep;
    @Autowired
    ProgressingOrderRep progressingOrderRep;

    public List<OrderManagementUser> getAllOrders() {
        List<OrderManagementUser> orderManagementUsers = new ArrayList<>();
        List<Order> orders = orderRep.findAllOrders();
        if (!orders.isEmpty()) {
            for (Order order : orders) {
                int orderId = order.getId();
                List<OrderItemProduct> orderItemProducts = orderItemRep.findAllOrderItems(orderId);
                ProgressingOrder progressingOrder = progressingOrderRep.findProgressingByOrderId(orderId);
                orderManagementUsers.add(new OrderManagementUser(order, orderItemProducts, progressingOrder));
            }
            return orderManagementUsers;
        }
        return null;
    }

    public List<OrderManagementUser> getAllOrdersByUserId(int userId) {
        List<OrderManagementUser> orderManagementUsers = new ArrayList<>();
        List<Order> orders = orderRep.findAllOrders(userId);
        if (!orders.isEmpty()) {
            for (Order order : orders) {
                int orderId = order.getId();
                List<OrderItemProduct> orderItemProducts = orderItemRep.findAllOrderItems(orderId);
                ProgressingOrder progressingOrder = progressingOrderRep.findProgressingByOrderId(orderId);
                orderManagementUsers.add(new OrderManagementUser(order, orderItemProducts, progressingOrder));
            }
            return orderManagementUsers;
        }
        return null;
    }

    public int insertOrder(OrderModelMap orderModelMap) {
        Order order = orderModelMap.getOrder();
        order.setInitTime(new Timestamp(System.currentTimeMillis()));
        order.setCode("ORD" + System.currentTimeMillis());
        orderModelMap.setOrder(order);
        return orderRep.insertOrder(orderModelMap);
    }

    public boolean deleteOrder(int orderId) {
        return orderRep.deleteOrder(orderId);
    }

}
