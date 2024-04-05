package com.ecommerce_plant.plant.mapping.modelmapping;

import com.ecommerce_plant.plant.model.Product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartModelMap {
    private int number;
    private Product product;
}
