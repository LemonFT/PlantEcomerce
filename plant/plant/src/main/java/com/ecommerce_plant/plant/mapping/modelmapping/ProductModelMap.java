package com.ecommerce_plant.plant.mapping.modelmapping;

import java.util.List;

import com.ecommerce_plant.plant.model.Product;

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
public class ProductModelMap {
    private List<Product> products;
    private int total_amount;
}