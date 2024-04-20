package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.service.SupplierService;

@RequestMapping("")
@Controller
public class SupplierApi {

    @Autowired
    SupplierService supplierService;

    @GetMapping("/authenticed/api/supplier")
    public ResponseEntity<?> findAllSupplier() {
        return ResponseEntity.ok().body(supplierService.findAllSupplier());
    }

    @DeleteMapping("/authenticed/api/supplier/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable int id) {
        return supplierService.deleteSupplier(id) ? ResponseEntity.ok().body("Delete successful")
                : ResponseEntity.notFound().build();
    }
}
