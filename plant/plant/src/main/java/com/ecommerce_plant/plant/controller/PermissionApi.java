package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.service.PermissionService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class PermissionApi {

    @Autowired
    PermissionService permissionService;

    @GetMapping("authenticed/api/permissions")
    public ResponseEntity<?> getAllPermission() {
        return ResponseEntity.ok().body(permissionService.findAllPermission());
    }

}
