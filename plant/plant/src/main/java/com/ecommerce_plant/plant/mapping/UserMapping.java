package com.ecommerce_plant.plant.mapping;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ecommerce_plant.plant.mapping.modelmapping.UserModelMap;
import com.ecommerce_plant.plant.model.Permission;
import com.ecommerce_plant.plant.model.User;
import com.ecommerce_plant.plant.service.PermissionService;

/**
 * 
 * @Author: Your Name <your@email.com>
 */
@Component
public class UserMapping {

    @Autowired
    PermissionService permissionService;

    public UserModelMap getInformationUser(User user) {
        List<Permission> permissions = permissionService.findPermissionByUserId(user.getId());
        UserModelMap userModelMap = new UserModelMap(user.getId(), user.getEmail(), user.getUsername(),
                user.getAvatar(), user.getRoleId(), user.isGender(), user.getJoinDate(), user.isBlock(), permissions);
        return userModelMap;
    }
}
