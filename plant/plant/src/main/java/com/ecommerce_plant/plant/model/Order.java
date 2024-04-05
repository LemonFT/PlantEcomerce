package com.ecommerce_plant.plant.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private int id;
    private String code;
    private Date init_time;
    private int user_confirm_id;
    private int user_receive_id;
    private String address;
    private String phone_number;
    private double total_pay;
    private int pay_type_id;
}
