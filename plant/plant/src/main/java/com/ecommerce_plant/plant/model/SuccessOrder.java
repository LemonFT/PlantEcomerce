package com.ecommerce_plant.plant.model;

import java.util.Date;

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
public class SuccessOrder {
    private int orderId;
    private int exchangeId;
    private Date deliveryTime;
    private Date completeTime;
}
