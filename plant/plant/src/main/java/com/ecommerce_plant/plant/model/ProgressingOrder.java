package com.ecommerce_plant.plant.model;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author lemonftdev
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProgressingOrder {
    private int orderId;
    private int statusOrder;
    private Integer exchangeId;
    private Timestamp deliveryTime;
    private String cancelPurpose;
}