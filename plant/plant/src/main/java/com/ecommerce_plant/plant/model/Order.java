package com.ecommerce_plant.plant.model;

import java.sql.Timestamp;

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
public class Order {
    private int id;
    private String code;
    private Timestamp initTime;
    private Integer userConfirmId;
    private int userReceiveId;
    private String address;
    private String phoneNumber;
    private double totalPay;
    private int payTypeId;
}
