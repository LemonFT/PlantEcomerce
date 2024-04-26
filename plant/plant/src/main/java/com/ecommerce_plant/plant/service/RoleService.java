package com.ecommerce_plant.plant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce_plant.plant.model.Role;
import com.ecommerce_plant.plant.repository.RoleRep;

/**
 * @author lemonftdev
 */
@Service
public class RoleService {
    @Autowired
    RoleRep roleRep;

    public List<Role> findAllRole() {
        return roleRep.findAllRoles();
    }

    public boolean insertRole(Role role) {
        return roleRep.insertRole(role);
    }

    public boolean updateNameRole(Role role) {
        return roleRep.updateRole(role);
    }

}
