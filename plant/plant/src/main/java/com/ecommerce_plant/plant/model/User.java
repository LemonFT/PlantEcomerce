package com.ecommerce_plant.plant.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author lemonftdev
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    private int id;
    private String username;
    private String password;
    private String email;
    private String avatar;
    private boolean gender;
    private Date joinDate;
    private int roleId;
    private boolean block;
    private boolean deleted;
}