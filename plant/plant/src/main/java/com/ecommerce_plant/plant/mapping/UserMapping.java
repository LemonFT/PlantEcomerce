package com.ecommerce_plant.plant.mapping;

import org.springframework.stereotype.Component;

import com.ecommerce_plant.plant.mapping.modelmapping.UserModelMap;
import com.ecommerce_plant.plant.model.User;

@Component
public class UserMapping {
    public UserModelMap getInformationUser(User user) {
        UserModelMap userModelMap = new UserModelMap(user.getId(), user.getEmail(), user.getUsername(),
                user.getAvatar(), user.getRole_id(), user.isGender());
        return userModelMap;
    }
}
