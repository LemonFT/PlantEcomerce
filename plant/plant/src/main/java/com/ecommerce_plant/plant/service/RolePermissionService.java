package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.mapping.modelmapping.RolePermissionMap;
import com.ecommerce_plant.plant.model.RolePermission;
import com.ecommerce_plant.plant.repository.RolePermissionRep;

/**
 * @author lemonftdev
 */
@Service
public class RolePermissionService {
    @Autowired
    RolePermissionRep rolePermissionRep;

    public List<RolePermission> findPermissionByRoleId(int roleId) {
        return rolePermissionRep.findAllPermissionsByRoleId(roleId);
    }

    public boolean updatePermissionsByRole(RolePermissionMap rolePermissionMap) {
        return rolePermissionRep.updatePermissionsByRole(rolePermissionMap);
    }

}
