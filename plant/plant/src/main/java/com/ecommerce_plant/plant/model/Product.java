package com.ecommerce_plant.plant.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Product {
    private int id;
    private String code;
    private String name;
    private String image;
    private int category_product_id;
    private String description;
    private int amount;
    private double price;
    private float voucher;
    private boolean display;
    private boolean deleted;

}