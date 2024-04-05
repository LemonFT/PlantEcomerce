package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.service.ProductCategoryService;

@Controller
@RequestMapping("")
public class ProductCategoryApi {

    @Autowired
    ProductCategoryService productCategoryService;

    @GetMapping("api/product/category")
    public ResponseEntity<?> getAllCategoryProduct() {
        return ResponseEntity.ok().body(productCategoryService.getAllCategoryProduct());
    }

}
