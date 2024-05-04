package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.service.SuccessOrderService;

/**
 * @author lemonftdev
 */

@RequestMapping("")
@Controller
public class SuccessOrderApi {

    @Autowired
    SuccessOrderService successOrderService;

    @GetMapping("authenticed/api/success-revenue/{year}")
    public ResponseEntity<?> getTotalRevenueFromSuccessOrder(@PathVariable int year) {
        return ResponseEntity.ok().body(successOrderService.getTotalRevenueFromSuccessOrder(year));
    }
}
