package com.ecommerce_plant.plant.mapping.modelmapping;

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
public class OrderItemProduct {
    private int orderId;
    private int productId;
    private int number;
    private double price;
    private float voucher;
    private String productName;
}
