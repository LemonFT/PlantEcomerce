package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.OrdersStatusMapping;
import com.ecommerce_plant.plant.service.ProgressingOrderService;

/**
 * @author lemonftdev
 */

@RequestMapping("")
@Controller
public class ProgressingOrderApi {

    @Autowired
    ProgressingOrderService progressingOrderService;

    @PutMapping("authenticed/api/progressingorder/{orderId}/{statusOrder}")
    public ResponseEntity<?> updateStatusProgressingOrder(@PathVariable int orderId, @PathVariable int statusOrder) {
        System.err.println("abc");
        return progressingOrderService.updateStatusProgressingOrder(orderId, statusOrder)
                ? ResponseEntity.ok().body(200)
                : ResponseEntity.notFound().build();
    }

    @PutMapping("authenticed/api/progressingorder")
    public ResponseEntity<?> updateStatusProgressingOrders(@RequestBody OrdersStatusMapping ordersStatusMapping) {
        System.err.println(ordersStatusMapping.toString());
        return progressingOrderService.updateStatusProgressingOrders(ordersStatusMapping.getOrders(),
                ordersStatusMapping.getStatus())
                        ? ResponseEntity.ok().body(200)
                        : ResponseEntity.notFound().build();
    }
}
