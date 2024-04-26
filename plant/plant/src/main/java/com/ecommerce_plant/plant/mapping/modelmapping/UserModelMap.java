package com.ecommerce_plant.plant.mapping.modelmapping;

import java.util.Date;
import java.util.List;

import com.ecommerce_plant.plant.model.Permission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 
 * @Author: Your Name <your@email.com>
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserModelMap {
    private int id;
    private String email;
    private String name;
    private String avatar;
    private int role;
    private boolean gender;
    private Date joinDate;
    private boolean block;
    private List<Permission> permissions;
}
