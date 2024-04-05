package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Permission;
import com.ecommerce_plant.plant.repository.PermissionRep;

@Service
public class PermissionService {
    @Autowired
    PermissionRep permissionRep;

    public List<Permission> findPermissionByUserID(int user_id) {
        return permissionRep.findPermissionByUserID(user_id);
    }
}
