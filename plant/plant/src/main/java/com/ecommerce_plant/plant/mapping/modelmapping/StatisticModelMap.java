package com.ecommerce_plant.plant.mapping.modelmapping;

import java.util.List;

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
public class StatisticModelMap {
    private int users;
    private double costProduct;
    private double revenueCash;
    private double revenueVnPay;
    private List<CategoryNumberProduct> categoryNumberProducts;
}