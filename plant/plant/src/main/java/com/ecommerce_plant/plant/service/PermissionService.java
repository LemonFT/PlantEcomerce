package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Permission;
import com.ecommerce_plant.plant.repository.PermissionRep;

/**
 * 
 * @Author: Your Name <your@email.com>
 */

@Service
public class PermissionService {
    @Autowired
    PermissionRep permissionRep;

    public List<Permission> findPermissionByUserId(int userId) {
        return permissionRep.findPermissionByUserId(userId);
    }

    public List<Permission> findAllPermission() {
        return permissionRep.findAllPermissions();
    }
}
