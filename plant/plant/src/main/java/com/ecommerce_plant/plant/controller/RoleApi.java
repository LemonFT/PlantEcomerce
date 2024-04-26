package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.model.Role;
import com.ecommerce_plant.plant.service.RoleService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class RoleApi {

    @Autowired
    RoleService roleService;

    @GetMapping("authenticed/api/roles")
    public ResponseEntity<?> getAllRole() {
        return ResponseEntity.ok().body(roleService.findAllRole());
    }

    @PutMapping("authenticed/api/role")
    public ResponseEntity<?> updateNameRole(@RequestBody Role role) {
        boolean resultUpdate = roleService.updateNameRole(role);
        return resultUpdate ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }

    @PostMapping("authenticed/api/role")
    public ResponseEntity<?> insertRole(@RequestBody Role role) {
        boolean resultInsert = roleService.insertRole(role);
        return resultInsert ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }
}
