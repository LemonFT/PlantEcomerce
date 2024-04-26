package com.ecommerce_plant.plant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ecommerce_plant.plant.mapping.modelmapping.RolePermissionMap;
import com.ecommerce_plant.plant.service.RolePermissionService;

/**
 * @author lemonftdev
 */
@RequestMapping("")
@Controller
public class RolePermissionApi {
    @Autowired
    RolePermissionService rolePermissionService;

    @GetMapping("authenticed/api/role-permission/{roleId}")
    public ResponseEntity<?> getAllPermissionByRoleId(@PathVariable int roleId) {
        return ResponseEntity.ok().body(rolePermissionService.findPermissionByRoleId(roleId));
    }

    @PostMapping("authenticed/api/role-permission")
    public ResponseEntity<?> updatePermissionsByRole(@RequestBody RolePermissionMap rolePermissionMap) {
        boolean resultUpdate = rolePermissionService.updatePermissionsByRole(rolePermissionMap);
        return resultUpdate ? ResponseEntity.ok().body(200) : ResponseEntity.badRequest().body(400);
    }

}
