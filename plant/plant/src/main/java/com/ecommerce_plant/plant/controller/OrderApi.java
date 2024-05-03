package com.ecommerce_plant.plant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.OrderManagementUser;
import com.ecommerce_plant.plant.mapping.modelmapping.OrderModelMap;
import com.ecommerce_plant.plant.service.OrderService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class OrderApi {

    @Autowired
    OrderService orderService;

    @GetMapping("authenticed/api/orders")
    public ResponseEntity<?> getAllOrders() {
        List<OrderManagementUser> orderItemProducts = orderService.getAllOrders();
        return orderItemProducts == null ? ResponseEntity.badRequest().body(null)
                : ResponseEntity.ok().body(orderItemProducts);
    }

    @GetMapping("authenticed/api/orders/{userId}")
    public ResponseEntity<?> getAllOrdersByUserId(@PathVariable int userId) {
        List<OrderManagementUser> orderItemProducts = orderService.getAllOrdersByUserId(userId);
        return orderItemProducts == null ? ResponseEntity.badRequest().body(null)
                : ResponseEntity.ok().body(orderItemProducts);
    }

    @PostMapping("authenticed/api/order")
    public ResponseEntity<?> insertOrder(@RequestBody OrderModelMap orderModelMap) {
        int orderId = orderService.insertOrder(orderModelMap);
        return orderId != 0 ? ResponseEntity.ok().body(orderId + "")
                : ResponseEntity.badRequest().body(orderId + "");
    }

    @DeleteMapping("authenticed/api/order/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable int orderId) {
        return orderService.deleteOrder(orderId) ? ResponseEntity.ok().body(200)
                : ResponseEntity.badRequest().body(400);
    }

}
