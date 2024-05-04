package com.ecommerce_plant.plant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.CategoryNumberProduct;
import com.ecommerce_plant.plant.mapping.modelmapping.StatisticModelMap;
import com.ecommerce_plant.plant.service.ImportInvoiceService;
import com.ecommerce_plant.plant.service.ProductService;
import com.ecommerce_plant.plant.service.SuccessOrderService;
import com.ecommerce_plant.plant.service.UserService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class StatisticApi {

    @Autowired
    UserService userService;
    @Autowired
    ImportInvoiceService importInvoiceService;
    @Autowired
    SuccessOrderService successOrderService;
    @Autowired
    ProductService productService;

    @GetMapping("authenticed/api/statistics/{year}")
    public ResponseEntity<?> countUsers(@PathVariable int year) {
        int users = userService.countUsers();
        double costProduct = importInvoiceService.getCostByYear(year);
        double revenueCash = successOrderService.getTotalRevenueFromSuccessOrderAndCash(year);
        double revenueVnPay = successOrderService.getTotalRevenueFromSuccessOrderAndVnPay(year);
        List<CategoryNumberProduct> categoryNumberProducts = productService.findNumberProductByCategory();
        return ResponseEntity.ok()
                .body(new StatisticModelMap(users, costProduct, revenueCash, revenueVnPay, categoryNumberProducts));
    }
}
